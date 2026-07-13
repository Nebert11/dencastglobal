import type { AuthChangeEvent, Session, User, Subscription } from '@supabase/supabase-js';
import supabase from '../lib/supabase';
import db from '../lib/db';
import type { Profile, ApiResponse } from '../types';

// ─── Sign In ──────────────────────────────────────────────────────────────────

export interface SignInResult {
  user: User | null;
  session: Session | null;
}

/**
 * Signs in a user with email and password.
 */
export async function signIn(
  email: string,
  password: string
): Promise<ApiResponse<SignInResult>> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { data: null, error: error.message, status: 'error' };
  }

  return {
    data: { user: data.user, session: data.session },
    error: null,
    status: 'success',
  };
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

/**
 * Signs out the currently authenticated user and clears the session.
 */
export async function signOut(): Promise<ApiResponse<null>> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error: error.message, status: 'error' };
  }

  return { data: null, error: null, status: 'success' };
}

// ─── Current User ─────────────────────────────────────────────────────────────

/**
 * Returns the currently authenticated user, or null if unauthenticated.
 * Uses the cached session — no network request.
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { data: null, error: error.message, status: 'error' };
  }

  return { data: user, error: null, status: 'success' };
}

// ─── Auth State Listener ──────────────────────────────────────────────────────

export type AuthChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

/**
 * Subscribes to authentication state changes.
 * Returns an `unsubscribe` function — call it in cleanup effects.
 *
 * @example
 * const unsub = onAuthChange((event, session) => { ... });
 * return () => unsub();
 */
export function onAuthChange(callback: AuthChangeCallback): () => void {
  const {
    data: { subscription },
  }: { data: { subscription: Subscription } } = supabase.auth.onAuthStateChange(callback);

  return () => subscription.unsubscribe();
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/**
 * Fetches a user's public profile from the `profiles` table.
 */
export async function getProfile(userId: string): Promise<ApiResponse<Profile>> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    return { data: null, error: error.message, status: 'error' };
  }

  if (!data) {
    return { data: null, error: `Profile not found for user: ${userId}`, status: 'error' };
  }

  return { data: data as Profile, error: null, status: 'success' };
}

/**
 * Updates mutable fields on a user's profile.
 * Only `admin` and `editor` roles should call this in production — enforce via RLS.
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<ApiResponse<Profile>> {
  const { data, error } = await db
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message, status: 'error' };
  }

  return { data: data as Profile, error: null, status: 'success' };
}
