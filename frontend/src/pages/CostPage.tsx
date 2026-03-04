import { useState, type ReactNode, type KeyboardEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, TrendingDown, TrendingUp, Star, ArrowRight } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DestinationCard } from '@/components/cost/DestinationCard';
import { SmallDestinationCard } from '@/components/cost/SmallDestinationCard';
import { PromotionBanner } from '@/components/cost/PromotionBanner';

// ─── 더미 데이터 ──────────────────────────────────────────────────
const TOP_DESTINATIONS = [
  {
    countryId: 392,
    name: '일본',
    city: '도쿄',
    imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600',
    avgCost: '월 120만원',
  },
  {
    countryId: 764,
    name: '태국',
    city: '방콕',
    imgUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600',
    avgCost: '월 80만원',
  },
  {
    countryId: 250,
    name: '프랑스',
    city: '파리',
    imgUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
    avgCost: '월 250만원',
  },
];

const CHEAP_DESTINATIONS = [
  {
    countryId: 764,
    name: '태국',
    imgUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400',
    avgCost: '월 80만원',
  },
  {
    countryId: 704,
    name: '베트남',
    imgUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
    avgCost: '월 70만원',
  },
  {
    countryId: 360,
    name: '인도네시아',
    imgUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    avgCost: '월 75만원',
  },
  {
    countryId: 116,
    name: '캄보디아',
    imgUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400',
    avgCost: '월 60만원',
  },
];

const EXPENSIVE_DESTINATIONS = [
  {
    countryId: 756,
    name: '스위스',
    imgUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
    avgCost: '월 450만원',
  },
  {
    countryId: 578,
    name: '노르웨이',
    imgUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    avgCost: '월 380만원',
  },
  {
    countryId: 208,
    name: '덴마크',
    imgUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400',
    avgCost: '월 350만원',
  },
  {
    countryId: 840,
    name: '미국',
    imgUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400',
    avgCost: '월 300만원',
  },
];

// ─── 애니메이션 변수 ──────────────────────────────────────────────
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── 섹션 헤더 컴포넌트 ──────────────────────────────────────────
interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  onMoreClick?: () => void;
}

function SectionHeader({ icon, title, onMoreClick }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
      </div>
      {onMoreClick && (
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={onMoreClick}
          aria-label={`${title} 전체 목록 보기`}
        >
          더보기
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
const CostPage = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    // 더미 검색: 첫 번째 매칭 국가로 이동
    const all = [...TOP_DESTINATIONS, ...CHEAP_DESTINATIONS, ...EXPENSIVE_DESTINATIONS];
    const found = all.find((d) =>
      d.name.includes(searchValue.trim()),
    );
    if (found) {
      void navigate({ to: '/cost/$countryId', params: { countryId: found.countryId } });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50"
    >
      {/* ── HeroSection ─────────────────────────────────────────── */}
      <section
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6"
        aria-label="물가 탐색 히어로"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            어디로 떠나볼까요?
          </motion.h1>
          <motion.p
            className="text-slate-300 text-lg mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            전 세계 물가를 비교하고 최적의 여행지를 찾아보세요
          </motion.p>
          <motion.div
            className="flex gap-2 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="국가명을 입력하세요 (예: 일본, 태국)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 pl-4 pr-4 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:ring-blue-400/30 text-base"
                aria-label="국가 검색"
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-5 bg-blue-500 hover:bg-blue-400 text-white shrink-0"
              onClick={handleSearch}
              aria-label="검색 실행"
            >
              <Search className="size-5" aria-hidden="true" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── 콘텐츠 래퍼 ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-12 space-y-14">

        {/* ── TopDestinationSection ─────────────────────────────── */}
        <section aria-label="한국인이 자주 찾는 여행지 TOP">
          <SectionHeader
            icon={<Star className="size-5 text-amber-500 fill-amber-400" aria-hidden="true" />}
            title="한국인이 자주 찾는 여행지 TOP"
          />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {TOP_DESTINATIONS.map((dest, idx) => (
              <motion.div key={dest.countryId} variants={itemVariants}>
                <DestinationCard {...dest} rank={idx + 1} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── CheapDestinationSection ───────────────────────────── */}
        <section aria-label="물가가 가장 저렴한 여행지">
          <SectionHeader
            icon={<TrendingDown className="size-5 text-emerald-500" aria-hidden="true" />}
            title="물가가 가장 저렴한 여행"
          />
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {CHEAP_DESTINATIONS.map((dest) => (
              <motion.div key={dest.countryId} variants={itemVariants}>
                <SmallDestinationCard {...dest} costColor="green" />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ExpensiveDestinationSection ───────────────────────── */}
        <section aria-label="물가가 비싼 여행지">
          <SectionHeader
            icon={<TrendingUp className="size-5 text-red-500" aria-hidden="true" />}
            title="물가가 비싼 여행"
          />
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {EXPENSIVE_DESTINATIONS.map((dest) => (
              <motion.div key={dest.countryId} variants={itemVariants}>
                <SmallDestinationCard {...dest} costColor="red" />
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* ── PromotionBanner ──────────────────────────────────────── */}
      <PromotionBanner />
    </motion.div>
  );
};

export default CostPage;
