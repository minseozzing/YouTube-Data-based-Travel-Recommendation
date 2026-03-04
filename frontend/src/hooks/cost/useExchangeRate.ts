import { useQuery } from '@tanstack/react-query';
import { costApi } from '@/api/cost.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 현재 환율 조회
 * staleTime: 30분
 */
export const useExchangeRate = (baseCurrency: string, targetCurrency: string) =>
  useQuery({
    queryKey: queryKeys.cost.exchange(baseCurrency, targetCurrency),
    queryFn: () => costApi.getExchangeRate(baseCurrency, targetCurrency),
    enabled: !!baseCurrency && !!targetCurrency,
    staleTime: 30 * 60 * 1000,
  });
