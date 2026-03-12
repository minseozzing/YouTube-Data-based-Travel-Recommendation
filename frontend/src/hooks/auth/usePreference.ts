import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { authApi } from "@/api/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { usePreferenceStore } from "@/stores/preferenceStore";

/**
 * 선호도 입력 (최초 등록) — 성공 시 /main으로 이동
 * POST /api/members/tag
 */
export const useSubmitPreference = () => {
  const { setHasCompletedPreference } = useAuthStore();
  const { reset } = usePreferenceStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (tags: string[]) => authApi.submitPreference({ tags }),
    onSuccess: () => {
      setHasCompletedPreference(true);
      reset();
    },
    onSettled: () => {
      navigate({ to: '/main', search: { tab: 'recommend' } });
    },
  });
};

/**
 * 선호도 수정 — 성공 시 /mypage로 이동
 * PATCH /api/members/tag
 */
export const useUpdatePreference = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (tags: string[]) => authApi.updatePreference({ tags }),
    onSettled: () => {
      navigate({ to: '/mypage' });
    },
  });
};
