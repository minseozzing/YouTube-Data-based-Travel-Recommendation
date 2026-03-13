import { AnimatePresence, motion } from "framer-motion";
import { X, Plane, Wallet, Shield, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUiStore } from "@/stores/uiStore";
import { useCityDetail } from "@/hooks/city/useCityDetail";
import { DUMMY_CITY_DETAILS } from "@/data/dummyCityData";

function getMatchColor(score: number | undefined) {
  if (score === undefined) return "bg-slate-100 text-slate-600";
  if (score >= 80) return "bg-emerald-500 text-white";
  if (score >= 50) return "bg-blue-500 text-white";
  return "bg-amber-500 text-white";
}

export function RightPanel() {
  const {
    selectedCityId,
    selectedCityImgUrl,
    isRightPanelOpen,
    isRecommendActive,
    closeRightPanel,
    openCityModal,
  } = useUiStore();

  const {
    data: cityFromApi,
    isLoading,
    isError,
  } = useCityDetail(selectedCityId, isRecommendActive);

  const city =
    cityFromApi ??
    (isError && selectedCityId
      ? (DUMMY_CITY_DETAILS[selectedCityId] ?? null)
      : null);

  const handleOpenDetail = () => {
    openCityModal("recommend");
  };

  return (
    <AnimatePresence>
      {isRightPanelOpen && (
        <motion.aside
          key="right-panel"
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute right-3 top-[72px] bottom-3 z-20 w-[300px]
                     rounded-2xl bg-white/90 backdrop-blur-md shadow-xl
                     flex flex-col overflow-hidden"
          aria-label="도시 요약 패널"
        >
          {/* ── 헤더 영역 ── */}
          <div className="relative h-36 shrink-0 overflow-hidden rounded-t-2xl bg-slate-200">
            {(city?.imgUrl || selectedCityImgUrl) && (
              <img
                src={city?.imgUrl || selectedCityImgUrl!}
                alt={city?.cityName}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* 닫기 버튼 */}
            <button
              onClick={closeRightPanel}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label="패널 닫기"
            >
              <X className="size-3.5" />
            </button>

            {/* 도시명 */}
            <div className="absolute bottom-3 left-4 right-10">
              {isLoading ? (
                <Skeleton className="h-6 w-32 bg-white/30" />
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white leading-tight truncate">
                    {city?.cityName ?? "도시 정보"}
                  </h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3 text-white/70" />
                    <span className="text-xs text-white/80">
                      {city?.countryName ?? "나라 정보"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* 매칭 점수 배지 */}
            {!isLoading && city?.matchingScore !== undefined && (
              <Badge
                className={`absolute top-2.5 left-3 text-xs font-bold border-none ${getMatchColor(city.matchingScore)}`}
              >
                {city.matchingScore}% 매칭
              </Badge>
            )}
          </div>

          {/* ── 스크롤 콘텐츠 영역 ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
            {/* 키워드 태그 */}
            {isLoading ? (
              <div className="flex gap-1.5 flex-wrap">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-5 w-14 rounded-full" />
                ))}
              </div>
            ) : city?.keywords && city.keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {city.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5 font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            ) : null}

            {/* 핵심 지표 3개 */}
            <div className="grid grid-cols-3 gap-2">
              {/* 예상 예산 */}
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-blue-50">
                <Wallet className="size-4 text-blue-500" />
                <span className="text-[10px] text-slate-500 text-center">
                  일 예산
                </span>
                {isLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-xs font-bold text-slate-800 text-center">
                    {(() => {
                      const cost = city?.livingCostFor1Day
                        ? city.livingCostFor1Day.accommodation +
                          city.livingCostFor1Day.food +
                          city.livingCostFor1Day.transportation
                        : city?.dailyCost;
                      return cost ? `₩${(cost / 10000).toFixed(0)}만` : "-";
                    })()}
                  </span>
                )}
              </div>

              {/* 항공권 */}
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-amber-50">
                <Plane className="size-4 text-amber-500" />
                <span className="text-[10px] text-slate-500 text-center">
                  왕복 항공
                </span>
                {isLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-xs font-bold text-slate-800 text-center">
                    {(() => {
                      const price = city?.airTicket
                        ? city.airTicket.departAirTicket +
                          city.airTicket.arriveAirTicket
                        : city?.flightPrice;
                      return price ? `₩${(price / 10000).toFixed(0)}만~` : "-";
                    })()}
                  </span>
                )}
              </div>

              {/* 안전 */}
              <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-emerald-50">
                <Shield className="size-4 text-emerald-500" />
                <span className="text-[10px] text-slate-500 text-center">
                  안전도
                </span>
                {isLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                    안전
                  </span>
                )}
              </div>
            </div>

            {/* 추천 이유 미리보기 */}
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-semibold text-slate-700 mb-1.5">
                AI 추천 이유
              </p>
              {isLoading ? (
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ) : (
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {city?.recommendReason ??
                    "AI가 분석한 추천 이유를 불러오는 중입니다."}
                </p>
              )}
            </div>
          </div>

          {/* ── 하단 고정 버튼 ── */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white/80 shrink-0">
            <Button
              onClick={handleOpenDetail}
              variant="dark"
              className="w-full gap-2"
              size="lg"
              disabled={!city}
            >
              상세 보기
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
