import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Destination {
  id: number;
  city: string;
  country: string;
  matchPct: number;
  minBudget: number;
}

const DESTINATIONS: Destination[] = [
  { id: 1, city: "시드니", country: "호주", matchPct: 29, minBudget: 2100 },
  { id: 2, city: "리스본", country: "포르투갈", matchPct: 85, minBudget: 1850 },
  { id: 3, city: "발리", country: "인도네시아", matchPct: 79, minBudget: 1400 },
];

function getMatchColor(pct: number): string {
  if (pct >= 80) return "text-teal-600 bg-teal-50";
  if (pct >= 50) return "text-blue-600 bg-blue-50";
  return "text-orange-500 bg-orange-50";
}

interface DestinationCardProps {
  destination: Destination;
}

function DestinationCard({ destination }: DestinationCardProps) {
  const matchClass = getMatchColor(destination.matchPct);

  return (
    <article className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
      {/* 이미지 placeholder */}
      <div
        className="w-15 h-15 rounded-lg bg-gray-200 shrink-0 flex items-center justify-center text-gray-400 text-xs"
        aria-hidden="true"
      >
        {destination.city[0]}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-gray-900 truncate">
            {destination.city}
          </span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${matchClass}`}
          >
            {destination.matchPct}% 매칭
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{destination.country}</p>
        <p className="text-xs font-medium text-teal-600 mt-0.5">
          ${destination.minBudget.toLocaleString()} 이상 필요
        </p>
      </div>
    </article>
  );
}

export function LeftSidebar() {
  const [budget, setBudget] = useState<string>("2500");
  const [duration, setDuration] = useState<string>("14");

  return (
    <aside
      className="absolute left-3 top-18 bottom-3 z-20 w-[250px]
                 rounded-2xl bg-white/85 backdrop-blur-md shadow-lg
                 flex flex-col overflow-hidden"
      aria-label="여행 설정 및 추천 목적지"
    >
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* 여행 설정 섹션 */}
        <section aria-labelledby="travel-settings-title">
          <h2
            id="travel-settings-title"
            className="font-bold text-gray-900 text-base mb-3"
          >
            여행 설정
          </h2>

          <div className="space-y-3">
            {/* 1인당 예산 */}
            <div>
              <label
                htmlFor="budget-input"
                className="text-xs font-medium text-gray-600 block mb-1"
              >
                1인당 예산
              </label>
              <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 gap-1">
                <span className="text-sm text-gray-500 font-medium">$</span>
                <input
                  id="budget-input"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 font-semibold min-w-0"
                  min={0}
                  aria-label="1인당 예산 (달러)"
                />
              </div>
            </div>

            {/* 여행 기간 */}
            <div>
              <label
                htmlFor="duration-input"
                className="text-xs font-medium text-gray-600 block mb-1"
              >
                여행 기간 (일)
              </label>
              <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
                <input
                  id="duration-input"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 font-semibold min-w-0"
                  min={1}
                  aria-label="여행 기간 (일)"
                />
                <span className="text-xs text-gray-400 ml-1">일</span>
              </div>
            </div>

            {/* 추천 업데이트 버튼 */}
            <button
              className="w-full bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white
                         font-semibold text-sm py-2.5 rounded-xl transition-colors
                         border-none cursor-pointer"
              aria-label="추천 업데이트"
            >
              추천 업데이트
            </button>
          </div>
        </section>

        {/* 구분선 */}
        <hr className="border-gray-200" />

        {/* 최고의 매칭 여행지 섹션 */}
        <section aria-labelledby="best-match-title">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="best-match-title"
              className="font-bold text-gray-900 text-sm"
            >
              최고의 매칭 여행지
            </h2>
            <button
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
              aria-label="필터 열기"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="space-y-1">
            {DESTINATIONS.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
