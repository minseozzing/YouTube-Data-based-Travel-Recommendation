import { useMutation } from "@tanstack/react-query";
import { cityApi } from "@/api/city.api";
import { useUiStore } from "@/stores/uiStore";

export const useRecommend = () => {
  const setRecommendResults = useUiStore((s) => s.setRecommendResults);

  return useMutation({
    mutationFn: (body: {
      selectedTags: string[];
      userDailyBudget: number;
      travelDays: number;
      month: number;
    }) => cityApi.recommend(body),
    onSuccess: (data) => {
      setRecommendResults(data);
    },
  });
};
