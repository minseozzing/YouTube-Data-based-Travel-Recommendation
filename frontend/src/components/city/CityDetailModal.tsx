import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useUiStore } from '@/stores/uiStore';
import { useCityDetail } from '@/hooks/city/useCityDetail';
import { DestinationHeroCard } from '@/components/city/DestinationHeroCard';
import { CityDetailTabNav } from '@/components/city/CityDetailTabNav';
import { RecommendTab } from '@/components/city/tabs/RecommendTab';
import { CostCompareTab } from '@/components/city/tabs/CostCompareTab';
import { FlightTab } from '@/components/city/tabs/FlightTab';
import { NewsTab } from '@/components/city/tabs/NewsTab';
import { DUMMY_CITY_DETAILS } from '@/data/dummyCityData';

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.2, ease: 'easeIn' } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function HeroSkeleton() {
  return (
    <div className="relative flex flex-col w-72 shrink-0 rounded-l-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
      <div className="flex-1" />
      <div className="p-5 flex flex-col gap-3">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CityDetailModal() {
  const {
    selectedCityId,
    isCityModalOpen,
    activeCityTab,
    closeCityModal,
    setActiveCityTab,
  } = useUiStore();

  const { data: cityFromApi, isLoading, isError } = useCityDetail(selectedCityId);

  const city = cityFromApi ?? (isError && selectedCityId ? DUMMY_CITY_DETAILS[selectedCityId] ?? null : null);
  const showError = isError && !city;

  return (
    <AnimatePresence>
      {isCityModalOpen && (
        <>
          {/* 블러 배경 오버레이 */}
          <motion.div
            key="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={closeCityModal}
            aria-hidden="true"
          />

          {/* 모달 본체: navbar 아래(top-[60px])부터, 사이드바 오른쪽(left-[292px])부터 */}
          <motion.div
            key="modal-content"
            role="dialog"
            aria-modal="true"
            aria-label={city ? `${city.cityName} 도시 상세 정보` : '도시 상세 정보'}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-3 left-3 right-3 bottom-3 z-50
                       rounded-2xl overflow-hidden flex flex-row shadow-2xl"
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeCityModal}
              aria-label="닫기"
              className="absolute top-3 right-3 z-50 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* 좌측: 도시 히어로 카드 */}
            {isLoading || !city ? (
              <HeroSkeleton />
            ) : (
              <DestinationHeroCard city={city} />
            )}

            {/* 우측: 탭 + 콘텐츠 */}
            <div className="flex flex-col flex-1 min-w-0 bg-background">
              <CityDetailTabNav
                activeTab={activeCityTab}
                onTabChange={setActiveCityTab}
              />

              <div
                id={`tab-panel-${activeCityTab}`}
                role="tabpanel"
                aria-label={activeCityTab}
                className="flex-1 overflow-y-auto"
              >
                {isLoading && (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="size-8 animate-spin text-blue-500" />
                  </div>
                )}

                {showError && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
                    <AlertCircle className="size-10 text-destructive" />
                    <p className="text-sm text-muted-foreground">
                      도시 정보를 불러오는데 실패했습니다.
                    </p>
                  </div>
                )}

                {city && !isLoading && !showError && (
                  <motion.div
                    key={activeCityTab}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="h-full"
                  >
                    {activeCityTab === 'recommend' && (
                      <RecommendTab city={city} onTabChange={setActiveCityTab} />
                    )}
                    {activeCityTab === 'cost' && (
                      <CostCompareTab city={city} />
                    )}
                    {activeCityTab === 'flight' && (
                      <FlightTab city={city} />
                    )}
                    {activeCityTab === 'news' && (
                      <NewsTab city={city} />
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
