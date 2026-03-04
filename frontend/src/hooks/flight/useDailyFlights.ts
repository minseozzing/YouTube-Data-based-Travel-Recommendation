import { useQuery } from '@tanstack/react-query';
import { flightApi } from '@/api/flight.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 일자별 항공권 가격
 * staleTime: 5분
 */
export const useDailyFlights = (cityId: number | null, date: string) =>
  useQuery({
    queryKey: queryKeys.flight.daily(cityId!, date),
    queryFn: () => flightApi.getDailyFlights(cityId!, date),
    enabled: cityId !== null && !!date,
    staleTime: 5 * 60 * 1000,
  });
