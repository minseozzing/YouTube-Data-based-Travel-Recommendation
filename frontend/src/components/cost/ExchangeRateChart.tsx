import { useState } from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useExchangeRateHistory } from '@/hooks/cost/useExchangeRateHistory';

dayjs.locale('ko');

type PeriodType = 'd' | 'w' | 'm';

const PERIOD_LABELS: Record<PeriodType, string> = {
  m: '월별',
  w: '주별',
  d: '일별',
};

const DATE_FORMATS: Record<PeriodType, string> = {
  d: 'MM/DD',
  w: 'MM/DD',
  m: 'YY/MM',
};

interface ExchangeRateChartProps {
  currency: string;
}

export function ExchangeRateChart({ currency }: ExchangeRateChartProps) {
  const [type, setType] = useState<PeriodType>('m');
  const { data, isLoading } = useExchangeRateHistory(currency, type);

  const chartData = data?.trend.map((item) => ({
    date: dayjs(item.date).format(DATE_FORMATS[type]),
    rate: item.krw_per_1target,
  }));

  const avg =
    data && data.trend.length > 0
      ? data.trend.reduce((sum, t) => sum + t.krw_per_1target, 0) / data.trend.length
      : null;

  const latestRate = data?.latest.krw_per_1target ?? null;
  const isFavorable = avg !== null && latestRate !== null && latestRate < avg;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      {/* Header + type selector */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-foreground">
          환율 추이
          {data?.latest.display_symbol ? ` (${data.latest.display_symbol})` : ''}
        </span>
        <div className="flex gap-1 bg-muted rounded-lg p-0.5">
          {(Object.keys(PERIOD_LABELS) as PeriodType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                'text-xs px-3 py-1.5 rounded-md font-medium transition-colors',
                type === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {PERIOD_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : chartData && chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => v.toFixed(1)}
              />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                formatter={(value: number) => [`${value.toFixed(2)} KRW`, '환율']}
              />
              {avg !== null && (
                <ReferenceLine
                  y={avg}
                  stroke="#94a3b8"
                  strokeDasharray="4 2"
                  label={{ value: '평균', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
                />
              )}
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#3b82f6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Travel tip */}
          <div
            className={cn(
              'flex items-start gap-2.5 mt-4 rounded-lg px-4 py-3 text-sm',
              isFavorable
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
            )}
          >
            {isFavorable ? (
              <Lightbulb className="size-4 mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
            )}
            <span>
              {isFavorable
                ? '현재 환율이 기간 평균보다 유리합니다. 지금이 여행 적기일 수 있어요!'
                : '현재 환율이 기간 평균보다 불리합니다. 환율 추이를 좀 더 지켜보세요.'}
            </span>
          </div>
        </>
      ) : (
        <p className="text-base text-muted-foreground">환율 데이터를 불러올 수 없습니다</p>
      )}
    </div>
  );
}
