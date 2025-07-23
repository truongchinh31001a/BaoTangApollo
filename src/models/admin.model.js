import { getDbPool, sql } from '@/lib/db.js';
import { sendResetPasswordEmail } from '@/lib/mail';
import crypto from 'crypto';

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

export async function forgotPassword(username) {
  const pool = await getDbPool();

  const result = await pool.request()
    .input("Username", sql.NVarChar, username)
    .query(`
      SELECT AdminId, Username, Email FROM Admins WHERE Username = @Username
    `);

  const admin = result.recordset[0];
  if (!admin) return null;

  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Hết hạn sau 15 phút

  // Xoá token cũ (nếu có)
  await pool.request()
    .input("AdminId", sql.Int, admin.AdminId)
    .query(`
      DELETE FROM PasswordResetTokens WHERE AdminId = @AdminId
    `);

  // Lưu token mới
  await pool.request()
    .input("Token", sql.NVarChar, token)
    .input("AdminId", sql.Int, admin.AdminId)
    .input("ExpiresAt", sql.DateTime, expiresAt)
    .query(`
      INSERT INTO PasswordResetTokens (Token, AdminId, ExpiresAt)
      VALUES (@Token, @AdminId, @ExpiresAt)
    `);

  // Gửi email với token
  await sendResetPasswordEmail(admin.Email, token);
  return { username: admin.Username, token, expiresAt };
}

export async function resetPasswordWithToken(token, passwordHash) {
  const pool = await getDbPool();

  const result = await pool.request()
    .input("Token", sql.NVarChar, token)
    .query(`
      SELECT Token, AdminId, ExpiresAt
      FROM PasswordResetTokens
      WHERE Token = @Token
    `);

  const record = result.recordset[0];
  if (!record) return { success: false, error: "Token không hợp lệ!" };

  const isExpired = new Date(record.ExpiresAt) < new Date();
  if (isExpired) return { success: false, error: "Token đã hết hạn!" };

  await pool.request()
    .input("AdminId", sql.Int, record.AdminId)
    .input("PasswordHash", sql.NVarChar, passwordHash)
    .query(`UPDATE Admins SET PasswordHash = @PasswordHash WHERE AdminId = @AdminId`);

  await pool.request()
    .input("Token", sql.NVarChar, token)
    .query(`DELETE FROM PasswordResetTokens WHERE Token = @Token`);

  return { success: true };
}