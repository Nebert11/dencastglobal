import { randomBytes } from 'node:crypto';
import { chmod, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const envPath = path.resolve('.env');
const envText = await readFile(envPath, 'utf8');
const env = dotenv.parse(envText);
const host = env.MYSQL_HOST || '127.0.0.1';
const port = Number(env.MYSQL_PORT || 3306);
const database = env.MYSQL_DATABASE || 'dencast';

if (!/^[A-Za-z0-9_$-]+$/.test(database)) {
  throw new Error('MYSQL_DATABASE must contain only letters, digits, underscore, dollar sign, or hyphen.');
}

const appPassword = randomBytes(32).toString('base64url');
const jwtSecret = env.JWT_SECRET && env.JWT_SECRET.length >= 32 && !env.JWT_SECRET.startsWith('replace-')
  ? env.JWT_SECRET
  : randomBytes(48).toString('base64url');
const connection = await mysql.createConnection({ host, port, user: 'root', password: '' });

try {
  await connection.query(`SHOW TABLES FROM \`${database}\``);

  for (const accountHost of ['localhost', '127.0.0.1']) {
    const quotedPassword = connection.escape(appPassword);
    await connection.query(`CREATE USER IF NOT EXISTS 'dencast_app'@'${accountHost}' IDENTIFIED BY ${quotedPassword}`);
    await connection.query(`ALTER USER 'dencast_app'@'${accountHost}' IDENTIFIED BY ${quotedPassword}`);
    await connection.query(
      `GRANT SELECT, INSERT, UPDATE, DELETE ON \`${database}\`.* TO 'dencast_app'@'${accountHost}'`,
    );
  }

  const values: Record<string, string> = {
    MYSQL_HOST: host,
    MYSQL_PORT: String(port),
    MYSQL_DATABASE: database,
    MYSQL_USER: 'dencast_app',
    MYSQL_PASSWORD: appPassword,
    JWT_SECRET: jwtSecret,
  };
  const seen = new Set<string>();
  const lines = envText.split(/\r?\n/).map((line) => {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(line);
    const key = match?.[1];
    if (!key || !(key in values)) return line;
    seen.add(key);
    return `${key}=${values[key]}`;
  });
  for (const [key, value] of Object.entries(values)) {
    if (!seen.has(key)) lines.push(`${key}=${value}`);
  }

  const temporaryPath = `${envPath}.tmp`;
  await writeFile(temporaryPath, `${lines.join('\n').replace(/\n+$/, '')}\n`, { mode: 0o600 });
  await chmod(temporaryPath, 0o600);
  await rename(temporaryPath, envPath);
  console.log(`Created least-privilege MySQL user for database ${database}.`);
  console.log('Generated MYSQL_PASSWORD and JWT_SECRET are stored in backend/.env; values were not displayed.');
} finally {
  await connection.end();
}