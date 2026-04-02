import fs from 'fs/promises';
import path from 'path';
import pool from '../../config/db.js';
import { UPLOADS_DIR } from '../../config/uploads.js';
import { HttpError } from '../utils/httpError.js';

export async function listMenuItems() {
  const [rows] = await pool.query(
    `SELECT f.id, f.name, m.name as category, mi.name as sub_category, f.price, f.image_filename, f.description FROM foods f JOIN menu_items mi ON f.menu_item_id = mi.id JOIN menus m ON mi.menu_id = m.id ORDER BY m.name, mi.name, f.name`
  );
  return rows;
}

export async function createMenuItem(body, imageFilename = null) {
  const { name, category, sub_category, price, description } = body || {};
  if (!name || !category || !sub_category || price == null || price === '') {
    throw new HttpError(400, 'name, category, sub_category, price required');
  }
  // Find menu_id
  const [menuRows] = await pool.query('SELECT id FROM menus WHERE name = ?', [category]);
  if (menuRows.length === 0) {
    throw new HttpError(400, 'Invalid category');
  }
  const menuId = menuRows[0].id;
  // Find menu_item_id
  const [itemRows] = await pool.query('SELECT id FROM menu_items WHERE name = ? AND menu_id = ?', [sub_category, menuId]);
  if (itemRows.length === 0) {
    throw new HttpError(400, 'Invalid sub_category for category');
  }
  const menuItemId = itemRows[0].id;
  const [result] = await pool.query(
    `INSERT INTO foods (name, description, price, menu_item_id, image_filename) VALUES (?, ?, ?, ?, ?)`,
    [name, description || null, Number(price), menuItemId, imageFilename]
  );
  return { id: result.insertId };
}

export async function updateMenuItem(id, body) {
  const { name, category, sub_category, price, description } = body || {};
  const updates = [];
  const values = [];
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (category !== undefined || sub_category !== undefined) {
    // Find new menu_item_id
    let menuId, itemId;
    if (category !== undefined) {
      const [menuRows] = await pool.query('SELECT id FROM menus WHERE name = ?', [category]);
      if (menuRows.length === 0) {
        throw new HttpError(400, 'Invalid category');
      }
      menuId = menuRows[0].id;
    } else {
      // Get current menu_id
      const [current] = await pool.query('SELECT mi.menu_id FROM foods f JOIN menu_items mi ON f.menu_item_id = mi.id WHERE f.id = ?', [id]);
      if (current.length === 0) {
        throw new HttpError(404, 'Menu item not found');
      }
      menuId = current[0].menu_id;
    }
    if (sub_category !== undefined) {
      const [itemRows] = await pool.query('SELECT id FROM menu_items WHERE name = ? AND menu_id = ?', [sub_category, menuId]);
      if (itemRows.length === 0) {
        throw new HttpError(400, 'Invalid sub_category for category');
      }
      itemId = itemRows[0].id;
    } else {
      // Get current menu_item_id
      const [current] = await pool.query('SELECT menu_item_id FROM foods WHERE id = ?', [id]);
      if (current.length === 0) {
        throw new HttpError(404, 'Menu item not found');
      }
      itemId = current[0].menu_item_id;
    }
    updates.push('menu_item_id = ?');
    values.push(itemId);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    values.push(Number(price));
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }
  if (!updates.length) {
    throw new HttpError(400, 'No fields to update');
  }
  values.push(id);
  const [result] = await pool.query(
    `UPDATE foods SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw new HttpError(404, 'Menu item not found');
  }
  return { ok: true };
}

export async function deleteMenuItem(id) {
  const [rows] = await pool.query(
    'SELECT image_filename FROM foods WHERE id = ?',
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
  const [result] = await pool.query('DELETE FROM foods WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new HttpError(404, 'Menu item not found');
  }
  return { ok: true };
}
