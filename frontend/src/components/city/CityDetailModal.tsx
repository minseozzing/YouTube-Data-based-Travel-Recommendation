import { motion, type Variants } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
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
import type { CityDetail } from '@/schemas/city.schema';

// ─── 더미 도시 상세 (백엔드 없이 모달 탭 확인용) ─────────────────────
const DUMMY_CITY_DETAILS: Record<number, CityDetail> = {
  1:  { cityId: 1,  cityName: '도쿄',       countryId: 1,  countryName: '일본',      imgUrl: 'https://picsum.photos/seed/tokyo/800/1200',     matchingScore: 92, recommendReason: '일본 특유의 현대와 전통이 공존하는 문화, 안전한 치안, 다양한 미식 경험이 당신의 여행 스타일과 92% 일치합니다. 도쿄 타워와 센소지 사원 등 세계적인 명소를 합리적인 예산으로 즐길 수 있습니다.', keywords: ['미식', '전통문화', '쇼핑', '안전', '야경'], dailyCost: 120000, flightPrice: 320000, latitude: 35.6762, longitude: 139.6503 },
  2:  { cityId: 2,  cityName: '파리',       countryId: 2,  countryName: '프랑스',    imgUrl: 'https://picsum.photos/seed/paris/800/1200',     matchingScore: 85, recommendReason: '세계 예술과 패션의 중심지 파리는 루브르 박물관, 에펠탑 등 문화 콘텐츠가 풍부해 당신의 문화/역사 취향과 85% 매칭됩니다. 센강 크루즈와 몽마르뜨 언덕에서 잊지 못할 낭만을 경험하세요.', keywords: ['예술', '패션', '미식', '낭만', '역사'], dailyCost: 180000, flightPrice: 780000, latitude: 48.8566, longitude: 2.3522 },
  3:  { cityId: 3,  cityName: '뉴욕',       countryId: 3,  countryName: '미국',      imgUrl: 'https://picsum.photos/seed/newyork/800/1200',   matchingScore: 78, recommendReason: '잠들지 않는 도시 뉴욕은 브로드웨이 공연, 세계 최고의 박물관들과 다양한 나이트라이프로 당신의 액티비티 취향과 78% 일치합니다. 타임스퀘어의 화려함을 직접 느껴보세요.', keywords: ['도시', '쇼핑', '공연', '다양성', '나이트라이프'], dailyCost: 250000, flightPrice: 950000, latitude: 40.7128, longitude: -74.0060 },
  4:  { cityId: 4,  cityName: '시드니',     countryId: 4,  countryName: '호주',      imgUrl: 'https://picsum.photos/seed/sydney/800/1200',    matchingScore: 70, recommendReason: '하버브리지와 오페라 하우스가 어우러진 시드니는 도시와 자연을 동시에 즐길 수 있어 자연/경관 취향과 70% 매칭됩니다. 본다이 비치에서 서핑을 즐기고 블루마운틴 국립공원을 탐험해보세요.', keywords: ['해변', '자연', '서핑', '도시', '국립공원'], dailyCost: 200000, flightPrice: 680000, latitude: -33.8688, longitude: 151.2093 },
  5:  { cityId: 5,  cityName: '방콕',       countryId: 5,  countryName: '태국',      imgUrl: 'https://picsum.photos/seed/bangkok/800/1200',   matchingScore: 88, recommendReason: '화려한 왕궁과 사원, 세계 최고 수준의 스트리트 푸드, 합리적인 물가가 당신의 음식/미식 취향과 88% 일치합니다. 카오산 로드의 활기찬 분위기와 수상시장의 이국적인 매력을 느껴보세요.', keywords: ['길거리음식', '사원', '수상시장', '저물가', '야시장'], dailyCost: 70000, flightPrice: 280000, latitude: 13.7563, longitude: 100.5018 },
  6:  { cityId: 6,  cityName: '두바이',     countryId: 6,  countryName: 'UAE',       imgUrl: 'https://picsum.photos/seed/dubai/800/1200',     matchingScore: 65, recommendReason: '세계 최고층 빌딩 부르즈 칼리파와 럭셔리 쇼핑몰로 대표되는 두바이는 현대적인 도시 경험을 원하는 여행자와 65% 매칭됩니다. 사막 사파리와 아부다비 당일치기로 다양한 경험을 쌓아보세요.', keywords: ['럭셔리', '쇼핑', '사막', '현대건축', '카지노'], dailyCost: 230000, flightPrice: 620000, latitude: 25.2048, longitude: 55.2708 },
  7:  { cityId: 7,  cityName: '바르셀로나', countryId: 7,  countryName: '스페인',    imgUrl: 'https://picsum.photos/seed/barcelona/800/1200', matchingScore: 82, recommendReason: '가우디의 사그라다 파밀리아와 구엘 공원, 지중해 해변, 플라멩코가 어우러진 바르셀로나는 문화와 자연 취향을 모두 충족시켜 82% 매칭됩니다. 람블라스 거리의 활기를 느껴보세요.', keywords: ['건축', '해변', '축구', '야경', '음식'], dailyCost: 140000, flightPrice: 820000, latitude: 41.3851, longitude: 2.1734 },
  8:  { cityId: 8,  cityName: '싱가포르',   countryId: 8,  countryName: '싱가포르',  imgUrl: 'https://picsum.photos/seed/singapore/800/1200', matchingScore: 90, recommendReason: '아시아의 허브 싱가포르는 완벽한 치안, 다양한 음식 문화, 마리나베이 샌즈 등 세계적 명소로 당신의 도시/쇼핑 취향과 90% 일치합니다. 가든스 바이 더 베이에서 미래도시를 만끽하세요.', keywords: ['안전', '미식', '쇼핑', '도시', '나이트라이프'], dailyCost: 160000, flightPrice: 350000, latitude: 1.3521, longitude: 103.8198 },
  9:  { cityId: 9,  cityName: '로마',       countryId: 9,  countryName: '이탈리아',  imgUrl: 'https://picsum.photos/seed/rome/800/1200',      matchingScore: 76, recommendReason: '콜로세움, 바티칸, 트레비 분수 등 2000년 역사의 유적이 살아 숨쉬는 로마는 문화/역사 취향과 76% 매칭됩니다. 로마의 정통 파스타와 젤라토로 미식 여행도 즐겨보세요.', keywords: ['유적지', '역사', '미식', '예술', '성당'], dailyCost: 160000, flightPrice: 850000, latitude: 41.9028, longitude: 12.4964 },
  10: { cityId: 10, cityName: '발리',       countryId: 10, countryName: '인도네시아', imgUrl: 'https://picsum.photos/seed/bali/800/1200',     matchingScore: 95, recommendReason: '신들의 섬 발리는 우붓의 라이스 테라스, 꾸따 해변의 서핑, 합리적인 물가가 당신의 자연/경관 취향과 95% 완벽하게 매칭됩니다. 발리의 일몰을 보며 스파를 즐겨보세요.', keywords: ['해변', '서핑', '힐링', '사원', '저물가'], dailyCost: 60000, flightPrice: 420000, latitude: -8.3405, longitude: 115.0920 },
  11: { cityId: 11, cityName: '암스테르담', countryId: 11, countryName: '네덜란드',  imgUrl: 'https://picsum.photos/seed/amsterdam/800/1200', matchingScore: 72, recommendReason: '운하와 자전거의 도시 암스테르담은 반 고흐 미술관, 앤 프랑크 하우스 등 풍부한 문화 콘텐츠로 72% 매칭됩니다. 튤립 시즌에 방문하면 더욱 아름다운 풍경을 감상할 수 있습니다.', keywords: ['운하', '미술관', '자전거', '튤립', '야경'], dailyCost: 170000, flightPrice: 890000, latitude: 52.3676, longitude: 4.9041 },
  12: { cityId: 12, cityName: '서울',       countryId: 12, countryName: '한국',      imgUrl: 'https://picsum.photos/seed/seoul/800/1200',     matchingScore: 87, recommendReason: '경복궁과 남산, K-팝과 K-뷰티, 홍대와 강남의 쇼핑까지 전통과 트렌드가 공존하는 서울은 도시/쇼핑 취향과 87% 매칭됩니다. 한강 야경과 치맥을 즐겨보세요.', keywords: ['K팝', '쇼핑', '미식', '야경', '전통문화'], dailyCost: 80000, flightPrice: 0, latitude: 37.5665, longitude: 126.9780 },
  13: { cityId: 13, cityName: '이스탄불',   countryId: 13, countryName: '터키',      imgUrl: 'https://picsum.photos/seed/istanbul/800/1200',  matchingScore: 60, recommendReason: '동서양 문명이 교차하는 이스탄불은 블루 모스크, 하기아 소피아, 그랜드 바자르 등 이국적인 매력으로 60% 매칭됩니다. 보스포루스 크루즈로 유럽과 아시아를 동시에 감상해보세요.', keywords: ['역사', '이슬람문화', '시장', '크루즈', '미식'], dailyCost: 90000, flightPrice: 650000, latitude: 41.0082, longitude: 28.9784 },
  14: { cityId: 14, cityName: '프라하',     countryId: 14, countryName: '체코',      imgUrl: 'https://picsum.photos/seed/prague/800/1200',    matchingScore: 80, recommendReason: '백탑의 도시 프라하는 중세 건축의 보고로 카를 교와 프라하 성이 문화/역사 취향과 80% 매칭됩니다. 세계 최고의 맥주와 저렴한 물가로 가성비 최고의 유럽 여행지입니다.', keywords: ['중세건축', '맥주', '야경', '저물가', '유적지'], dailyCost: 100000, flightPrice: 870000, latitude: 50.0755, longitude: 14.4378 },
  15: { cityId: 15, cityName: '칸쿤',       countryId: 15, countryName: '멕시코',    imgUrl: 'https://picsum.photos/seed/cancun/800/1200',    matchingScore: 55, recommendReason: '카리브해의 에메랄드빛 바다와 마야 문명 유적이 공존하는 칸쿤은 액티비티 취향과 55% 매칭됩니다. 스노클링과 스쿠버다이빙으로 세계 최고의 산호초를 탐험해보세요.', keywords: ['해변', '스노클링', '마야유적', '리조트', '서핑'], dailyCost: 130000, flightPrice: 1100000, latitude: 21.1619, longitude: -86.8515 },
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

  // API 실패 시 더미 데이터 fallback
  const city = cityFromApi ?? (isError && selectedCityId ? DUMMY_CITY_DETAILS[selectedCityId] ?? null : null);
  const showError = isError && !city;

  return (
    <Dialog open={isCityModalOpen} onOpenChange={(open) => { if (!open) closeCityModal(); }}>
      <DialogContent
        showClose={false}
        className="p-0 overflow-hidden w-full max-w-4xl h-[85vh] flex flex-row"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {city ? `${city.cityName} 도시 상세 정보` : '도시 상세 정보'}
        </DialogTitle>

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
