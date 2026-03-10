import { useQuery } from '@tanstack/react-query';
import { costApi } from '@/api/cost.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 서울 대비 도시 물가 비교
 * GET /api/cost/compare/{city_id}
 * staleTime: 60분
 */
export const useCostCompare = (cityId: number) =>
  useQuery({
    queryKey: queryKeys.cost.costCompare(cityId),
    queryFn: () => costApi.getCostCompare(cityId),
    enabled: cityId > 0,
    staleTime: 60 * 60 * 1000,
  });
