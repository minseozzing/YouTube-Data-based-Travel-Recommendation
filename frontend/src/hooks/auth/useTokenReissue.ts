import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

/**
 * 토큰 재발급
 * POST /api/auth/reissue
 * 일반적으로 axiosInstance의 401 interceptor에서 자동 처리됨.
 * 수동 재발급이 필요한 경우 이 훅을 사용.
 */
export const useTokenReissue = () => {
  const { setAccessToken } = useAuthStore();

  return useMutation({
    mutationFn: authApi.reissueToken,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
};
