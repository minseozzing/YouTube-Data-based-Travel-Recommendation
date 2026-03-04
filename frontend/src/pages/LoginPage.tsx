import { useGoogleLogin } from '@/hooks/auth/useGoogleLogin';

const LoginPage = () => {
  const { mutate: loginWithGoogle, isPending } = useGoogleLogin();

  return (
    <div>
      <h1>LoginPage</h1>
      <p>Google 계정으로 로그인하세요.</p>
      <button onClick={() => loginWithGoogle()} disabled={isPending}>
        {isPending ? '이동 중...' : 'Google 계정으로 계속하기'}
      </button>
    </div>
  );
};

export default LoginPage;
