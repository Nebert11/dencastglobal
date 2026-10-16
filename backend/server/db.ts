import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

let pool: Pool | undefined;
const columnsByTable = new Map<string, Promise<Set<string>>>();

export function getPool(): Pool {
  if (pool) return pool;

  const { MYSQL_URL, MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD } = process.env;
  if (!MYSQL_URL && (!MYSQL_HOST || !MYSQL_DATABASE || !MYSQL_USER || !MYSQL_PASSWORD)) {
    throw new Error('Set MYSQL_URL or MYSQL_HOST, MYSQL_DATABASE, MYSQL_USER, and MYSQL_PASSWORD.');
  }

  pool = MYSQL_URL
    ? mysql.createPool(MYSQL_URL)
    : mysql.createPool({
        host: MYSQL_HOST!,
        port: Number(MYSQL_PORT || 3306),
        database: MYSQL_DATABASE!,
        user: MYSQL_USER!,
        password: MYSQL_PASSWORD!,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: 'Z',
        dateStrings: true,
      });
  return pool;
}

export function sqlValues(values: unknown[]): never[] {
  return values.map((value) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) {
      return new Date(value);
    }
    if (value && typeof value === 'object' && !(value instanceof Date) && !Buffer.isBuffer(value)) {
      return JSON.stringify(value);
    }
    return value;
  }) as never[];
}

export async function getTableColumns(table: string): Promise<Set<string>> {
  let columns = columnsByTable.get(table);
  if (!columns) {
    columns = getPool()
      .query<RowDataPacket[]>(`SHOW COLUMNS FROM \`${table}\``)
      .then(([rows]) => new Set(rows.map((row) => String(row.Field))));
    columnsByTable.set(table, columns);
  }
  return columns;
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = undefined;
}