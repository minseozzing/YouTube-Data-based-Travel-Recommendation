import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

/**
 * 로그아웃
 * POST /api/auth/logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout(); // Zustand 상태 초기화 (localStorage persist 포함)
      queryClient.clear(); // 모든 캐시 클리어
      navigate({ to: '/login' });
    },
    onError: () => {
      // 실패해도 로컬 상태는 초기화
      logout();
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });
};
