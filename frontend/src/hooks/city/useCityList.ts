import { useQuery } from '@tanstack/react-query';
import { cityApi } from '@/api/city.api';
import { queryKeys } from '@/utils/queryKeys';

interface CityListParams {
  lat?: number;
  lng?: number;
  query?: string;
}

/**
 * 도시 리스트 조회
 * GET /api/city
 * staleTime: 5분
 */
export const useCityList = (params?: CityListParams) =>
  useQuery({
    queryKey: queryKeys.city.list(params),
    queryFn: () => cityApi.getList(params),
    staleTime: 5 * 60 * 1000,
  });
