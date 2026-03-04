import { useParams, Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { useBookmarkDetail } from '@/hooks/bookmark/useBookmarkDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QueryErrorFallback from '@/components/common/QueryErrorFallback';
import { Button } from '@/components/ui/button';
import { BookmarkHeroSection } from '@/components/bookmark/BookmarkHeroSection';
import { SavedFlightPriceCard } from '@/components/bookmark/SavedFlightPriceCard';
import { ExchangeRateCard } from '@/components/bookmark/ExchangeRateCard';
import { SavedNewsCard } from '@/components/bookmark/SavedNewsCard';
import { CostSummaryCard } from '@/components/bookmark/CostSummaryCard';

const BookmarkDetailPage = () => {
  const { id } = useParams({ from: '/_authenticated/bookmarks/$id' });
  const { data, isLoading, isError, error, refetch } = useBookmarkDetail(id);

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" message="북마크 상세 불러오는 중..." />
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="mx-auto max-w-md px-6 py-16">
          <QueryErrorFallback error={error as Error} onRetry={() => refetch()} />
        </div>
      )}

      {data && (
        <>
          {/* 히어로 섹션 */}
          <BookmarkHeroSection data={data} />

          {/* 대시보드 영역 */}
          <div className="mx-auto max-w-7xl px-6 py-8">
            {/* 브레드크럼 + 데이터 업데이트 버튼 행 */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <nav
                className="flex items-center gap-1.5 text-sm text-slate-400"
                aria-label="브레드크럼"
              >
                <Link
                  to="/bookmarks"
                  className="hover:text-slate-700 transition-colors no-underline"
                  aria-label="북마크 목록으로 이동"
                >
                  저장된 도시
                </Link>
                <ChevronRight className="size-3.5" aria-hidden="true" />
                <span className="text-slate-600 font-medium">{data.cityName}</span>
              </nav>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                aria-label="북마크 데이터 새로고침"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                데이터 업데이트
              </Button>
            </div>

            {/* 2열 대시보드 그리드 */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[55fr_45fr]">
              {/* 좌측 열: 항공권 + 주요 이슈 */}
              <div className="flex flex-col gap-5">
                <SavedFlightPriceCard flight={data.flightAtSaved} />
                <SavedNewsCard news={data.newsAtSaved} />
              </div>

              {/* 우측 열: 환율 + 해외 물가 */}
              <div className="flex flex-col gap-5">
                <ExchangeRateCard exchange={data.exchangeAtSaved} />
                <CostSummaryCard cityId={data.cityId} />
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default BookmarkDetailPage;
