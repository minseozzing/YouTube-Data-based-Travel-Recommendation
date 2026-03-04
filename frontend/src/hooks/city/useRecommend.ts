import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cityApi } from '@/api/city.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 도시 추천받기
 * POST /api/recommend
 */
export const useRecommend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { budget: number; duration: number }) => cityApi.recommend(body),
    onSuccess: (data, variables) => {
      // 추천 결과를 캐시에 저장
      queryClient.setQueryData(queryKeys.city.recommend(variables), data);
    },
  });
};
