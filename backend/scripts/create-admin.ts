import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getPool, closePool } from '../server/db.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const fullName = process.env.ADMIN_NAME?.trim() || 'Dencast Admin';
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || password.length < 12) {
  throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before running this script.');
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await getPool().execute(
    `INSERT INTO profiles (id, email, full_name, role, is_active, password_hash)
     VALUES (?, ?, ?, 'super_admin', TRUE, ?)
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = 'super_admin', is_active = TRUE, password_hash = VALUES(password_hash)`,
    [randomUUID(), email, fullName, passwordHash],
  );
  console.log(`Admin account ready for ${email}.`);
} finally {
  await closePool();
}