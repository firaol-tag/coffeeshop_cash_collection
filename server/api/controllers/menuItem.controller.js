import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function listMenuItems() {
  const [rows] = await pool.query('SELECT mi.*, m.name as menu_name FROM menu_items mi JOIN menus m ON mi.menu_id = m.id ORDER BY m.name, mi.name');
  return rows;
}

export async function createMenuItem(body) {
  const { name, menu_id } = body;
  if (!name || !menu_id) throw new HttpError(400, 'name and menu_id required');
  const [result] = await pool.query('INSERT INTO menu_items (name, menu_id) VALUES (?, ?)', [name, menu_id]);
  return { id: result.insertId };
}

export async function updateMenuItem(id, body) {
  const { name, menu_id } = body;
  const updates = [];
  const values = [];
  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (menu_id) {
    updates.push('menu_id = ?');
    values.push(menu_id);
  }
  if (!updates.length) throw new HttpError(400, 'No fields to update');
  values.push(id);
  const [result] = await pool.query(`UPDATE menu_items SET ${updates.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) throw new HttpError(404, 'Menu item not found');
  return { ok: true };
}

export async function deleteMenuItem(id) {
  const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Menu item not found');
  return { ok: true };
}
