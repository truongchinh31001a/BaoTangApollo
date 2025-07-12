import { findAdminByUsername, insertAdmin } from '@/models/admin.model.js';
import bcrypt from 'bcrypt';

export async function authenticate(username, password) {
  const admin = await findAdminByUsername(username);
  if (!admin) return null;

  const matched = await bcrypt.compare(password, admin.PasswordHash);
  return matched ? admin : null;
}

export async function createAdmin({ username, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await insertAdmin({ username, passwordHash, role });
}
