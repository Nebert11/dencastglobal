type DatabaseError = { message: string };
type QueryResponse<T = unknown> = { data: T | null; error: DatabaseError | null; count: number | null };
type QueryOptions = { count?: 'exact'; head?: boolean };
type AuthUser = { id: string; email: string; full_name?: string | null; role?: string };
type AuthSession = { access_token: string; token_type: 'bearer' };
type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'INITIAL_SESSION';
type AuthListener = (event: AuthEvent, session: AuthSession | null) => void;

const TOKEN_KEY = 'dencast.access_token';
const API_BASE = (
  (globalThis as typeof globalThis & { __DENCAST_API_BASE__?: string }).__DENCAST_API_BASE__
  || (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL
  || '/api'
).replace(/\/$/, '');
const authListeners = new Set<AuthListener>();

function getToken(): string | null {
  return typeof localStorage === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null): void {
  if (typeof localStorage === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

type ApiEnvelope<T> = { data: T | null; error?: DatabaseError | null; count?: number | null };

async function requestEnvelope<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | null;
  if (!response.ok) throw new Error(payload?.error?.message || `Request failed (${response.status}).`);
  if (!payload) throw new Error('The API returned an empty response.');
  return payload;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const payload = await requestEnvelope<T>(path, options);
  return payload.data as T;
}

async function uploadImage(file: File): Promise<{ data: Record<string, unknown> | null; error: DatabaseError | null }> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/media/images`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
        'X-File-Name': encodeURIComponent(file.name),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: file,
    });
    const payload = await response.json().catch(() => null) as { data?: Record<string, unknown>; error?: DatabaseError } | null;
    if (!response.ok) throw new Error(payload?.error?.message || `Upload failed (${response.status}).`);
    return { data: payload?.data ?? null, error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : 'Upload failed.' } };
  }
}

async function importArticleDocument(file: File): Promise<{
  data: { title: string; excerpt: string; content: string } | null;
  error: DatabaseError | null;
}> {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE}/articles/import`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'X-File-Name': encodeURIComponent(file.name),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: file,
    });
    const payload = await response.json().catch(() => null) as ApiEnvelope<{
      title: string;
      excerpt: string;
      content: string;
    }> | null;
    if (!response.ok) throw new Error(payload?.error?.message || `Import failed (${response.status}).`);
    if (!payload?.data) throw new Error('The document did not contain article text.');
    return { data: payload.data, error: null };
  } catch (error) {
    return { data: null, error: { message: error instanceof Error ? error.message : 'Document import failed.' } };
  }
}

class SqlQuery<T = unknown> implements PromiseLike<QueryResponse<T>> {
  private action: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select';
  private values?: Record<string, unknown> | Record<string, unknown>[];
  private conflict?: string;
  private columns = '*';
  private options: QueryOptions = {};
  private filters: { column: string; operator: string; value?: unknown }[] = [];
  private orders: { column: string; ascending: boolean }[] = [];
  private search?: string;
  private offset?: number;
  private limitValue?: number;
  private singleMode?: 'single' | 'maybeSingle';
  private cached?: Promise<QueryResponse<T>>;

  constructor(private readonly table: string) {}

