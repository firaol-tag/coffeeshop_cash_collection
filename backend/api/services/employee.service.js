import pool from '../../config/db.js';

export async function listEmployeesForPos(searchQuery) {
  const q = (searchQuery || '').trim();
  let sql = `
    SELECT u.id, u.name, u.email, u.role, u.department_id, d.name AS department_name
    FROM users u
    LEFT JOIN departments d ON d.id = u.department_id
  `;
  const params = [];
  if (q) {
    sql += ` WHERE u.name LIKE ? OR u.email LIKE ?`;
    const like = `%${q}%`;
    params.push(like, like);
  }
  sql += ` ORDER BY u.name LIMIT 200`;
  const [rows] = await pool.query(sql, params);
  return rows;
}
