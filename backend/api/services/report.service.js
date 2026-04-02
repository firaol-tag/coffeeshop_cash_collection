import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function monthlyReport(year, month) {
  const y = Number(year) || new Date().getFullYear();
  const m = Number(month) || new Date().getMonth() + 1;
  if (m < 1 || m > 12) {
    throw new HttpError(400, 'month must be 1-12');
  }

  const start = `${y}-${String(m).padStart(2, '0')}-01 00:00:00`;
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? y + 1 : y;
  const end = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01 00:00:00`;

  const [summary] = await pool.query(
    `
    SELECT
      COUNT(*) AS booking_count,
      COALESCE(SUM(total_price), 0) AS gross_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Cash' THEN total_price ELSE 0 END), 0) AS cash_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Paid' THEN total_price ELSE 0 END), 0) AS credit_paid_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Unpaid' THEN total_price ELSE 0 END), 0) AS credit_unpaid_total
    FROM bookings
    WHERE created_at >= ? AND created_at < ?
    `,
    [start, end]
  );

  return {
    year: y,
    month: m,
    ...summary[0],
  };
}

export async function yearlyReport(year) {
  const y = Number(year) || new Date().getFullYear();
  const start = `${y}-01-01 00:00:00`;
  const end = `${y + 1}-01-01 00:00:00`;

  const [summary] = await pool.query(
    `
    SELECT
      COUNT(*) AS booking_count,
      COALESCE(SUM(total_price), 0) AS gross_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Cash' THEN total_price ELSE 0 END), 0) AS cash_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Paid' THEN total_price ELSE 0 END), 0) AS credit_paid_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Unpaid' THEN total_price ELSE 0 END), 0) AS credit_unpaid_total
    FROM bookings
    WHERE created_at >= ? AND created_at < ?
    `,
    [start, end]
  );

  const [byMonth] = await pool.query(
    `
    SELECT
      MONTH(created_at) AS month,
      COUNT(*) AS booking_count,
      COALESCE(SUM(total_price), 0) AS gross_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Cash' THEN total_price ELSE 0 END), 0) AS cash_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Paid' THEN total_price ELSE 0 END), 0) AS credit_paid_total,
      COALESCE(SUM(CASE WHEN payment_type = 'Credit' AND payment_status = 'Unpaid' THEN total_price ELSE 0 END), 0) AS credit_unpaid_total
    FROM bookings
    WHERE created_at >= ? AND created_at < ?
    GROUP BY MONTH(created_at)
    ORDER BY month
    `,
    [start, end]
  );

  return {
    year: y,
    summary: summary[0],
    by_month: byMonth,
  };
}
