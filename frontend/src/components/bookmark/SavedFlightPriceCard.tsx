import { Plane } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import dayjs from '@/utils/dayjs';
import type { BookmarkDetail } from '@/schemas/bookmark.schema';

type FlightAtSaved = NonNullable<BookmarkDetail['flightAtSaved']>;

interface SavedFlightPriceCardProps {
  flight?: FlightAtSaved;
}

export function SavedFlightPriceCard({ flight }: SavedFlightPriceCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
          <Plane className="size-4 text-blue-500" aria-hidden="true" />
          저장 시점 항공권 가격
        </CardTitle>
      </CardHeader>
      <CardContent>
        {flight ? (
          <div className="space-y-3">
            {/* 메인 가격 수치 */}
            <p className="text-3xl font-bold text-slate-900">
              {flight.price.toLocaleString()}
              <span className="ml-1 text-lg font-semibold text-slate-600">원</span>
            </p>

            {/* 출발지 → 목적지 */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-semibold">
                {flight.origin}
              </span>
              <Plane className="size-3.5 text-slate-400" aria-hidden="true" />
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono font-semibold">
                {flight.destination}
              </span>
            </div>

            {/* 날짜 범위 */}
            <p className="text-xs text-slate-400">
              {dayjs(flight.startDate).format('YYYY.MM.DD')}
              {' ~ '}
              {dayjs(flight.endDate).format('YYYY.MM.DD')}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">저장된 항공권 데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
