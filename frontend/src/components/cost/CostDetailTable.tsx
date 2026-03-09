import { useState } from 'react';
import { Users, DollarSign, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CostDetail, LivingCost } from '@/schemas/cost.schema';

interface CostDetailTableProps {
  data: CostDetail | undefined;
  isLoading: boolean;
  seoulLivingCost?: LivingCost;
}

const EATING_OUT_LABELS: Record<string, string> = {
  lunch_menu: '점심 식사',
  dinner_in_a_resturant_for_2: '레스토랑 저녁 (2인)',
  fast_food_meal: '패스트푸드',
  beer_in_a_pub: '맥주 (펍)',
  cappuccino: '카푸치노',
  coke_pepsi: '콜라/펩시',
};

const TRANSPORT_LABELS: Record<string, string> = {
  local_transport_ticket: '편도 대중교통',
  monthly_ticket_local_transport: '대중교통 월정기권',
  taxi_ride: '택시 기본요금',
  gas_pterol: '휘발유 (1L)',
};

const GROCERIES_LABELS: Record<string, string> = {
  milk: '우유 (1L)', bread: '식빵', rice: '쌀 (1kg)', egg: '달걀 (12개)',
  chicken: '닭고기 (1kg)', steak: '소고기 (1kg)', apple: '사과 (1kg)',
  banana: '바나나 (1kg)', orange: '오렌지 (1kg)', tomato: '토마토 (1kg)',
  potato: '감자 (1kg)', onion: '양파 (1kg)', water: '생수 (1.5L)',
  coke: '콜라 (0.33L)', wine: '와인 (중급)', beer: '맥주 (0.5L)',
  cigarette: '담배 (1갑)', cold_medicine: '감기약', shampoo: '샴푸',
  toilet_paper: '화장지 (8롤)', toothpaste: '치약',
};

const OTHER_LABELS: Record<string, string> = {
  gym_month: '헬스장 (월)',
  cinema_ticket: '영화 티켓',
  haircut: '헤어컷',
  brand_jeans: '브랜드 청바지',
  brand_sneakers: '브랜드 운동화',
};

type CategoryKey = 'eating_out' | 'transportation' | 'groceries' | 'other';

const CATEGORIES: { key: CategoryKey; title: string; labels: Record<string, string> }[] = [
  { key: 'eating_out', title: '🍽 외식', labels: EATING_OUT_LABELS },
  { key: 'transportation', title: '🚌 교통', labels: TRANSPORT_LABELS },
  { key: 'groceries', title: '🛒 생필품', labels: GROCERIES_LABELS },
  { key: 'other', title: '🎬 기타', labels: OTHER_LABELS },
];

function calcDiff(cityVal: number, seoulVal: number): number {
  if (seoulVal === 0) return 0;
  return ((cityVal - seoulVal) / seoulVal) * 100;
}

interface CategorySectionProps {
  title: string;
  sectionKey: string;
  cityData: Record<string, number>;
  seoulData: Record<string, number> | undefined;
  labels: Record<string, string>;
  currency: string;
  cityName: string;
  isOpen: boolean;
  onToggle: (key: string) => void;
}

function CategorySection({
  title, sectionKey, cityData, seoulData, labels, currency, cityName, isOpen, onToggle,
}: CategorySectionProps) {
  // ── 해당 카테고리 내의 최대값 계산 (90% 스케일용) ──
  const categoryMax = (() => {
    const allValues = [
      ...Object.values(cityData),
      ...Object.values(seoulData ?? {}),
    ];
    return allValues.length > 0 ? Math.max(...allValues) : 1;
  })();

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'size-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4">
          {/* 항목별 상세 행: 2:2:4 비율 (명칭:가격:막대) */}
          <div className="flex flex-col divide-y divide-border/50">
            {Object.entries(cityData).map(([key, cityVal]) => {
              const seoulVal = seoulData?.[key];
              const diff = seoulVal !== undefined ? calcDiff(cityVal, seoulVal) : null;
              const isHigher = diff !== null && diff >= 0;

              return (
                <div key={key} className="grid grid-cols-8 gap-3 items-center py-3.5">
                  {/* 왼쪽 (2): 항목명 (왼쪽 정렬 + 더 넓은 왼쪽 여백) */}
                  <span className="col-span-2 text-sm text-muted-foreground truncate text-left pl-12">
                    {labels[key] ?? key}
                  </span>

                  {/* 중간 (2): 상세 가격 정보 (한 줄로 표시) */}
                  <div className="col-span-2 flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      {seoulVal !== undefined && (
                        <>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            서울 {seoulVal.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">→</span>
                        </>
                      )}
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">
                        {cityVal.toFixed(1)} {currency}
                      </span>
                    </div>
                    {diff !== null && (
                      <Badge
                        className={cn(
                          'px-1.5 py-0.5 h-4 text-[10px] font-bold border-none shrink-0',
                          isHigher
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-blue-500/10 text-blue-600',
                        )}
                      >
                        {isHigher ? '+' : ''}{diff.toFixed(1)}%
                      </Badge>
                    )}
                  </div>

                  {/* 오른쪽 (4): 인라인 병렬 막대 (오른쪽 여백 추가) */}
                  <div className="col-span-4 flex flex-col gap-1.5 justify-center pr-6">
                    {seoulVal !== undefined ? (
                      (() => {
                        const denom = categoryMax > 0 ? categoryMax : 1;
                        const seoulPct = (seoulVal / denom) * 90;
                        const cityPct = (cityVal / denom) * 90;
                        return (
                          <>
                            <div className="w-full h-[12px] rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-slate-400"
                                style={{ width: `${seoulPct}%` }}
                              />
                            </div>
                            <div className="w-full h-[12px] rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full',
                                  isHigher ? 'bg-red-400' : 'bg-blue-400',
                                )}
                                style={{ width: `${cityPct}%` }}
                              />
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <div className="h-[25px]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function CostDetailTable({ data, isLoading, seoulLivingCost }: CostDetailTableProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['eating_out']));
  const currency = data?.target.currency ?? 'USD';
  const cityName = data?.target.name ?? '도시';
  const lc = data?.living_cost;

  const handleToggle = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3.5 border-b border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {cityName} 전체 물가표
        </span>
        {lc && (
          <Badge className="text-xs bg-blue-500/10 text-blue-600 border-green-200 dark:border-green-800 px-2 py-0.5">
            <DollarSign className="size-3 mr-0.5" />
            하루 예산 {lc.daily_budget.toFixed(1)} {currency}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2 p-4">
          {CATEGORIES.map((c) => <Skeleton key={c.key} className="h-12 w-full" />)}
        </div>
      ) : lc ? (
        <>
          {CATEGORIES.map(({ key, title, labels }) => (
            <CategorySection
              key={key}
              title={title}
              sectionKey={key}
              cityData={lc[key] as Record<string, number>}
              seoulData={seoulLivingCost?.[key] as Record<string, number> | undefined}
              labels={labels}
              currency={currency}
              cityName={cityName}
              isOpen={openSections.has(key)}
              onToggle={handleToggle}
            />
          ))}

          <div className="grid grid-cols-2 gap-4 px-4 py-4 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <DollarSign className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">세후 평균 월급</p>
                <p className="text-sm font-semibold text-foreground">
                  {lc.monthly_salary_after_tax.toLocaleString()} {currency}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Users className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">인구</p>
                <p className="text-sm font-semibold text-foreground">
                  {(lc.population / 10000).toFixed(0)}만 명
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-base text-muted-foreground p-4">물가 데이터를 불러올 수 없습니다</p>
      )}
    </div>
  );
}
