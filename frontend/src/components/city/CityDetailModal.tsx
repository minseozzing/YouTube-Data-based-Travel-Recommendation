import { motion, type Variants } from 'framer-motion';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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

  // API 실패 시 더미 데이터 fallback
  const city = cityFromApi ?? (isError && selectedCityId ? DUMMY_CITY_DETAILS[selectedCityId] ?? null : null);
  const showError = isError && !city;

  return (
    <Dialog open={isCityModalOpen} onOpenChange={(open) => { if (!open) closeCityModal(); }}>
      <DialogContent
        showClose={false}
        className="p-0 overflow-hidden w-screen h-screen max-w-none rounded-none flex flex-row"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {city ? `${city.cityName} 도시 상세 정보` : '도시 상세 정보'}
        </DialogTitle>

        {/* 전체화면 닫기 버튼 */}
        <button
          onClick={closeCityModal}
          aria-label="닫기"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Left panel: Destination hero card */}
        {isLoading || !city ? (
          <HeroSkeleton />
        ) : (
          <DestinationHeroCard city={city} />
        )}

        {/* Right panel: Tabs + content */}
        <div className="flex flex-col flex-1 min-w-0 bg-background">
          {/* Tab navigation */}
          <CityDetailTabNav
            activeTab={activeCityTab}
            onTabChange={setActiveCityTab}
          />

          {/* Tab content area */}
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
      </DialogContent>
    </Dialog>
  );
}
