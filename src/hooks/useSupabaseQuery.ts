import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from '@tanstack/react-query';

/**
 * A thin, typed wrapper around TanStack Query's `useQuery` designed for
 * Supabase fetchers.
 *
 * Forwards all standard `useQuery` options so callers retain full control
 * while benefiting from consistent key/fetcher ergonomics.
 *
 * @param key      - TanStack Query cache key (string or array).
 * @param fetcher  - Async function returning the data (e.g. from supabase.service.ts).
 * @param options  - Any additional `useQuery` options (enabled, staleTime, select, …).
 *
 * @returns Standard `UseQueryResult<TData, TError>`
 *
 * @example
 * const { data, isLoading, error } = useSupabaseQuery(
 *   ['hero'],
 *   getHeroContent,
 *   { staleTime: 1000 * 60 * 10 }
 * );
 */
export function useSupabaseQuery<TData, TError = Error>(
  key: QueryKey,
  fetcher: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, QueryKey>({
    queryKey: key,
    queryFn: fetcher,
    ...options,
  });
}
