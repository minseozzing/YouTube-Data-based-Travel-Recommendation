import { Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TopNavBar = () => {
  const { user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/60',
        'bg-white/95 backdrop-blur-sm',
        'flex items-center justify-between px-6 py-3',
      )}
      aria-label="주요 네비게이션"
    >
      {/* 로고 */}
      <Link
        to="/"
        className="text-xl font-bold text-foreground hover:text-primary transition-colors no-underline"
        aria-label="다행 홈으로 이동"
      >
        다행
      </Link>

      {/* 우측 영역 */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/main"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              메인
            </Link>
            <Link
              to="/cost"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              물가
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              북마크
            </Link>
            <Link
              to="/mypage"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              <User className="size-4" aria-hidden="true" />
              <span className="sr-only">마이페이지</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              disabled={isPending}
              aria-label="로그아웃"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {isPending ? '로그아웃 중...' : '로그아웃'}
              </span>
            </Button>
          </>
        ) : (
          <Button asChild size="sm">
            <Link to="/login" className="no-underline">
              로그인
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default TopNavBar;
