/**
 * Mutation helper for the SQL API.
 *
 * The generated Database stub can be overly strict — field lists in
 * Insert/Update don't always include optional server-default columns
 * (e.g. `updated_at`). Use `db` for admin mutations that include such fields.
 * explicit `updated_at` or any extra field that the stub rejects.
 *
 * @example
 *   import mysql from '@/lib/mysql';
 *   import { db } from '@/lib/db';
 *   await db.from('projects').update({ title: 'foo', updated_at: new Date().toISOString() }).eq('id', id);
 */
import mysql from './mysql';

// A permissive (untyped) client for admin mutations that pass extra fields
// the strict generated types would reject.
// Reuse the shared singleton to avoid multiple GoTrueClient instances.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = mysql as any;

export default db;
