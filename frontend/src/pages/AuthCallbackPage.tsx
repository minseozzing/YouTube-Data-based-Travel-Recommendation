import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { code, error: oauthError } = useSearch({ from: '/auth/callback' });
  const { setAccessToken, setUser, setHasCompletedPreference } = useAuthStore();

  const { mutate: processCallback, isError, error } = useMutation({
    mutationFn: (authCode: string) => authApi.googleCallback(authCode),
    onSuccess: ({ accessToken, user }) => {
      setAccessToken(accessToken);
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImageUrl: user.profileImageUrl,
      });
      setHasCompletedPreference(user.hasCompletedPreference);

      navigate({
        to: user.hasCompletedPreference ? '/main' : '/preference',
      });
    },
    onError: () => {
      navigate({ to: '/login' });
    },
  });

  useEffect(() => {
    if (oauthError) {
      console.error('[OAuth Error]', oauthError);
      navigate({ to: '/login' });
      return;
    }
    if (code) {
      processCallback(code);
    } else {
      navigate({ to: '/login' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isError) {
    return <p>로그인 처리 중 오류가 발생했습니다: {(error as Error)?.message}</p>;
  }

  return <p>로그인 처리 중...</p>;
};

export default AuthCallbackPage;
