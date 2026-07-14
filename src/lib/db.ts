/**
 * Typed Supabase mutation helper.
 *
 * The generated Database stub can be overly strict — field lists in
 * Insert/Update don't always include optional server-default columns
 * (e.g. `updated_at`).  Use `db(supabase)` when you need to send an
 * explicit `updated_at` or any extra field that the stub rejects.
 *
 * @example
 *   import supabase from '@/lib/supabase';
 *   import { db } from '@/lib/db';
 *   await db.from('projects').update({ title: 'foo', updated_at: new Date().toISOString() }).eq('id', id);
 */
import supabase from './supabase';

// A permissive (untyped) client for admin mutations that pass extra fields
// the strict generated types would reject.
// Reuse the shared singleton to avoid multiple GoTrueClient instances.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;

export default db;
