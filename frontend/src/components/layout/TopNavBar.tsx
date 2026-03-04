import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/auth/useLogout';

const TopNavBar = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>
      <Link to="/main" style={{ fontWeight: 'bold', fontSize: '18px', textDecoration: 'none' }}>
        다행
      </Link>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Link to="/main">메인</Link>
        <Link to="/cost">물가</Link>
        <Link to="/bookmarks">북마크</Link>
        <Link to="/mypage">마이페이지</Link>
        {user && <span>{user.name}</span>}
        <button onClick={() => logout()} disabled={isPending}>
          {isPending ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </nav>
  );
};

export default TopNavBar;
