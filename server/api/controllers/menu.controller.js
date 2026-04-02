import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function listMenus() {
  const [rows] = await pool.query('SELECT * FROM menus ORDER BY name');
  return rows;
}

export async function createMenu(body) {
  const { name } = body;
  if (!name) throw new HttpError(400, 'name required');
  const [result] = await pool.query('INSERT INTO menus (name) VALUES (?)', [name]);
  return { id: result.insertId };
}

export async function updateMenu(id, body) {
  const { name } = body;
  if (!name) throw new HttpError(400, 'name required');
  const [result] = await pool.query('UPDATE menus SET name = ? WHERE id = ?', [name, id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Menu not found');
  return { ok: true };
}

export async function deleteMenu(id) {
  const [result] = await pool.query('DELETE FROM menus WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new HttpError(404, 'Menu not found');
  return { ok: true };
}