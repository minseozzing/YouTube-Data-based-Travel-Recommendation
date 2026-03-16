import { useQuery } from '@tanstack/react-query';
import { cityApi } from '@/api/city.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 도시 상세 조회 (모달 오픈 시 호출)
 * GET /api/city/{cityId}?recommend=true|false
 * staleTime: 5분
 */
export const useCityDetail = (cityId: number | null, recommend: boolean) =>
  useQuery({
    queryKey: [...queryKeys.city.detail(cityId!), recommend],
    queryFn: () => cityApi.getDetail(cityId!, recommend),
    enabled: cityId !== null,
    staleTime: 5 * 60 * 1000,
  });
