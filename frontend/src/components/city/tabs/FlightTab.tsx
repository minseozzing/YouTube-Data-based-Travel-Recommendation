import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Plane, Clock, Hotel, TrendingUp, TrendingDown, Minus, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCitySummary } from '@/hooks/flight/useCitySummary';
import { useFlightCalendar } from '@/hooks/flight/useFlightCalendar';
import { useFlightTrend } from '@/hooks/flight/useFlightTrend';
import dayjs from '@/utils/dayjs';
import type { CityDetail } from '@/schemas/city.schema';
import type {
  CitySummary,
  FlightCalendar,
  FlightTrend,
  DailyPriceEntry,
} from '@/schemas/flight.schema';

interface FlightTabProps {
  city: CityDetail;
}

function buildMonthTabs() {
  const now = dayjs();
  return Array.from({ length: 6 }, (_, i) => {
    const d = now.add(i, 'month');
    return { yearMonth: d.format('YYYY-MM'), label: d.format('YYYY.MM') };
  });
}
const MONTH_TABS = buildMonthTabs();

export function FlightTab({ city }: FlightTabProps) {
  const [selectedYearMonth, setSelectedYearMonth] = useState(MONTH_TABS[0].yearMonth);
  const cityId = city.cityId;

  const { data: summary, isLoading: summaryLoading } = useCitySummary(cityId, selectedYearMonth);
  const { data: calendar, isLoading: calendarLoading } = useFlightCalendar(cityId, selectedYearMonth);
  const { data: trend, isLoading: trendLoading } = useFlightTrend(cityId);

  const selectedMonth = dayjs(selectedYearMonth + '-01').month() + 1;
  const isPeakSeason = summary?.peak_season_months.includes(selectedMonth) ?? false;
  const isOffSeason = summary?.off_season_months.includes(selectedMonth) ?? false;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 월 선택 탭 (최상단으로 이동) */}
      <div className="flex gap-2.5 flex-wrap" role="tablist" aria-label="월 선택">
        {MONTH_TABS.map((tab) => {
          const active = tab.yearMonth === selectedYearMonth;
          const month = dayjs(tab.yearMonth + '-01').month() + 1;
          const peak = summary?.peak_season_months.includes(month);
          const off = summary?.off_season_months.includes(month);
          return (
            <button
              key={tab.yearMonth}
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedYearMonth(tab.yearMonth)}
              className={cn(
                'px-4 py-2 rounded-xl text-lg font-bold transition-colors relative',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                active
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              {tab.label}
              {peak && (
                <span className="absolute -top-1 -right-1 size-2.5 bg-red-400 rounded-full border-2 border-background" />
              )}
              {off && (
                <span className="absolute -top-1 -right-1 size-2.5 bg-blue-400 rounded-full border-2 border-background" />
              )}
            </button>
          );
        })}
        {summary && (
          <div className="flex items-center gap-3 ml-2">
            <span className="text-base text-muted-foreground flex items-center gap-1.5">
              <span className="size-2 bg-red-400 rounded-full" /> 성수기
            </span>
            <span className="text-base text-muted-foreground flex items-center gap-1.5">
              <span className="size-2 bg-blue-400 rounded-full" /> 비수기
            </span>
          </div>
        )}
      </div>

      <SummarySection isLoading={summaryLoading} summary={summary} />

      {/* 섹션 2: 달력형 일별 가격 + 날짜 클릭 히스토리 */}
      <FlightCalendarGrid
        isLoading={calendarLoading}
        calendar={calendar}
        yearMonth={selectedYearMonth}
        isPeakSeason={isPeakSeason}
        isOffSeason={isOffSeason}
      />

      {/* 섹션 3: 6개월 추이 차트 */}
      <TrendSection isLoading={trendLoading} trend={trend} />
    </div>
  );
}

// ─── 섹션 1: 도시 요약 ───────────────────────────────────────────────────────

