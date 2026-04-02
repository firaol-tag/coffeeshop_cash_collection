import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function listBookings(query) {
  const { unpaid_credit, limit = '100', offset = '0' } = query;
  let sql = `
    SELECT b.id, b.user_id, b.total_price, b.payment_type, b.payment_status, b.created_at, b.processed_by,
           u.name AS customer_name, u.email AS customer_email,
           p.name AS processed_by_name
    FROM bookings b
    LEFT JOIN users u ON u.id = b.user_id
    LEFT JOIN users p ON p.id = b.processed_by
  `;
  const params = [];
  if (unpaid_credit === '1' || unpaid_credit === 'true') {
    sql += ` WHERE b.payment_type = 'Credit' AND b.payment_status = 'Unpaid'`;
  }
  sql += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit) || 100, Number(offset) || 0);
  const [rows] = await pool.query(sql, params);

  for (const row of rows) {
    const [items] = await pool.query(
      `SELECT bi.id, bi.menu_item_id, bi.quantity, bi.price_at_time, m.name AS menu_name
       FROM booking_items bi
       JOIN menu_items m ON m.id = bi.menu_item_id
       WHERE bi.booking_id = ?`,
      [row.id]
    );
    row.items = items;
  }
  return rows;
}

export async function createBooking(body, processedByUserId) {
  const { user_id, payment_type, items } = body || {};
  if (!user_id || !payment_type || !Array.isArray(items) || items.length === 0) {
    throw new HttpError(
      400,
      'user_id, payment_type (Cash|Credit), and non-empty items[] required'
    );
  }
  if (!['Cash', 'Credit'].includes(payment_type)) {
    throw new HttpError(400, 'payment_type must be Cash or Credit');
  }

  const payment_status = payment_type === 'Cash' ? 'Paid' : 'Unpaid';
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let total = 0;
    const lineRows = [];
    for (const line of items) {
      const { menu_item_id, quantity } = line;
      const q = Number(quantity);
      if (!menu_item_id || !q || q < 1) {
        throw new HttpError(400, 'Invalid line item');
      }
      const [mrows] = await conn.query(
        'SELECT id, price FROM menu_items WHERE id = ? FOR UPDATE',
        [menu_item_id]
      );
      const menu = mrows[0];
      if (!menu) {
        throw new HttpError(400, 'Unknown menu_item_id');
      }
      const lineTotal = Number(menu.price) * q;
      total += lineTotal;
      lineRows.push({ menu_item_id, quantity: q, price_at_time: menu.price });
    }

    const [bResult] = await conn.query(
      `INSERT INTO bookings (user_id, total_price, payment_type, payment_status, processed_by)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, total, payment_type, payment_status, processedByUserId]
    );
    const bookingId = bResult.insertId;

    for (const line of lineRows) {
      await conn.query(
        `INSERT INTO booking_items (booking_id, menu_item_id, quantity, price_at_time)
         VALUES (?, ?, ?, ?)`,
        [bookingId, line.menu_item_id, line.quantity, line.price_at_time]
      );
    }

    await conn.commit();
    return { id: bookingId, total_price: total, payment_status };
  } catch (e) {
    await conn.rollback();
    if (e instanceof HttpError) throw e;
    throw new HttpError(500, e.message || 'Booking failed');
  } finally {
    conn.release();
  }
}

export async function updateCreditPaymentStatus(bookingId, payment_status) {
  if (payment_status !== 'Paid' && payment_status !== 'Unpaid') {
    throw new HttpError(400, 'payment_status must be Paid or Unpaid');
  }
  const [rows] = await pool.query(
    `SELECT id, payment_type FROM bookings WHERE id = ?`,
    [bookingId]
  );
  const booking = rows[0];
  if (!booking) {
    throw new HttpError(404, 'Booking not found');
  }
  if (booking.payment_type !== 'Credit') {
    throw new HttpError(
      400,
      'Only credit bookings can have payment status updated here'
    );
  }
  await pool.query(`UPDATE bookings SET payment_status = ? WHERE id = ?`, [
    payment_status,
    bookingId,
  ]);
  return { ok: true };
}
