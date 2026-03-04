import { useQuery } from '@tanstack/react-query';
import { cityApi } from '@/api/city.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 도시 상세 조회 (모달 오픈 시 호출)
 * GET /api/city/{cityId}
 * staleTime: 5분
 */
export const useCityDetail = (cityId: number | null) =>
  useQuery({
    queryKey: queryKeys.city.detail(cityId!),
    queryFn: () => cityApi.getDetail(cityId!),
    enabled: cityId !== null,
    staleTime: 5 * 60 * 1000,
  });
