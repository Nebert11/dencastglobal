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
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// A permissive (untyped) client for admin mutations that pass extra fields
// the strict generated types would reject.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = createClient<any>(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export default db;