  select(columns = '*', options: QueryOptions = {}): this {
    this.columns = columns;
    this.options = options;
    return this;
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]): this {
    this.action = 'insert';
    this.values = values;
    return this;
  }

  upsert(values: Record<string, unknown> | Record<string, unknown>[], options: { onConflict?: string } = {}): this {
    this.action = 'upsert';
    this.values = values;
    this.conflict = options.onConflict;
    return this;
  }

  update(values: Record<string, unknown>): this {
    this.action = 'update';
    this.values = values;
    return this;
  }

  delete(): this {
    this.action = 'delete';
    return this;
  }

  eq(column: string, value: unknown): this { return this.filter(column, 'eq', value); }
  neq(column: string, value: unknown): this { return this.filter(column, 'neq', value); }
  gte(column: string, value: unknown): this { return this.filter(column, 'gte', value); }
  lte(column: string, value: unknown): this { return this.filter(column, 'lte', value); }
  ilike(column: string, value: unknown): this { return this.filter(column, 'ilike', value); }

  not(column: string, operator: string, value: unknown): this {
    if (operator !== 'is' || value !== null) throw new Error('Only not(column, "is", null) is supported.');
    return this.filter(column, 'not_is_null');
  }

  or(search: string): this { this.search = search; return this; }

  order(column: string, options: { ascending?: boolean } = {}): this {
    this.orders.push({ column, ascending: options.ascending ?? true });
    return this;
  }

  limit(value: number): this { this.limitValue = value; return this; }
  range(from: number, to: number): this { this.offset = from; this.limitValue = to - from + 1; return this; }
  single(): this { this.singleMode = 'single'; return this; }
  maybeSingle(): this { this.singleMode = 'maybeSingle'; return this; }

  then<TResult1 = QueryResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: QueryResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    this.cached ??= this.execute();
    return this.cached.then(onfulfilled, onrejected);
  }

  private filter(column: string, operator: string, value?: unknown): this {
    this.filters.push({ column, operator, value });
    return this;
  }

  private async execute(): Promise<QueryResponse<T>> {
    try {
      const payload = await requestEnvelope<T>('/data', {
        method: 'POST',
        body: JSON.stringify({
          table: this.table,
          action: this.action,
          columns: this.columns,
          filters: this.filters,
          search: this.search,
          orders: this.orders,
          offset: this.offset,
          limit: this.limitValue,
          count: this.options.count === 'exact',
          head: this.options.head,
          single: this.singleMode,
          values: this.values,
          conflict: this.conflict,
        }),
      });
      return { data: payload.data, error: null, count: payload.count ?? null };
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : 'Request failed.' }, count: null };
    }
  }
}

const mysql = {
  from<T = unknown>(table: string): SqlQuery<T> { return new SqlQuery<T>(table); },
  uploadImage,
  importArticleDocument,
  auth: {
    async signInWithPassword(credentials: { email: string; password: string }) {
      try {
        const data = await request<{ user: AuthUser; session: AuthSession }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });
        setToken(data.session.access_token);
        authListeners.forEach((listener) => listener('SIGNED_IN', data.session));
        return { data, error: null };
      } catch (error) {
        return { data: { user: null, session: null }, error: { message: error instanceof Error ? error.message : 'Sign in failed.' } };
      }
    },
    async signOut() {
      setToken(null);
      authListeners.forEach((listener) => listener('SIGNED_OUT', null));
      return { error: null };
    },
    async getUser() {
      try {
        if (!getToken()) return { data: { user: null }, error: null };
        const data = await request<{ user: AuthUser }>('/auth/me');
        return { data, error: null };
      } catch (error) {
        setToken(null);
        return { data: { user: null }, error: { message: error instanceof Error ? error.message : 'Session expired.' } };
      }
    },
    onAuthStateChange(callback: AuthListener) {
      authListeners.add(callback);
      const session = getToken() ? { access_token: getToken()!, token_type: 'bearer' as const } : null;
      queueMicrotask(() => callback('INITIAL_SESSION', session));
      return { data: { subscription: { unsubscribe: () => authListeners.delete(callback) } } };
    },
  },
  functions: {
    async invoke<T = unknown>(name: string, options: { body?: unknown } = {}) {
      try {
        const data = await request<T>(`/functions/${encodeURIComponent(name)}`, {
          method: 'POST',
          body: JSON.stringify(options.body ?? {}),
        });
        return { data, error: null };
      } catch (error) {
        return { data: null, error: { message: error instanceof Error ? error.message : 'Request failed.' } };
      }
    },
  },
};

export default mysql;
export type { AuthEvent as AuthChangeEvent, AuthSession as Session, AuthUser as User };