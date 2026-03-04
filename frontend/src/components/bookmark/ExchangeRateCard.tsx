import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BookmarkDetail } from '@/schemas/bookmark.schema';

type ExchangeAtSaved = NonNullable<BookmarkDetail['exchangeAtSaved']>;

interface ExchangeRateCardProps {
  exchange?: ExchangeAtSaved;
}

export function ExchangeRateCard({ exchange }: ExchangeRateCardProps) {
  const changeRate =
    exchange && exchange.before > 0
      ? ((exchange.current - exchange.before) / exchange.before) * 100
      : null;

  const isPositive = changeRate !== null && changeRate > 0;
  const isNeutral = changeRate !== null && changeRate === 0;

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
          <DollarSign className="size-4 text-green-500" aria-hidden="true" />
          환율
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exchange ? (
          <div className="space-y-3">
            {/* 저장 당시 환율 */}
            <div>
              <p className="text-xs text-slate-400 mb-0.5">저장 당시</p>
              <p className="text-2xl font-bold text-blue-600">
                {exchange.before.toLocaleString()}
                <span className="ml-1 text-sm font-medium text-slate-500">원</span>
              </p>
            </div>

            {/* 현재 환율 */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">현재</p>
                <p className="text-lg font-semibold text-slate-800">
                  {exchange.current.toLocaleString()}
                  <span className="ml-1 text-sm font-medium text-slate-500">원</span>
                </p>
              </div>

              {/* 변화율 */}
              {changeRate !== null && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-semibold',
                    isNeutral && 'text-slate-500',
                    !isNeutral && isPositive && 'text-red-500',
                    !isNeutral && !isPositive && 'text-blue-500',
                  )}
                  aria-label={`환율 변화율 ${changeRate.toFixed(1)}%`}
                >
                  {isNeutral ? (
                    <Minus className="size-4" aria-hidden="true" />
                  ) : isPositive ? (
                    <TrendingUp className="size-4" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="size-4" aria-hidden="true" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {changeRate.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">저장된 환율 데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