function SummarySection({ isLoading, summary }: { isLoading: boolean; summary: CitySummary | undefined }) {
  if (isLoading) return <Skeleton className="w-full h-24 rounded-xl" />;
  if (!summary) return <EmptyState message="요약 정보를 불러올 수 없습니다." />;

  return (
    <section aria-label="도시 요약 정보">
      <div className="bg-card border border-border rounded-xl px-6 py-5 flex items-center justify-between shadow-sm">
        {/* 평균 항공권 */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Plane className="size-5 text-blue-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">항공권</span>
            <span className="text-lg font-black text-foreground">{summary.avg_flight_price.toLocaleString()}원</span>
          </div>
        </div>

        <div className="w-px h-10 bg-border mx-2" />

        {/* 평균 숙박비 */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Hotel className="size-5 text-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">숙박비</span>
            <span className="text-lg font-black text-foreground">{summary.avg_hotel_price.toLocaleString()}원</span>
          </div>
        </div>

        <div className="w-px h-10 bg-border mx-2" />

        {/* 경유 정보 */}
        <div className="flex items-center gap-3 flex-1 justify-center text-center">
          <Plane className="size-5 text-slate-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">경유</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-300">{summary.typical_stops_text}</span>
          </div>
        </div>

        <div className="w-px h-10 bg-border mx-2" />

        {/* 비행 시간 */}
        <div className="flex items-center gap-3 flex-1 justify-center text-center">
          <Clock className="size-5 text-slate-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">비행</span>
            <span className="text-lg font-black text-slate-700 dark:text-slate-300">{summary.avg_duration_text}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 섹션 2: 달력형 일별 가격 ─────────────────────────────────────────────────

type PriceView = 'outbound' | 'inbound' | 'total';

const PRICE_VIEW_LABELS: Record<PriceView, string> = {
  outbound: '가는편',
  inbound: '오는편',
  total: '합계',
};

function formatWan(price: number): string {
  return parseFloat((price / 10000).toFixed(1)) + '만';
}

type SelectedDay = {
  day: number;
  outbound: DailyPriceEntry | undefined;
  inbound: DailyPriceEntry | undefined;
};

function FlightCalendarGrid({
  isLoading,
  calendar,
  yearMonth,
  isPeakSeason,
  isOffSeason,
}: {
  isLoading: boolean;
  calendar: FlightCalendar | undefined;
  yearMonth: string;
  isPeakSeason: boolean;
  isOffSeason: boolean;
}) {
  const [priceView, setPriceView] = useState<PriceView>('outbound');
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  const { cells, outboundMap, inboundMap, cheapestDate, today } = useMemo(() => {
    const base = dayjs(yearMonth + '-01');
    const firstDow = base.day();
    const days = base.daysInMonth();
    const todayStr = dayjs().format('YYYY-MM-DD');

    const outMap = new Map<number, DailyPriceEntry>();
    const inMap = new Map<number, DailyPriceEntry>();

    if (calendar) {
      for (const d of calendar.outbound_daily_prices) outMap.set(dayjs(d.date).date(), d);
      for (const d of calendar.inbound_daily_prices) inMap.set(dayjs(d.date).date(), d);
    }

    let cheapest: number | null = null;
    let cheapestPrice = Infinity;
    for (let d = 1; d <= days; d++) {
      const out = outMap.get(d);
      const inn = inMap.get(d);
      let price: number | undefined;
      if (priceView === 'outbound') price = out?.price;
      else if (priceView === 'inbound') price = inn?.price;
      else if (out && inn) price = out.price + inn.price;
      if (price !== undefined && price < cheapestPrice) { cheapestPrice = price; cheapest = d; }
    }

    const raw: (number | null)[] = [
      ...Array<null>(firstDow).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ];
    while (raw.length % 7 !== 0) raw.push(null);

    return {
      cells: raw,
      outboundMap: outMap,
      inboundMap: inMap,
      cheapestDate: cheapest,
      today: todayStr.startsWith(yearMonth) ? dayjs(todayStr).date() : null,
    };
  }, [calendar, yearMonth, priceView]);

  const handleDayClick = (day: number) => {
    const out = outboundMap.get(day);
    const inn = inboundMap.get(day);
    if (!out && !inn) return;
    if (selectedDay?.day === day) { setSelectedDay(null); return; }
    setSelectedDay({ day, outbound: out, inbound: inn });
  };

  if (isLoading) return (
    <section aria-label="일별 항공권 가격">
      <Skeleton className="w-full h-80 rounded-xl" />
    </section>
  );

  return (
    <section aria-label="일별 항공권 가격">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black text-foreground">
            {dayjs(yearMonth + '-01').format('YYYY년 M월')}
          </h3>
          {isPeakSeason && (
            <Badge className="text-sm px-2 py-0.5 h-6 bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-0 font-bold">성수기</Badge>
          )}
          {isOffSeason && (
            <Badge className="text-sm px-2 py-0.5 h-6 bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-red-400 border-0 font-bold">비성수기</Badge>
          )}
        </div>
        <div className="flex rounded-lg overflow-hidden border-2 border-border text-base font-bold">
          {(['outbound', 'inbound', 'total'] as PriceView[]).map((v) => (
            <button
              key={v}
              onClick={() => { setPriceView(v); setSelectedDay(null); }}
              className={cn(
                'px-3.5 py-1.5 transition-colors',
                priceView === v
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              {PRICE_VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/10">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={cn(
              'py-2.5 text-center text-base font-black',
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600',
            )}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} className="py-4" />;

            const out = outboundMap.get(day);
            const inn = inboundMap.get(day);
            let price: number | undefined;
            if (priceView === 'outbound') price = out?.price;
            else if (priceView === 'inbound') price = inn?.price;
            else if (out && inn) price = out.price + inn.price;

            const isCheapest = day === cheapestDate && price !== undefined;
            const isToday = day === today;
            const isSelected = selectedDay?.day === day;
            const hasPrice = price !== undefined;
            const dow = idx % 7;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={!hasPrice}
                className={cn(
                  'flex flex-col items-center justify-start py-3 gap-1.5 min-h-[80px] border-r border-b border-border/50 last:border-r-0 transition-colors',
                  hasPrice && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  !hasPrice && 'cursor-default opacity-50',
                  isSelected && 'bg-slate-100 dark:bg-slate-800',
                  !isSelected && isCheapest && 'bg-orange-50 dark:bg-orange-950/30',
                )}
              >
                <span className={cn(
                  'text-lg font-black w-8 h-8 flex items-center justify-center rounded-full',
                  isToday && 'bg-blue-600 text-white shadow-md',
                  isSelected && !isToday && 'ring-2 ring-slate-400 dark:ring-slate-500',
                  !isToday && isCheapest && 'text-orange-600 dark:text-orange-400',
                  !isToday && !isCheapest && dow === 0 && 'text-red-500',
                  !isToday && !isCheapest && dow === 6 && 'text-blue-500',
                  !isToday && !isCheapest && dow !== 0 && dow !== 6 && 'text-foreground',
                )}>
                  {day}
                </span>
                {price !== undefined ? (
                  <span className={cn(
                    'text-sm leading-none font-black',
                    isCheapest ? 'text-orange-600 dark:text-orange-400 underline underline-offset-2' : 'text-muted-foreground',
                  )}>
                    {formatWan(price)}
                  </span>
                ) : (
                  <span className="text-sm leading-none text-transparent select-none">-</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-4 px-4 py-3 border-t border-border bg-muted/5">
          <div className="flex items-center gap-1.5">
            <div className="size-3.5 rounded bg-orange-100 dark:bg-orange-950/50 border border-orange-300" />
            <span className="text-base font-bold text-muted-foreground">최저가</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3.5 rounded-full bg-blue-600" />
            <span className="text-base font-bold text-muted-foreground">오늘</span>
          </div>
          {priceView === 'total' && (
            <span className="text-sm font-medium text-muted-foreground ml-auto">* 가는편+오는편 모두 있는 날만 표시</span>
          )}
        </div>
      </div>

      {/* 날짜 클릭 시 히스토리 패널 */}
      {selectedDay && (
        <DateHistoryPanel
          selectedDay={selectedDay}
          yearMonth={yearMonth}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </section>
  );
}

// ─── 날짜 히스토리 패널 ───────────────────────────────────────────────────────

function DateHistoryPanel({
  selectedDay,
  yearMonth,
  onClose,
}: {
  selectedDay: SelectedDay;
  yearMonth: string;
  onClose: () => void;
}) {
  const dateLabel = dayjs(`${yearMonth}-${String(selectedDay.day).padStart(2, '0')}`).format('M월 D일 (ddd)');

  return (
    <div className="mt-4 bg-card border-2 border-border rounded-xl p-6 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <p className="text-xl font-black text-foreground">{dateLabel} 상세 가격 히스토리</p>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
          <X className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HistoryCard label="가는편" entry={selectedDay.outbound} />
        <HistoryCard label="오는편" entry={selectedDay.inbound} />
      </div>

      {selectedDay.outbound && selectedDay.inbound && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
          <span className="text-base font-bold text-slate-600 dark:text-slate-400">총 합계 (왕복)</span>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {(selectedDay.outbound.price + selectedDay.inbound.price).toLocaleString()}원
          </span>
        </div>
      )}
    </div>
  );
}

function HistoryCard({ label, entry }: { label: string; entry: DailyPriceEntry | undefined }) {
  if (!entry) {
    return (
      <div className="bg-muted/50 rounded-xl p-6 flex items-center justify-center border border-dashed border-border">
        <p className="text-base font-bold text-muted-foreground italic">데이터 정보 없음</p>
      </div>
    );
  }

  const history = entry.history ?? [];
  const oldest = history[history.length - 1];
  const diff = oldest ? entry.price - oldest.price : 0;
  const isDown = diff < 0;

  return (
    <div className="bg-muted/30 rounded-xl p-5 flex flex-col gap-3 border border-border">
      <div className="flex items-center justify-between">
        <span className="text-lg font-black text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-xl font-black text-foreground">{entry.price.toLocaleString()}원</span>
      </div>

      {history.length > 0 && (
        <>
          <div className="flex flex-col gap-2 bg-background/50 rounded-lg p-3">
            {history.map((h) => (
              <div key={h.collected_date} className="flex items-center justify-between">
                <span className="text-base font-medium text-muted-foreground">{h.label}</span>
                <span className="text-base font-bold text-muted-foreground">{h.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>

          {oldest && diff !== 0 && (
            <div className={cn(
              'flex items-center gap-2 text-base font-black pt-2 border-t border-border/60',
              isDown ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400',
            )}>
              {isDown ? <TrendingDown className="size-4" /> : <TrendingUp className="size-4" />}
              <span>2주 전 대비 {Math.abs(diff).toLocaleString()}원 {isDown ? '하락' : '상승'}</span>
            </div>
          )}
          {diff === 0 && oldest && (
            <div className="flex items-center gap-2 text-base font-black text-muted-foreground pt-2 border-t border-border/60">
              <Minus className="size-4" />
              <span>2주 전 가격과 동일</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── 섹션 3: 6개월 추이 차트 (토글 + 스마트 Y축) ─────────────────────────────

type TrendView = 'flight' | 'hotel';

function TrendSection({ isLoading, trend }: { isLoading: boolean; trend: FlightTrend | undefined }) {
  const [trendView, setTrendView] = useState<TrendView>('flight');

  const { chartData, domain, cheapestMonth } = useMemo(() => {
    if (!trend || trend.trend_data.length === 0) {
      return { chartData: [], domain: [0, 1] as [number, number], cheapestMonth: null };
    }
    const data = trend.trend_data.map((d) => ({
      month: dayjs(d.year_month + '-01').format('M월'),
      가격: trendView === 'flight' ? d.avg_flight_price : d.avg_hotel_price,
    }));
    const prices = data.map((d) => d.가격);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const pad = Math.max((max - min) * 0.3, 5000);
    const domainMin = Math.floor((min - pad) / 1000) * 1000;
    const domainMax = Math.ceil((max + pad) / 1000) * 1000;
    const cheap = trend.trend_data.reduce((a, b) => a.avg_flight_price < b.avg_flight_price ? a : b);
    return { chartData: data, domain: [domainMin, domainMax] as [number, number], cheapestMonth: cheap };
  }, [trend, trendView]);

  const lineColor = trendView === 'flight' ? '#3b82f6' : '#10b981';

  return (
    <section aria-label="6개월 가격 추이">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black text-foreground">6개월 가격 추이</h3>
        <div className="flex items-center gap-3">
          {cheapestMonth && trendView === 'flight' && (
            <div className="inline-flex items-center gap-1.5 bg-blue-500 text-white text-sm font-bold rounded-full px-3 py-1 shadow-sm">
              <span>최저 {dayjs(cheapestMonth.year_month + '-01').format('M월')}</span>
              <span>{cheapestMonth.avg_flight_price.toLocaleString()}원</span>
            </div>
          )}
          <div className="flex rounded-lg overflow-hidden border-2 border-border text-base font-bold">
            <button
              onClick={() => setTrendView('flight')}
              className={cn(
                'px-3.5 py-1.5 transition-colors flex items-center gap-1.5',
                trendView === 'flight' ? 'bg-blue-600 text-white' : 'bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              <Plane className="size-4" /> 항공권
            </button>
            <button
              onClick={() => setTrendView('hotel')}
              className={cn(
                'px-3.5 py-1.5 transition-colors flex items-center gap-1.5',
                trendView === 'hotel' ? 'bg-emerald-600 text-white' : 'bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              <Hotel className="size-4" /> 숙박비
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-56 rounded-xl" />
      ) : chartData.length === 0 ? (
        <EmptyState message="추이 데이터가 없습니다." />
      ) : (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                domain={domain}
                tickFormatter={(v) => `${Math.round(Number(v) / 10000)}만`}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip
                contentStyle={{ fontSize: 14, borderRadius: 12, fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none' }}
                formatter={(value) => [
                  typeof value === 'number' ? `${value.toLocaleString()}원` : String(value),
                  trendView === 'flight' ? '항공권' : '숙박비',
                ]}
              />
              <Line
                type="monotone"
                dataKey="가격"
                stroke={lineColor}
                strokeWidth={3}
                dot={{ r: 5, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

// ─── 공통: 빈 상태 ────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3 text-muted-foreground">
      <AlertCircle className="size-4 shrink-0" />
      <p className="text-base font-bold">{message}</p>
    </div>
  );
}
