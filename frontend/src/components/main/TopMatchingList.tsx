import { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCityList } from '@/hooks/city/useCityList';
import { useUiStore } from '@/stores/uiStore';
import { TopMatchingCard } from './TopMatchingCard';
import { cn } from '@/lib/utils';
import { DUMMY_CITIES } from '@/data/dummyCityData';

const TOP_N = 5;

export function TopMatchingList() {
  const { data: citiesFromApi, isLoading } = useCityList();
  const { globeBudgetFilter, globeRiskFilter, globeDuration, isRecommendActive } = useUiStore();

  const cities = citiesFromApi?.length ? citiesFromApi : DUMMY_CITIES;

  const topCities = useMemo(() => {
    const base = isRecommendActive
      ? cities.filter((city) => {
          const adjustedBudget = (city.estimatedBudget / 7) * globeDuration;
          const withinBudget =
            adjustedBudget >= globeBudgetFilter[0] &&
            adjustedBudget <= globeBudgetFilter[1];
          const withinRisk = city.riskLevel <= globeRiskFilter;
          return withinBudget && withinRisk;
        })
      : cities;
    return [...base]
      .sort((a, b) => (b.matchingScore ?? 0) - (a.matchingScore ?? 0))
      .slice(0, TOP_N);
  }, [cities, globeBudgetFilter, globeRiskFilter, globeDuration, isRecommendActive]);

  return (
    <section
      className={cn(
        'bg-white/85 backdrop-blur-md rounded-2xl shadow-lg p-4',
        'flex flex-col gap-2 flex-1 min-h-0',
      )}
      aria-label="최고의 매칭 여행지"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-blue-500" aria-hidden="true" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            최고의 매칭 여행지
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 font-medium">TOP {TOP_N}</span>
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading && (
        <div className="flex flex-col gap-2" role="status" aria-label="목록 불러오는 중">
          {Array.from({ length: TOP_N }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-5 w-10 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && topCities.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6 text-center">
          <MapPin className="size-8 text-slate-300" aria-hidden="true" />
          <p className="text-xs text-slate-400">추천 여행지가 없습니다.</p>
          <p className="text-[10px] text-slate-400">
            여행 설정을 업데이트해 보세요.
          </p>
        </div>
      )}

      {/* 목록 */}
      {!isLoading && topCities.length > 0 && (
        <ul className="flex flex-col overflow-y-auto flex-1" role="list">
          {topCities.map((city, index) => (
            <li key={city.cityId} role="listitem">
              <TopMatchingCard city={city} rank={index + 1} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
