import { useQuery } from '@tanstack/react-query';
import { newsApi } from '@/api/news.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 국가별 뉴스 조회
 * GET /api/news/{countryId}
 * staleTime: 10분
 */
export const useNews = (countryId: number | null) =>
  useQuery({
    queryKey: queryKeys.news.byCountry(countryId!),
    queryFn: () => newsApi.getNewsByCountry(countryId!),
    enabled: countryId !== null,
    staleTime: 10 * 60 * 1000,
  });
