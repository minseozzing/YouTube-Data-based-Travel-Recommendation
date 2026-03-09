import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import type { ExchangeRateNew } from '@/schemas/cost.schema';

dayjs.locale('ko');

interface ExchangeRateDashboardProps {
  data: ExchangeRateNew | undefined;
  isLoading: boolean;
}

export function ExchangeRateDashboard({ data, isLoading }: ExchangeRateDashboardProps) {
  // rate = 1 KRW → target, so 1 target = 1/rate KRW
  const krwPerTarget = data ? Math.round(1 / data.rate) : null;
  const asOfFormatted = data ? dayjs(data.asOf).format('MM월 DD일') : '';

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          현재 환율
        </span>
        {data && (
          <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800 gap-1 px-2 py-0.5">
            <RefreshCw className="size-3" />
            실시간 환율 기준 · {asOfFormatted}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
      ) : data && krwPerTarget !== null ? (
        <div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-foreground">
              {krwPerTarget.toLocaleString()}
            </span>
            <span className="text-base text-muted-foreground mb-1">KRW</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            1 {data.target} = {krwPerTarget.toLocaleString()} KRW
          </p>
          <div className="flex items-center gap-1 mt-3">
            <RateTrendIcon rate={data.rate} />
          </div>
        </div>
      ) : (
        <p className="text-base text-muted-foreground">데이터를 불러올 수 없습니다</p>
      )}
    </div>
  );
}

function RateTrendIcon({ rate }: { rate: number }) {
  // rate > 0.001 = relatively strong target currency vs KRW
  const isStrong = rate > 0.001;
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-sm font-medium',
        isStrong ? 'text-red-500' : 'text-blue-500',
      )}
    >
      {isStrong ? (
        <TrendingUp className="size-3.5" />
      ) : (
        <TrendingDown className="size-3.5" />
      )}
      {isStrong ? '원화 대비 강세' : '원화 대비 약세'}
    </span>
  );
}
