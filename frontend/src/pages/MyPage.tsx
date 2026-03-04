import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/auth/useLogout';

const MyPage = () => {
  const { user, hasCompletedPreference } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div>
      <h1>MyPage</h1>
      {user && (
        <div>
          <p>이름: {user.name}</p>
          <p>이메일: {user.email}</p>
          <p>선호도 완료: {hasCompletedPreference ? 'Y' : 'N'}</p>
          <img src={user.profileImageUrl} alt="프로필" width={64} height={64} style={{ borderRadius: '50%' }} />
        </div>
      )}
      <details>
        <summary>user raw data</summary>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </details>
      <button onClick={() => logout()} disabled={isPending}>
        {isPending ? '로그아웃 중...' : '로그아웃'}
      </button>
    </div>
  );
};

export default MyPage;
