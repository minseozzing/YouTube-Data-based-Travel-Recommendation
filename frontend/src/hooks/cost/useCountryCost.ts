import { useQuery } from '@tanstack/react-query';
import { costApi } from '@/api/cost.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 국가 물가 상세
 * GET /api/cost/countries/{countryId}
 * staleTime: 60분
 */
export const useCountryCost = (countryId: number | null) =>
  useQuery({
    queryKey: queryKeys.cost.country(countryId!),
    queryFn: () => costApi.getCountryCost(countryId!),
    enabled: countryId !== null,
    staleTime: 60 * 60 * 1000,
  });
