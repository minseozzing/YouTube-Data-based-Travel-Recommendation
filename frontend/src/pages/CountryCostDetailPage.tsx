import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useCountryCost } from '@/hooks/cost/useCountryCost';
import { CountryHero, COUNTRY_NAME_MAP } from '@/components/cost/CountryHero';
import { PriceIndexCard } from '@/components/cost/PriceIndexCard';
import { PPPIndexCard } from '@/components/cost/PPPIndexCard';
import { PriceItemTable } from '@/components/cost/PriceItemTable';
import { PriceIndexLineChart } from '@/components/cost/PriceIndexLineChart';
import { CountrySelectorList } from '@/components/cost/CountrySelectorList';
import { CityCardGrid } from '@/components/cost/CityCardGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ─── 애니메이션 변수 ──────────────────────────────────────────────
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

// ─── 스켈레톤 로딩 ────────────────────────────────────────────────
function DetailPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-20 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}

// ─── 에러 상태 ────────────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4 rounded-full bg-red-50">
        <AlertCircle className="size-8 text-red-500" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-foreground">데이터를 불러오지 못했습니다</p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
      <Button variant="outline" onClick={onRetry} aria-label="다시 시도">
        다시 시도
      </Button>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────────
const CountryCostDetailPage = () => {
  const { countryId } = useParams({ from: '/_authenticated/cost/$countryId' });
  const { data, isLoading, isError, error, refetch } = useCountryCost(countryId);
  const [selectedCompareId, setSelectedCompareId] = useState(82);

  const countryName = COUNTRY_NAME_MAP[countryId] ?? `국가 #${countryId}`;

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* ── 브레드크럼 ──────────────────────────────────────────── */}
        <nav
          className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8"
          aria-label="페이지 경로"
        >
          <Link
            to="/main"
            className="hover:text-foreground transition-colors no-underline"
          >
            홈
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <Link
            to="/cost"
            className="hover:text-foreground transition-colors no-underline"
          >
            글로벌 물가
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground font-medium" aria-current="page">
            {countryName}
          </span>
        </nav>

        {/* ── 로딩 상태 ────────────────────────────────────────────── */}
        {isLoading && (
          <div
            className="flex flex-col items-center justify-center gap-4 py-20"
            role="status"
            aria-live="polite"
            aria-label="물가 데이터 불러오는 중"
          >
            <Loader2 className="size-8 animate-spin text-blue-500" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">물가 데이터 불러오는 중...</p>
            <div className="w-full max-w-3xl mt-4">
              <DetailPageSkeleton />
            </div>
          </div>
        )}

        {/* ── 에러 상태 ────────────────────────────────────────────── */}
        {isError && (
          <ErrorState error={error as Error} onRetry={() => void refetch()} />
        )}

        {/* ── 데이터 렌더링 ────────────────────────────────────────── */}
        {data && (
          <div className="space-y-10">

            {/* CountryHero */}
            <CountryHero countryId={countryId} currency={data.currency} />

            {/* KPI 카드 2열 */}
            <section
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              aria-label="주요 생활비 지표"
            >
              <PriceIndexCard currency={data.currency} onePerson={data.onePerson} />
              <PPPIndexCard
                currency={data.currency}
                familyOf4={data.familyOf4}
                salaryAfterTaxMedian={data.salaryAfterTaxMedian}
                meta={data.meta}
              />
            </section>

            <Separator />

            {/* 물가 비교 상세 섹션 — 비대칭 2열 35:65 */}
            <section aria-label="물가 비교 상세">
              <h2 className="text-xl font-bold text-foreground mb-6">물가 비교 상세</h2>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* 좌: 국가 선택 패널 35% */}
                <div className="lg:w-[35%] bg-card rounded-xl border border-border/60 shadow-sm p-5">
                  <CountrySelectorList
                    selectedId={selectedCompareId}
                    onSelect={setSelectedCompareId}
                  />
                </div>

                {/* 우: 생활비 항목 테이블 65% */}
                <div className="lg:flex-1 bg-card rounded-xl border border-border/60 shadow-sm p-5">
                  <PriceItemTable
                    currency={data.currency}
                    onePerson={data.onePerson}
                    countryLabel={countryName}
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* 물가 지수 추이 차트 */}
            <section
              className="bg-card rounded-xl border border-border/60 shadow-sm p-6"
              aria-label="물가 지수 추이 차트"
            >
              <PriceIndexLineChart />
            </section>

            <Separator />

            {/* 주요 도시 물가 */}
            <CityCardGrid />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CountryCostDetailPage;
