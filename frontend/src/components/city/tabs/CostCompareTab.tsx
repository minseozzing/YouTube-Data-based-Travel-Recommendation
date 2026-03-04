import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountryCost } from '@/hooks/cost/useCountryCost';
import { cn } from '@/lib/utils';
import type { CityDetail } from '@/schemas/city.schema';
import type { CountryCost } from '@/schemas/cost.schema';

// 백엔드 없을 때 기본 더미 물가 데이터
const DUMMY_COST: CountryCost = {
  countryId: 0,
  currency: 'JPY',
  onePerson: { totalWithRent: 180000, withoutRent: 120000, rentAndUtilities: 60000, food: 80000, transport: 25000 },
  familyOf4: { totalWithRent: 420000 },
  salaryAfterTaxMedian: 250000,
  population: 10000000,
  meta: { lastUpdatedAt: '2025-01-01T00:00:00Z', source: 'Demo Data' },
};

interface CostCompareTabProps {
  city: CityDetail;
}

// Seoul reference values (KRW)
const SEOUL_COSTS = {
  transport: 150000,
  food: 400000,
  rentAndUtilities: 800000,
};

const DUMMY_PPP_DATA = [
  { month: '2024.01', value: 88 },
  { month: '2024.02', value: 91 },
  { month: '2024.03', value: 87 },
  { month: '2024.04', value: 93 },
  { month: '2024.05', value: 95 },
  { month: '2024.06', value: 92 },
];

const DUMMY_EXCHANGE_DATA = [
  { month: '2024.01', seoul: 100, city: 85 },
  { month: '2024.02', seoul: 100, city: 88 },
  { month: '2024.03', seoul: 100, city: 82 },
  { month: '2024.04', seoul: 100, city: 90 },
  { month: '2024.05', seoul: 100, city: 95 },
  { month: '2024.06', seoul: 100, city: 92 },
];

export function CostCompareTab({ city }: CostCompareTabProps) {
  const { data: costFromApi, isLoading } = useCountryCost(city.countryId);

  // API 실패 시 더미 데이터 fallback
  const costData = costFromApi ?? (!isLoading ? DUMMY_COST : null);

  const currency = costData?.currency ?? 'KRW';

  // Calculate % difference vs Seoul for one-person total
  const seoulTotal = SEOUL_COSTS.transport + SEOUL_COSTS.food + SEOUL_COSTS.rentAndUtilities;
  const cityTotal = costData?.onePerson.totalWithRent ?? null;

  let diffPercent: number | null = null;
  let isHigher = false;
  if (cityTotal !== null) {
    // We compare monthly totals. Assume the city value is in local currency.
    // For display, just show the raw cost comparison note.
    diffPercent = Math.round(((cityTotal - seoulTotal) / seoulTotal) * 100);
    isHigher = diffPercent >= 0;
  }

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Top 2-column stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Seoul comparison stat */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-1">
            <span className="text-xs text-muted-foreground">서울 대비 생활비</span>
            <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-200 dark:border-green-800">
              UPDATED TODAY
            </Badge>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-28 mt-2" />
          ) : diffPercent !== null ? (
            <div className="flex items-center gap-1.5 mt-1">
              {isHigher ? (
                <TrendingUp className="size-4 text-red-500" />
              ) : (
                <TrendingDown className="size-4 text-blue-500" />
              )}
              <span
                className={cn(
                  'text-xl font-bold',
                  isHigher ? 'text-red-600' : 'text-blue-600',
                )}
              >
                약 {Math.abs(diffPercent)}% {isHigher ? '높을 수' : '낮을 수'}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">데이터 로딩 중</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            1인 기준 월 생활비 비교
          </p>
        </div>

        {/* Monthly rent card */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">월 임대료</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-32 mt-2" />
          ) : costData ? (
            <>
              <p className="text-xl font-bold text-foreground mt-1">
                {costData.onePerson.rentAndUtilities.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">{currency} / 월</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">데이터 없음</p>
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-3">
        {/* PPP Trend Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium text-foreground">최근 6년 PPP 지수 추이</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={DUMMY_PPP_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9 }}
                tickFormatter={(v) => String(v).slice(5)}
              />
              <YAxis tick={{ fontSize: 9 }} domain={[80, 100]} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value) => [String(value), 'PPP']}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exchange Rate Bar Chart */}
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-medium text-foreground">
              환율 ({currency}/KRW)
            </span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={DUMMY_EXCHANGE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9 }}
                tickFormatter={(v) => String(v).slice(5)}
              />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 9 }} />
              <Bar dataKey="seoul" name="서울" fill="#94a3b8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="city" name={city.cityName} fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost item comparison table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-xs font-semibold text-foreground">주요 항목별 비교</span>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>서울</span>
            <span>{city.cityName}</span>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Transport */}
            <CostRow
              label="교통비"
              seoulValue={`${SEOUL_COSTS.transport.toLocaleString()} KRW`}
              cityValue={
                costData
                  ? `${costData.onePerson.transport.toLocaleString()} ${currency}`
                  : '-'
              }
            />
            {/* Food */}
            <CostRow
              label="식비"
              seoulValue={`${SEOUL_COSTS.food.toLocaleString()} KRW`}
              cityValue={
                costData
                  ? `${costData.onePerson.food.toLocaleString()} ${currency}`
                  : '-'
              }
            />
            {/* Housing */}
            <CostRow
              label="주거비"
              seoulValue={`${SEOUL_COSTS.rentAndUtilities.toLocaleString()} KRW`}
              cityValue={
                costData
                  ? `${costData.onePerson.rentAndUtilities.toLocaleString()} ${currency}`
                  : '-'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface CostRowProps {
  label: string;
  seoulValue: string;
  cityValue: string;
}

function CostRow({ label, seoulValue, cityValue }: CostRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex gap-6 text-right">
        <span className="text-xs text-muted-foreground w-24">{seoulValue}</span>
        <span className="text-xs font-medium text-foreground w-24">{cityValue}</span>
      </div>
    </div>
  );
}
