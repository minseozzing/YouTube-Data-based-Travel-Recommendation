import { useState, useCallback, type ChangeEvent } from "react";
import { SlidersHorizontal, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/stores/uiStore";
import { useRecommend } from "@/hooks/city/useRecommend";
import { cn } from "@/lib/utils";

const RISK_LABELS: Record<number, string> = {
  1: "매우 낮음",
  2: "낮음",
  3: "보통",
  4: "높음",
  5: "매우 높음",
};

export function TripSettingsPanel() {
  const { setGlobeBudgetFilter, setGlobeRiskFilter, setGlobeDuration, setRecommendActive } =
    useUiStore();

  const [budgetInput, setBudgetInput] = useState<string>("10,000,000");
  const [durationInput, setDurationInput] = useState<string>("2");
  const [riskLevel, setRiskLevel] = useState<number>(5);

  const { mutate: recommend, isPending } = useRecommend();

  const handleReset = useCallback(() => {
    setBudgetInput("10,000,000");
    setDurationInput("2");
    setRiskLevel(5);
    setGlobeBudgetFilter([0, 5_000_000]);
    setGlobeRiskFilter(5);
    setGlobeDuration(2);
    setRecommendActive(false);
  }, [setGlobeBudgetFilter, setGlobeRiskFilter, setRecommendActive]);

  const handleBudgetChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setBudgetInput(formatted);
  }, []);

  const handleDurationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      setDurationInput(raw);
    },
    [],
  );

  const handleRiskChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRiskLevel(parseInt(e.target.value, 10));
  }, []);

  const handleUpdateRecommendations = useCallback(() => {
    const budget = parseInt(budgetInput.replace(/,/g, ""), 10);
    const duration = parseInt(durationInput, 10);
    if (!isNaN(budget) && budget > 0 && !isNaN(duration) && duration > 0) {
      setGlobeBudgetFilter([0, budget]);
      setGlobeRiskFilter(riskLevel);
      setGlobeDuration(duration);
      setRecommendActive(true);
      recommend({ budget, duration });
    }
  }, [
    budgetInput,
    durationInput,
    riskLevel,
    setGlobeBudgetFilter,
    setGlobeRiskFilter,
    setGlobeDuration,
    setRecommendActive,
    recommend,
  ]);

  return (
    <section
      className={cn(
        "bg-white/85 backdrop-blur-md rounded-2xl shadow-lg p-4",
        "flex flex-col gap-4",
      )}
      aria-label="여행 설정"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className="size-4 text-blue-500"
            aria-hidden="true"
          />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            여행 설정
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          초기화
        </button>
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
          type="text"
          inputMode="numeric"
          value={durationInput}
          onChange={handleDurationChange}
          className="text-sm bg-white/70 border-slate-200 focus-visible:ring-blue-300"
          placeholder="-"
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
            {RISK_LABELS[riskLevel] ?? "보통"}
          </span>
        </div>
        <input
          id="risk-slider"
          type="range"
          min={1}
          max={5}
          step={1}
          value={riskLevel}
          onChange={handleRiskChange}
          className={cn(
            "w-full h-2 rounded-lg appearance-none cursor-pointer",
            "accent-blue-500",
          )}
          aria-label="위험도 허용 수준 슬라이더"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={riskLevel}
          aria-valuetext={RISK_LABELS[riskLevel]}
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
        variant="primary"
        className="w-full"
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
