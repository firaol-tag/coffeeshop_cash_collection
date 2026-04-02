/**
 * Run after schema.sql + seed.sql: upserts Admin + Staff (password: password123)
 * Usage (from project root): npm run seed
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  const [deptRows] = await pool.query(
    'SELECT id FROM departments ORDER BY id LIMIT 1'
  );
  const deptId = deptRows[0]?.id || null;

  const users = [
    ['Admin User', 'admin@coffee.local', hash, 'Admin', deptId],
    ['Staff Barista', 'staff@coffee.local', hash, 'Staff', deptId],
  ];

  for (const [name, email, password_hash, role, department_id] of users) {
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, department_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name), role = VALUES(role)`,
      [name, email, password_hash, role, department_id]
    );
  }

  console.log(
    'Seed complete. Login: admin@coffee.local / staff@coffee.local — password: password123'
  );
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
