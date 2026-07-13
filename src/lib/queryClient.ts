import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query client for the Dencast Global application.
 *
 * Configuration:
 * - staleTime: 5 minutes  — data is considered fresh for 5 min after fetch
 * - gcTime: 10 minutes    — inactive cache entries are garbage-collected after 10 min
 * - retry: 2              — failed requests are retried up to 2 times
 * - refetchOnWindowFocus: false — prevents unnecessary re-fetches on tab switch
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
