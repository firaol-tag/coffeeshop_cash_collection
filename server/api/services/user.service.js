import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function listUsers() {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.department_id, d.name AS department_name
     FROM users u
     LEFT JOIN departments d ON d.id = u.department_id
     ORDER BY u.name`
  );
  return rows;
}

export async function createUser(body) {
  const { name, email, password, role = 'Staff', department_id } = body || {};
  if (!name || !email || !password) {
    throw new HttpError(400, 'name, email, and password required');
  }
  if (!['Admin', 'Staff'].includes(role)) {
    throw new HttpError(400, 'Invalid role');
  }
  const password_hash = await bcrypt.hash(password, 10);
  try {
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password_hash, role, department_id || null]
    );
    return { id: result.insertId };
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'Email already in use');
    }
    throw e;
  }
}

export async function updateUser(id, body) {
  const { name, email, role, department_id, password } = body || {};
  const updates = [];
  const values = [];
  if (name !== undefined) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (role !== undefined) {
    if (!['Admin', 'Staff'].includes(role)) {
      throw new HttpError(400, 'Invalid role');
    }
    updates.push('role = ?');
    values.push(role);
  }
  if (department_id !== undefined) {
    updates.push('department_id = ?');
    values.push(department_id);
  }
  if (password) {
    updates.push('password_hash = ?');
    values.push(await bcrypt.hash(password, 10));
  }
  if (!updates.length) {
    throw new HttpError(400, 'No fields to update');
  }
  values.push(id);
  try {
    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      throw new HttpError(404, 'User not found');
    }
    return { ok: true };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    if (e.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'Email already in use');
    }
    throw e;
  }
}
