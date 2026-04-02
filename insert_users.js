import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from './server/config/db.js';

async function insertUsers() {
  const hash = await bcrypt.hash('password123', 10);

  const users = [
    ['Admin User', 'admin@coffee.local', hash, 'Admin', 1],
    ['Staff Barista', 'staff@coffee.local', hash, 'Staff', 1],
  ];

  for (const [name, email, password_hash, role, department_id] of users) {
    try {
      await pool.query(
        `INSERT INTO users (name, email, password_hash, role, department_id)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
        [name, email, password_hash, role, department_id]
      );
      console.log(`Inserted ${name}`);
    } catch (e) {
      console.error(`Error inserting ${name}:`, e.message);
    }
  }

  console.log('Users inserted');
  process.exit(0);
}

insertUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});