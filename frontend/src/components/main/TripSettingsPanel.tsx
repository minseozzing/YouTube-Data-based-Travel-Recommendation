import { useState, useCallback, type ChangeEvent } from 'react';
import { SlidersHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUiStore } from '@/stores/uiStore';
import { useRecommend } from '@/hooks/city/useRecommend';
import { cn } from '@/lib/utils';

const RISK_LABELS: Record<number, string> = {
  1: '매우 낮음',
  2: '낮음',
  3: '보통',
  4: '높음',
  5: '매우 높음',
};

export function TripSettingsPanel() {
  const {
    globeBudgetFilter,
    globeRiskFilter,
    setGlobeBudgetFilter,
    setGlobeRiskFilter,
  } = useUiStore();

  const [duration, setDuration] = useState<number>(7);
  const [budgetInput, setBudgetInput] = useState<string>(
    String(globeBudgetFilter[1]),
  );

  const { mutate: recommend, isPending } = useRecommend();

  const handleBudgetChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setBudgetInput(raw);
      const num = parseInt(raw, 10);
      if (!isNaN(num)) {
        setGlobeBudgetFilter([globeBudgetFilter[0], num]);
      }
    },
    [globeBudgetFilter, setGlobeBudgetFilter],
  );

  const handleRiskChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setGlobeRiskFilter(parseInt(e.target.value, 10));
    },
    [setGlobeRiskFilter],
  );

  const handleDurationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        setDuration(val);
      }
    },
    [],
  );

  const handleUpdateRecommendations = useCallback(() => {
    const budget = parseInt(budgetInput, 10);
    if (!isNaN(budget) && duration > 0) {
      recommend({ budget, duration });
    }
  }, [budgetInput, duration, recommend]);

  return (
    <section
      className={cn(
        'bg-white/85 backdrop-blur-md rounded-2xl shadow-lg p-4',
        'flex flex-col gap-4',
      )}
      aria-label="여행 설정"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-blue-500" aria-hidden="true" />
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          여행 설정
        </h2>
      </div>

      {/* 예산 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="budget-input"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          1인당 예산
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            ₩
          </span>
          <Input
            id="budget-input"
            type="text"
            inputMode="numeric"
            value={budgetInput}
            onChange={handleBudgetChange}
            className="pl-7 text-sm bg-white/70 border-slate-200 focus-visible:ring-blue-300"
            placeholder="5,000,000"
          />
        </div>
      </div>

      {/* 여행 기간 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="duration-input"
          className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
        >
          여행 기간 (일)
        </label>
        <Input
          id="duration-input"
          type="number"
          min={1}
          max={365}
          value={duration}
          onChange={handleDurationChange}
          className="text-sm bg-white/70 border-slate-200 focus-visible:ring-blue-300"
          placeholder="7"
        />
      </div>

      {/* 위험도 슬라이더 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="risk-slider"
            className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
          >
            위험도 허용 수준
          </label>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {RISK_LABELS[globeRiskFilter] ?? '보통'}
          </span>
        </div>
        <input
          id="risk-slider"
          type="range"
          min={1}
          max={5}
          step={1}
          value={globeRiskFilter}
          onChange={handleRiskChange}
          className={cn(
            'w-full h-2 rounded-lg appearance-none cursor-pointer',
            'accent-blue-500',
          )}
          aria-label="위험도 허용 수준 슬라이더"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={globeRiskFilter}
          aria-valuetext={RISK_LABELS[globeRiskFilter]}
        />
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>안전</span>
          <span>모험적</span>
        </div>
      </div>

      {/* 추천 업데이트 버튼 */}
      <Button
        onClick={handleUpdateRecommendations}
        disabled={isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold"
        aria-label="추천 여행지 업데이트"
      >
        {isPending ? (
          <>
            <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
            업데이트 중...
          </>
        ) : (
          <>
            <RefreshCw className="size-4" aria-hidden="true" />
            추천 업데이트
          </>
        )}
      </Button>
    </section>
  );
}
