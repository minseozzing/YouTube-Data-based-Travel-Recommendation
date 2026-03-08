import {
  Sparkles,
  Wallet,
  Plane,
  TrendingUp,
  Newspaper,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CityDetail } from "@/schemas/city.schema";

interface RecommendTabProps {
  city: CityDetail;
  onTabChange: (tab: "recommend" | "cost" | "flight" | "news") => void;
}

// ── 비용 항목 바 ──────────────────────────────────────────────
interface CostBarProps {
  label: string;
  amount: string;
  pct: number;
  color: string;
}

function CostBar({ label, amount, pct, color }: CostBarProps) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{amount}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── 정보 카드 (항공, 물가 이동) ──────────────────────────────
interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}

function InfoCard({ icon: Icon, label, value, onClick }: InfoCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 p-4 rounded-xl border border-slate-200 flex items-center gap-3",
        "hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-left",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
      )}
    >
      <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-blue-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-bold text-slate-900 truncate">{value}</p>
      </div>
    </button>
  );
}

// ── RecommendTab ─────────────────────────────────────────────
export function RecommendTab({ city, onTabChange }: RecommendTabProps) {
  const recommendText =
    city.recommendReason ?? "AI가 분석한 추천 이유를 불러오는 중입니다.";

  // 비용 분해 (숙박 45 / 식비 35 / 교통·활동 20)
  const daily = city.dailyCost;
  const accom = daily ? Math.round(daily * 0.45) : undefined;
  const food = daily ? Math.round(daily * 0.35) : undefined;
  const act = daily ? Math.round(daily * 0.2) : undefined;

  const flightText = city.flightPrice
    ? `₩${city.flightPrice.toLocaleString()}~`
    : "조회하기";

  const costText = daily ? `일평균 ₩${daily.toLocaleString()}` : "비교 보기";

  return (
    <div className="flex flex-col gap-8 p-5 overflow-y-auto">
      {/* ① 도시를 추천하는 이유 */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sparkles className="size-5 text-blue-500" aria-hidden="true" />
          {city.cityName} 추천 이유
        </h2>
        <p className="text-slate-600 leading-relaxed text-base">
          {recommendText}
        </p>

        {/* 키워드 뱃지 */}
        {city.keywords && city.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {city.keywords.map((kw) => (
              <Badge
                key={kw}
                variant="outline"
                className="text-xs text-blue-600 border-blue-200 bg-blue-50 rounded-full px-3 py-1 font-medium"
              >
                #{kw}
              </Badge>
            ))}
          </div>
        )}
      </section>

      <hr className="border-slate-200" />

      {/* ② 예산 계획 */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Wallet className="size-5 text-blue-500" aria-hidden="true" />
          예산 계획
        </h3>

        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            일평균 예상 비용
          </p>

          {daily ? (
            <>
              <div className="flex items-end gap-2 mb-5">
                <span className="text-4xl font-bold text-slate-900">
                  ₩{daily.toLocaleString()}
                </span>
                <span className="text-slate-500 mb-0.5 text-sm">/ 일</span>
              </div>

              <div className="flex flex-col gap-4">
                <CostBar
                  label="숙박"
                  amount={`₩${accom?.toLocaleString()}`}
                  pct={45}
                  color="bg-blue-500"
                />
                <CostBar
                  label="식비"
                  amount={`₩${food?.toLocaleString()}`}
                  pct={35}
                  color="bg-emerald-500"
                />
                <CostBar
                  label="교통 & 활동"
                  amount={`₩${act?.toLocaleString()}`}
                  pct={20}
                  color="bg-amber-500"
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400">
              비용 데이터를 불러오는 중입니다.
            </p>
          )}
        </div>

        {/* 항공 / 물가 카드 */}
        <div className="mt-4 flex gap-3">
          <InfoCard
            icon={Plane}
            label="최저 항공권"
            value={flightText}
            onClick={() => onTabChange("flight")}
          />
          <InfoCard
            icon={TrendingUp}
            label="생활물가 비교"
            value={costText}
            onClick={() => onTabChange("cost")}
          />
        </div>
      </section>

      <hr className="border-slate-200" />

      {/* ③ 현지 뉴스 */}
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Newspaper className="size-5 text-blue-500" aria-hidden="true" />
          현지 뉴스
        </h3>

        <button
          onClick={() => onTabChange("news")}
          className={cn(
            "w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200",
            "hover:border-blue-300 hover:bg-blue-50/40 transition-colors text-left",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
          )}
        >
          <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Newspaper className="size-4 text-blue-500" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              최신 현지 소식 보기
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {city.cityName}의 최신 뉴스와 여행 정보
            </p>
          </div>
          <ChevronRight className="size-4 text-slate-400 ml-auto shrink-0" />
        </button>
      </section>
    </div>
  );
}
