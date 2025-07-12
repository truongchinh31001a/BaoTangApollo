import { getDbPool, sql } from '@/lib/db.js';

export async function findAdminByUsername(username) {
  const pool = await getDbPool();
  const result = await pool.request()
    .input('Username', sql.NVarChar, username)
    .query(`
      SELECT AdminId, Username, PasswordHash, Role
      FROM Admins
      WHERE Username = @Username
    `);
  return result.recordset[0];
}

export async function insertAdmin({ username, passwordHash, role }) {
  const pool = await getDbPool();
  await pool.request()
    .input('Username', sql.NVarChar, username)
    .input('PasswordHash', sql.NVarChar, passwordHash)
    .input('Role', sql.NVarChar, role || 'editor')
    .query(`
      INSERT INTO Admins (Username, PasswordHash, Role)
      VALUES (@Username, @PasswordHash, @Role)
    `);
}
