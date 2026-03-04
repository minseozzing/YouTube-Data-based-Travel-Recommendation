import { useQuery } from '@tanstack/react-query';
import { flightApi } from '@/api/flight.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 월별 항공권 최저가
 * staleTime: 5분
 */
export const useMonthlyFlights = (cityId: number | null, year: number, month: number) =>
  useQuery({
    queryKey: queryKeys.flight.monthly(cityId!, year, month),
    queryFn: () => flightApi.getMonthlyFlight(cityId!, year, month),
    enabled: cityId !== null && !!year && !!month,
    staleTime: 5 * 60 * 1000,
  });
