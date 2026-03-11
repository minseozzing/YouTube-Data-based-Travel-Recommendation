import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { code, error: oauthError } = useSearch({ from: '/auth/callback' });
  const { setAccessToken, setUser, setHasCompletedPreference } = useAuthStore();

  const { mutate: processCallback, isError, error } = useMutation({
    mutationFn: (authCode: string) => authApi.exchangeCode(authCode),
    onSuccess: (data) => {
      const { accessToken, member } = data;
      setAccessToken(accessToken);
      setUser(member);
      
      // 현재 백엔드 사양에는 취향 완료 여부가 포함되지 않으므로 /main으로 이동
      navigate({ to: '/main' });
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle
            className="size-10 text-destructive"
            aria-hidden="true"
          />
          <p className="text-base font-medium text-foreground">
            로그인 처리 중 오류가 발생했습니다
          </p>
          {(error as Error)?.message && (
            <p className="text-sm text-muted-foreground max-w-xs">
              {(error as Error).message}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/login' })}
          aria-label="로그인 페이지로 돌아가기"
        >
          로그인 페이지로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <Loader2
        className="size-10 animate-spin text-primary"
        aria-label="로그인 처리 중"
      />
      <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
    </div>
  );
};

export default AuthCallbackPage;
