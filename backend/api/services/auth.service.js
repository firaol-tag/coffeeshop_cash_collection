import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function login(email, password) {
  if (!email || !password) {
    throw new HttpError(400, 'Email and password required');
  }
  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role, department_id FROM users WHERE email = ?`,
    [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new HttpError(401, 'Invalid credentials');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
    },
  };
}

export async function getProfile(userId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.department_id, d.name AS department_name
     FROM users u
     LEFT JOIN departments d ON d.id = u.department_id
     WHERE u.id = ?`,
    [userId]
  );
  return rows[0] || null;
}
