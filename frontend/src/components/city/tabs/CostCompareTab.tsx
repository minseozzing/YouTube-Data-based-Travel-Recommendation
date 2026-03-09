import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ExchangeRateDashboard } from '@/components/cost/ExchangeRateDashboard';
import { ExchangeRateChart } from '@/components/cost/ExchangeRateChart';
import { CostDetailTable } from '@/components/cost/CostDetailTable';
import { SeoulCompareSection } from '@/components/cost/SeoulCompareSection';
import { useCityPriceTab } from '@/hooks/cost/useCityPriceTab';
import { SEOUL_CITY_ID } from '@/api/cost.api';
import { useCostDetail } from '@/hooks/cost/useCostDetail';
import type { CityDetail } from '@/schemas/city.schema';

interface CostCompareTabProps {
  city: CityDetail;
}

const tabVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

export function CostCompareTab({ city }: CostCompareTabProps) {
  // 도시 상세 정보에서 기본 통화 추출 (기본값 USD)
  const [currency, setCurrency] = useState('USD');

  // 통합 훅 호출 (4개 API: 상세, 비교, 환율, 추이)
  const { exchangeRate, costDetail, costCompare, isLoading, isError } = useCityPriceTab(
    city.cityId,
    currency,
  );

  // 서울 상세 정보 따로 호출 (비교 바 렌더링용)
  const seoulDetail = useCostDetail('city', SEOUL_CITY_ID);

  // 데이터 로드 시 통화 코드 업데이트
  useEffect(() => {
    const targetCurrency = costDetail.data?.target.currency;
    if (targetCurrency) {
      setCurrency(targetCurrency);
    }
  }, [costDetail.data]);

  if (isLoading && !costDetail.data) {
    return (
      <div className="flex h-full items-center justify-center p-20">
        <Loader2 className="size-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError && !costDetail.data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-10 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-sm text-muted-foreground">물가 정보를 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`cost-tab-${city.cityId}`}
        variants={tabVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col gap-5 p-4 bg-slate-50/30 dark:bg-slate-900/10 min-h-full"
      >
        {/* A. 실시간 환율 정보 */}
        <ExchangeRateDashboard
          data={exchangeRate.data}
          isLoading={exchangeRate.isLoading}
        />

        {/* B. 환율 추이 차트 */}
        <ExchangeRateChart currency={currency} />

        {/* C. 항목별 전체 물가표 (월급, 인구 정보 포함) */}
        <CostDetailTable
          data={costDetail.data}
          isLoading={costDetail.isLoading}
          seoulLivingCost={seoulDetail.data?.living_cost}
        />

        {/* D. 서울 vs 도시 물가 요약 및 비교 지표 (항목별 차이 차트 포함) */}
        <SeoulCompareSection
          data={costCompare.data}
          isLoading={costCompare.isLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
}
