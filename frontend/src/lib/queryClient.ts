import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 기본 5분
      gcTime: 10 * 60 * 1000, // 10분 후 GC
      retry: (failureCount, error: unknown) => {
        // 401, 403, 404는 재시도 안 함
        const noRetryStatuses = [401, 403, 404];
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status !== undefined && noRetryStatuses.includes(status)) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
