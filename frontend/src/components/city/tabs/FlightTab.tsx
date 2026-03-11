import { useState, useMemo, useRef, useCallback } from 'react';
import type React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LiquidGlass from 'liquid-glass-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Plane, Clock, Hotel, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';
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
  const [activeDay, setActiveDay] = useState<SelectedDay | null>(null);
  const cityId = city.cityId;

  // LiquidGlass mouseContainer 기준 (오른쪽 컬럼 전체)
  const rightColRef = useRef<HTMLDivElement>(null);


  // 디바운스: 셀 이동 시 패널이 즉시 사라지지 않도록
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSetActiveDay = useCallback((day: SelectedDay | null) => {
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    if (day !== null) {
      setActiveDay(day);
    } else {
      clearTimerRef.current = setTimeout(() => setActiveDay(null), 180);
    }
  }, []);

  const { data: summary, isLoading: summaryLoading } = useCitySummary(cityId, selectedYearMonth);
  const { data: calendar, isLoading: calendarLoading } = useFlightCalendar(cityId, selectedYearMonth);
  const { data: trend, isLoading: trendLoading } = useFlightTrend(cityId);

  const selectedMonth = dayjs(selectedYearMonth + '-01').month() + 1;
  const isPeakSeason = summary?.peak_season_months.includes(selectedMonth) ?? false;
  const isOffSeason = summary?.off_season_months.includes(selectedMonth) ?? false;

  return (
    <div className="flex flex-col gap-6 p-6 h-full overflow-y-auto relative">
      {/* 월 선택 탭 */}
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
              onClick={() => { setSelectedYearMonth(tab.yearMonth); setActiveDay(null); }}
              className={cn(
                'px-4 py-2 rounded-xl text-lg font-bold transition-colors relative',
                active
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              {tab.label}
              {peak && <span className="absolute -top-1 -right-1 size-2.5 bg-red-400 rounded-full border-2 border-background" />}
              {off && <span className="absolute -top-1 -right-1 size-2.5 bg-blue-400 rounded-full border-2 border-background" />}
            </button>
          );
        })}
      </div>

      <SummarySection isLoading={summaryLoading} summary={summary} />

      {/* 좌: 달력  /  우: 6개월 추이 + 호버 히스토리 오버레이 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        <div className="flex flex-col gap-4">
          <FlightCalendarGrid
            isLoading={calendarLoading}
            calendar={calendar}
            yearMonth={selectedYearMonth}
            isPeakSeason={isPeakSeason}
            isOffSeason={isOffSeason}
            activeDay={activeDay}
            onHoverDay={debouncedSetActiveDay}
          />
        </div>

        <div
          ref={rightColRef}
          className="flex flex-col gap-4"
          onMouseEnter={() => {
            if (clearTimerRef.current) {
              clearTimeout(clearTimerRef.current);
              clearTimerRef.current = null;
            }
          }}
        >
          {/* 6개월 추이 차트 vs 날짜 히스토리 스왑 레이아웃 */}
          <div className="flex-1 relative overflow-hidden rounded-xl border border-border/50 bg-card/50 min-h-[380px] flex flex-col">
            <AnimatePresence mode="wait">
              {activeDay ? (
                <motion.div
                  key="history-overlay"
                  className="flex-1 flex flex-col items-center justify-center p-0 bg-slate-500/5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <DateHistoryPanel
                    selectedDay={activeDay}
                    yearMonth={selectedYearMonth}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="trend-section"
                  className="flex-1 p-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendSection isLoading={trendLoading} trend={trend} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 섹션 1: 도시 요약 ───────────────────────────────────────────────────────

function SummarySection({ isLoading, summary }: { isLoading: boolean; summary: CitySummary | undefined }) {
  if (isLoading) return <Skeleton className="w-full h-24 rounded-xl" />;
  if (!summary) return <EmptyState message="요약 정보를 불러올 수 없습니다." />;

  return (
    <section aria-label="도시 요약 정보">
      <div className="bg-card border border-border rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Plane className="size-5 text-blue-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">항공권</span>
            <span className="text-base font-black text-foreground">{summary.avg_flight_price.toLocaleString()}원</span>
          </div>
        </div>
        <div className="w-px h-8 bg-border mx-2" />
        <div className="flex items-center gap-3 flex-1 justify-center">
          <Hotel className="size-5 text-emerald-500 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">숙박비</span>
            <span className="text-base font-black text-foreground">{summary.avg_hotel_price.toLocaleString()}원</span>
          </div>
        </div>
        <div className="w-px h-8 bg-border mx-2" />
        <div className="flex items-center gap-3 flex-1 justify-center text-center">
          <Plane className="size-5 text-slate-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">경유</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-300">{summary.typical_stops_text}</span>
          </div>
        </div>
        <div className="w-px h-8 bg-border mx-2" />
        <div className="flex items-center gap-3 flex-1 justify-center text-center">
          <Clock className="size-5 text-slate-400 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">비행</span>
            <span className="text-base font-black text-slate-700 dark:text-slate-300">{summary.avg_duration_text}</span>
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
  activeDay,
  onHoverDay,
}: {
  isLoading: boolean;
  calendar: FlightCalendar | undefined;
  yearMonth: string;
  isPeakSeason: boolean;
  isOffSeason: boolean;
  activeDay: SelectedDay | null;
  onHoverDay: (day: SelectedDay | null) => void;
}) {
  const [priceView, setPriceView] = useState<PriceView>('outbound');

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

  const handleDayHover = (day: number | null) => {
    if (day === null) {
      onHoverDay(null);
      return;
    }
    const out = outboundMap.get(day);
    const inn = inboundMap.get(day);
    if (!out && !inn) return;
    onHoverDay({ day, outbound: out, inbound: inn });
  };

  if (isLoading) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <section aria-label="일별 항공권 가격" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black text-foreground">
            {dayjs(yearMonth + '-01').format('YYYY년 M월')}
          </h3>
          {isPeakSeason && <Badge className="text-[10px] px-1.5 py-0 h-5 bg-red-100 text-red-600 border-0 font-bold">성수기</Badge>}
          {isOffSeason && <Badge className="text-[10px] px-1.5 py-0 h-5 bg-blue-100 text-blue-600 border-0 font-bold">비성수기</Badge>}
        </div>
        <div className="flex rounded-lg overflow-hidden border border-border text-xs font-bold">
          {(['outbound', 'inbound', 'total'] as PriceView[]).map((v) => (
            <button
              key={v}
              onClick={() => { setPriceView(v); onHoverDay(null); }}
              className={cn(
                'px-2.5 py-1 transition-colors',
                priceView === v ? 'bg-slate-800 text-white' : 'bg-card text-muted-foreground hover:bg-muted',
              )}
            >
              {PRICE_VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm flex-1">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/10">
          {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
            <div key={d} className={cn(
              'py-1.5 text-center text-xs font-black',
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-600',
            )}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 셀 — onMouseLeave는 그리드 컨테이너에만 걸어 셀 이동 시 깜빡임 방지 */}
        <div
          className="grid grid-cols-7"
          onMouseLeave={() => handleDayHover(null)}
        >
          {cells.map((day, idx) => {
            if (day === null) return <div key={`e-${idx}`} className="py-2" />;

            const out = outboundMap.get(day);
            const inn = inboundMap.get(day);
            let price: number | undefined;
            if (priceView === 'outbound') price = out?.price;
            else if (priceView === 'inbound') price = inn?.price;
            else if (out && inn) price = out.price + inn.price;

            const isCheapest = day === cheapestDate && price !== undefined;
            const isToday = day === today;
            const isSelected = activeDay?.day === day;
            const hasPrice = price !== undefined;
            const dow = idx % 7;

            return (
              <button
                key={day}
                onMouseEnter={() => handleDayHover(day)}
                disabled={!hasPrice}
                className={cn(
                  'flex flex-col items-center justify-center py-1.5 gap-0.5 min-h-[56px] border-r border-b border-border/40 last:border-r-0 transition-colors',
                  hasPrice && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  !hasPrice && 'cursor-default opacity-40',
                  isSelected && 'bg-slate-100 dark:bg-slate-800',
                  !isSelected && isCheapest && 'bg-orange-50 dark:bg-orange-950/30',
                )}
              >
                <span className={cn(
                  'text-base font-black w-7 h-7 flex items-center justify-center rounded-full transition-all',
                  isToday && 'bg-blue-600 text-white shadow-sm',
                  isSelected && !isToday && 'ring-2 ring-slate-400',
                  !isToday && isCheapest && 'text-orange-600',
                  !isToday && !isCheapest && (dow === 0 ? 'text-red-500' : dow === 6 ? 'text-blue-500' : 'text-foreground'),
                )}>
                  {day}
                </span>
                {price !== undefined ? (
                  <span className={cn(
                    'text-[10px] leading-none font-black',
                    isCheapest ? 'text-orange-600 underline underline-offset-1' : 'text-muted-foreground',
                  )}>
                    {formatWan(price)}
                  </span>
                ) : (
                  <span className="text-[10px] leading-none text-transparent select-none">-</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-3 px-3 py-2 border-t border-border bg-muted/5">
          <div className="flex items-center gap-1">
            <div className="size-2.5 rounded bg-orange-100 border border-orange-300" />
            <span className="text-[10px] font-bold text-muted-foreground">최저가</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2.5 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold text-muted-foreground">오늘</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 날짜 히스토리 패널 ───────────────────────────────────────────────────────

function DateHistoryPanel({
  selectedDay,
  yearMonth,
}: {
  selectedDay: SelectedDay;
  yearMonth: string;
}) {
  return (
    <div className="flex flex-col justify-center gap-4 p-4 w-[380px] max-w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay.day}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
        >
          {/* 헤더 */}
          <div className="border-b border-border pb-3">
            <p className="text-2xl font-black text-foreground tracking-tight">
              {dayjs(`${yearMonth}-${String(selectedDay.day).padStart(2, '0')}`).format('M월 D일 (ddd)')}
            </p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">수집 시점별 항공권 가격 변화</p>
          </div>

          {/* 가는편 / 오는편 */}
          <div className="grid grid-cols-2 gap-3">
            <HistoryCard label="가는편" entry={selectedDay.outbound} />
            <HistoryCard label="오는편" entry={selectedDay.inbound} />
          </div>

          {/* 왕복 합계 */}
          {selectedDay.outbound && selectedDay.inbound && (
            <div className="flex items-center justify-between rounded-xl px-5 py-3.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm">
              <span className="text-sm font-bold opacity-80">왕복 합계</span>
              <span className="text-2xl font-black">
                {(selectedDay.outbound.price + selectedDay.inbound.price).toLocaleString()}원
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HistoryCard({ label, entry }: { label: string; entry: DailyPriceEntry | undefined }) {
  if (!entry) {
    return (
      <div className="rounded-xl p-3 text-[10px] text-muted-foreground text-center border border-dashed border-border bg-muted/20">
        데이터 없음
      </div>
    );
  }

  const history = entry.history ?? [];
  const oldest = history[history.length - 1];
  const diff = oldest ? entry.price - oldest.price : 0;
  const isDown = diff < 0;
  const isUp = diff > 0;

  return (
    <div className="rounded-xl p-3.5 flex flex-col gap-2.5 border border-border bg-card shadow-sm">
      {/* 라벨 + 현재가 */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-xl font-black text-foreground">{entry.price.toLocaleString()}원</span>
      </div>

      {/* 히스토리 행 */}
      {history.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg p-2.5 bg-muted/40">
          {history.map((h, idx) => (
            <div key={h.collected_date} className="flex items-center justify-between text-xs">
              <span className={cn('font-medium', idx === 0 ? 'text-foreground' : 'text-muted-foreground/80')}>{h.label}</span>
              <span className={cn('font-bold', idx === 0 ? 'text-foreground' : 'text-muted-foreground/80')}>{h.price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      )}

      {/* 2주 전 대비 변동 */}
      {oldest && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-bold pt-2 border-t border-border',
          isDown && 'text-emerald-600',
          isUp && 'text-rose-600',
          !isDown && !isUp && 'text-muted-foreground',
        )}>
          {isDown && <TrendingDown className="size-3.5 shrink-0" />}
          {isUp && <TrendingUp className="size-3.5 shrink-0" />}
          {!isDown && !isUp && <Minus className="size-3.5 shrink-0" />}
          <span className="truncate">
            {isDown && `저렴`}
            {isUp && `상승`}
            {!isDown && !isUp && '동일'}
          </span>
        </div>
      )}
    </div>
  );
}

// ─── 섹션 3: 6개월 추이 차트 ────────────────────────────────────────────────

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

  if (isLoading) return <Skeleton className="w-full h-80 rounded-xl" />;

  return (
    <section aria-label="6개월 가격 추이" className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-black text-foreground">6개월 가격 추이</h3>
        <div className="flex gap-1 bg-muted p-0.5 rounded-lg text-[10px]">
          <button
            onClick={() => setTrendView('flight')}
            className={cn('px-2 py-1 rounded-md transition-all', trendView === 'flight' ? 'bg-white shadow-sm font-bold' : 'text-muted-foreground')}
          >
            항공권
          </button>
          <button
            onClick={() => setTrendView('hotel')}
            className={cn('px-2 py-1 rounded-md transition-all', trendView === 'hotel' ? 'bg-white shadow-sm font-bold' : 'text-muted-foreground')}
          >
            숙박비
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex-1 flex flex-col justify-center">
        {cheapestMonth && trendView === 'flight' && (
          <div className="mb-3 text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full self-start">
            최저: {dayjs(cheapestMonth.year_month + '-01').format('M월')} ({cheapestMonth.avg_flight_price.toLocaleString()}원)
          </div>
        )}
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                domain={domain}
                tickFormatter={(v) => `${Math.round(Number(v) / 10000)}만`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`${Number(v).toLocaleString()}원`, trendView === 'flight' ? '항공권' : '숙박비']}
              />
              <Line type="monotone" dataKey="가격" stroke={lineColor} strokeWidth={3} dot={{ r: 4, fill: lineColor, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
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
