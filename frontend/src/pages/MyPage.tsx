import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  type LucideIcon,
  Landmark,
  Mountain,
  UtensilsCrossed,
  Zap,
  ShoppingBag,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { usePreferenceStore } from '@/stores/preferenceStore';
import { useLogout } from '@/hooks/auth/useLogout';
import { useUpdatePreference } from '@/hooks/auth/usePreference';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TagCategorySection } from '@/components/preference/TagCategorySection';

// ─── Category data ────────────────────────────────────────────────────────────

interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
  tags: string[];
}

const CATEGORIES: Category[] = [
  {
    key: 'culture',
    label: '문화/역사',
    icon: Landmark,
    tags: ['유적지', '박물관', '사원', '성곽', '예술'],
  },
  {
    key: 'nature',
    label: '자연/경관',
    icon: Mountain,
    tags: ['해변', '트레킹', '국립공원', '폭포', '온천'],
  },
  {
    key: 'food',
    label: '음식/미식',
    icon: UtensilsCrossed,
    tags: ['길거리음식', '파인다이닝', '로컬맛집', '야시장', '카페'],
  },
  {
    key: 'activity',
    label: '액티비티',
    icon: Zap,
    tags: ['서핑', '스노클링', '스카이다이빙', '번지점프', '래프팅'],
  },
  {
    key: 'city',
    label: '도시/쇼핑',
    icon: ShoppingBag,
    tags: ['쇼핑', '나이트라이프', '카지노', '테마파크', '전망대'],
  },
];

// ─── Framer Motion variants ───────────────────────────────────────────────────

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// ─── Profile avatar ───────────────────────────────────────────────────────────

interface ProfileAvatarProps {
  profileImageUrl: string;
  name: string;
}

function ProfileAvatar({ profileImageUrl, name }: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initial = name.charAt(0).toUpperCase();

  if (imgError || !profileImageUrl) {
    return (
      <div
        aria-hidden="true"
        className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white select-none"
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={profileImageUrl}
      alt={`${name} 프로필 사진`}
      width={80}
      height={80}
      onError={() => setImgError(true)}
      className="size-20 shrink-0 rounded-full object-cover"
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const MyPage = () => {
  const { user, hasCompletedPreference } = useAuthStore();
  const { selectedTags, toggleTag } = usePreferenceStore();
  const { mutate: logout, isPending: isLogoutPending } = useLogout();
  const { mutate: updatePreference, isPending: isUpdatePending } = useUpdatePreference();

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* ── Section 1: Profile Card ─────────────────────────────────── */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-5">
                  {user ? (
                    <ProfileAvatar
                      profileImageUrl={user.profileImageUrl}
                      name={user.name}
                    />
                  ) : (
                    <div className="size-20 shrink-0 rounded-full bg-slate-200 animate-pulse" />
                  )}

                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-slate-900 truncate">
                        {user?.name ?? '사용자'}
                      </h1>
                      {hasCompletedPreference ? (
                        <Badge variant="default">선호도 완료</Badge>
                      ) : (
                        <Badge variant="secondary">선호도 미완료</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {user?.email ?? ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Section 2: 선호도 태그 수정 ─────────────────────────────── */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  나의 관심 태그
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  태그를 선택하고 업데이트하세요
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-5">
                  {CATEGORIES.map((cat) => (
                    <TagCategorySection
                      key={cat.key}
                      category={cat.label}
                      icon={cat.icon}
                      tags={cat.tags}
                      selectedTags={selectedTags}
                      onToggle={toggleTag}
                    />
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={isUpdatePending}
                  onClick={() => updatePreference(selectedTags)}
                >
                  {isUpdatePending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                      업데이트 중...
                    </>
                  ) : (
                    '태그 업데이트'
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Section 3: 계정 설정 ─────────────────────────────────────── */}
          <motion.div variants={fadeInUp}>
            <Card className="bg-white rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  계정 설정
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <Separator />

                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full"
                  disabled={isLogoutPending}
                  onClick={() => logout()}
                  aria-label="로그아웃"
                >
                  {isLogoutPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                      로그아웃 중...
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 size-4" aria-hidden="true" />
                      로그아웃
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default MyPage;
