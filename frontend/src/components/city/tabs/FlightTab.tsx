import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Plane, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useMonthlyFlights } from '@/hooks/flight/useMonthlyFlights';
import dayjs from '@/utils/dayjs';
import type { CityDetail } from '@/schemas/city.schema';

interface FlightTabProps {
  city: CityDetail;
}

// Dummy flight data for list display
const DUMMY_FLIGHTS = [
  { airline: '대한항공', departure: '09:00', arrival: '19:30', duration: '10h 30m', price: 432000 },
  { airline: '아시아나', departure: '13:00', arrival: '23:30', duration: '10h 30m', price: 398000 },
  { airline: 'LCC', departure: '06:00', arrival: '16:00', duration: '10h 00m', price: 356000 },
];

// Dummy price trend data
const DUMMY_PRICE_DATA = [
  { date: '1일', price: 430000 },
  { date: '5일', price: 380000 },
  { date: '10일', price: 420000 },
  { date: '15일', price: 350000 },
  { date: '20일', price: 395000 },
  { date: '25일', price: 370000 },
  { date: '30일', price: 432000 },
];

// Generate month tabs once at module level (current ±2 months, 6 total)
function buildMonthTabs() {
  const now = dayjs();
  return Array.from({ length: 6 }, (_, i) => {
    const d = now.add(i - 2, 'month');
    return { year: d.year(), month: d.month() + 1, label: d.format('YYYY.MM') };
  });
}

const MONTH_TABS = buildMonthTabs();

export function FlightTab({ city }: FlightTabProps) {
  const initialYear = dayjs().year();
  const initialMonth = dayjs().month() + 1;
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);

  const { data: flightData, isLoading } = useMonthlyFlights(
    city.cityId,
    selectedYear,
    selectedMonth,
  );

  const handleMonthSelect = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  const isActiveMonth = (year: number, month: number) =>
    year === selectedYear && month === selectedMonth;

  // Use dummy data since monthly flight returns summary, not daily breakdown
  const chartData = DUMMY_PRICE_DATA;

  // Find min price for callout
  const minPrice = flightData?.minPrice
    ?? chartData.reduce((min, d) => (d.price < min ? d.price : min), chartData[0]?.price ?? 350000);

  return (
    <div className="flex flex-col gap-4 p-5">
      {/* Month selector tabs */}
      <div className="flex gap-1.5 flex-wrap" role="tablist" aria-label="월 선택">
        {MONTH_TABS.map((tab) => {
          const active = isActiveMonth(tab.year, tab.month);
          return (
            <button
              key={`${tab.year}-${tab.month}`}
              role="tab"
              aria-selected={active}
              onClick={() => handleMonthSelect(tab.year, tab.month)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
                active
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section header */}
      <div>
        <h3 className="text-base font-semibold text-foreground">Price Trends</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Estimated round-trip prices from Seoul
        </p>
      </div>

      {/* Price callout badge */}
      {!isLoading && (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-500 text-white text-xs font-semibold rounded-full px-3 py-1.5 shadow-md">
            <span>Cheapest Month</span>
            <span>{minPrice.toLocaleString()}원</span>
          </div>
        </div>
      )}

      {/* Price Trend Line Chart */}
      {isLoading ? (
        <Skeleton className="w-full h-44 rounded-xl" />
      ) : (
        <div className="bg-card border border-border rounded-xl p-3">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v) => `${Math.round(Number(v) / 10000)}만`}
              />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value) => [typeof value === 'number' ? `${value.toLocaleString()}원` : String(value), '가격']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3, fill: '#3b82f6' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Flight list (dummy) */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          최저가 추천 항공권 (지난 30일)
        </h4>
        <div className="flex flex-col gap-2">
          {DUMMY_FLIGHTS.map((flight, idx) => (
            <FlightListItem key={idx} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FlightItem {
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
}

function FlightListItem({ flight }: { flight: FlightItem }) {
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
          <Plane className="size-3.5 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{flight.airline}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-muted-foreground">{flight.departure}</span>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs text-muted-foreground">{flight.arrival}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-blue-600">{flight.price.toLocaleString()}원</p>
        <div className="flex items-center gap-1 justify-end mt-0.5">
          <Clock className="size-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{flight.duration}</span>
        </div>
      </div>
    </div>
  );
}
