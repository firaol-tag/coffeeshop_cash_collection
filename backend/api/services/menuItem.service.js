import fs from 'fs/promises';
import path from 'path';
import pool from '../../config/db.js';
import { UPLOADS_DIR } from '../../config/uploads.js';
import { HttpError } from '../utils/httpError.js';

const allowedCategory = ['Food', 'Drink'];
const allowedSub = ['Breakfast', 'Lunch', 'Snack', 'Hot', 'Cold'];

export async function listMenuItems() {
  const [rows] = await pool.query(
    `SELECT id, name, category, sub_category, price, image_filename FROM menu_items ORDER BY category, sub_category, name`
  );
  return rows;
}

export async function createMenuItem(body, imageFilename = null) {
  const { name, category, sub_category, price } = body || {};
  if (!name || !category || !sub_category || price == null || price === '') {
    throw new HttpError(400, 'name, category, sub_category, price required');
  }
  if (!allowedCategory.includes(category) || !allowedSub.includes(sub_category)) {
    throw new HttpError(400, 'Invalid category or sub_category');
  }
  const [result] = await pool.query(
    `INSERT INTO menu_items (name, category, sub_category, price, image_filename) VALUES (?, ?, ?, ?, ?)`,
    [name, category, sub_category, Number(price), imageFilename]
  );
  return { id: result.insertId };
}

export async function updateMenuItem(id, body) {
  const { name, category, sub_category, price } = body || {};
  const updates = [];
  const values = [];
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (category !== undefined) {
    if (!allowedCategory.includes(category)) {
      throw new HttpError(400, 'Invalid category');
    }
    updates.push('category = ?');
    values.push(category);
  }
  if (sub_category !== undefined) {
    if (!allowedSub.includes(sub_category)) {
      throw new HttpError(400, 'Invalid sub_category');
    }
    updates.push('sub_category = ?');
    values.push(sub_category);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    values.push(Number(price));
  }
  if (!updates.length) {
    throw new HttpError(400, 'No fields to update');
  }
  values.push(id);
  const [result] = await pool.query(
    `UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw new HttpError(404, 'Menu item not found');
  }
  return { ok: true };
}

export async function deleteMenuItem(id) {
  const [rows] = await pool.query(
    'SELECT image_filename FROM menu_items WHERE id = ?',
    [id]
  );
  const row = rows[0];
  if (!row) {
    throw new HttpError(404, 'Menu item not found');
  }
  if (row.image_filename) {
    const filePath = path.join(UPLOADS_DIR, row.image_filename);
    await fs.unlink(filePath).catch(() => {});
  }
  const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new HttpError(404, 'Menu item not found');
  }
  return { ok: true };
}
