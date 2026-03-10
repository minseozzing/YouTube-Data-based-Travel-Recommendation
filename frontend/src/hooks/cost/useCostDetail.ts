import { useQuery } from '@tanstack/react-query';
import { costApi } from '@/api/cost.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 도시/국가 물가 상세 조회
 * GET /api/cost/detail?target_type=city|country&target_id=XXX
 * staleTime: 60분
 */
export const useCostDetail = (
  targetType: 'country' | 'city',
  targetId: number,
) =>
  useQuery({
    queryKey: queryKeys.cost.costDetail(targetType, targetId),
    queryFn: () => costApi.getCostDetail(targetType, targetId),
    enabled: targetId > 0,
    staleTime: 60 * 60 * 1000,
  });
