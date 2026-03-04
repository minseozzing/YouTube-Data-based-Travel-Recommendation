import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";

type TabKey = "추천" | "항공권" | "물가" | "뉴스";

const TABS: TabKey[] = ["추천", "항공권", "물가", "뉴스"];

const EXPENSE_ITEMS = [
  {
    id: 1,
    label: "항공권",
    value: "$750",
    valueClass: "text-orange-500 font-bold",
    hasChevron: true,
  },
  {
    id: 2,
    label: "3-5성급 식당비",
    value: "$130 - $290",
    valueClass: "text-gray-700 font-semibold",
    hasChevron: false,
  },
  {
    id: 3,
    label: "일일 생활비",
    value: "🌍 $150",
    valueClass: "text-gray-700 font-semibold",
    hasChevron: false,
  },
] as const;

const IMAGE_CARDS = [
  { id: 1, title: "파리의 랜드마크", tag: "관광" },
  { id: 2, title: "발리, 인도네시아", tag: "휴양" },
] as const;

const TAGS = ["#골뱅크", "#이성", "#미니"] as const;

interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightPanel({ isOpen, onClose }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("추천");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="right-panel"
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute right-3 top-20 bottom-3 z-20 w-[350px]
                     rounded-2xl bg-white/95 backdrop-blur-md shadow-xl
                     flex flex-col overflow-hidden"
          aria-label="여행지 상세 정보"
        >
          {/* 스크롤 가능 영역 */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-4">
            {/* 헤더 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* 노란 원 */}
                <div
                  className="w-8 h-8 rounded-full bg-yellow-400 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-bold text-xl text-gray-900 leading-tight">
                    파리, 프랑스
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors
                           border-none bg-transparent cursor-pointer shrink-0"
                aria-label="패널 닫기"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* 태그 row */}
            <div className="flex items-center gap-2 flex-wrap">
              {TAGS.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-600 bg-gray-100 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 탭 */}
            <nav
              aria-label="상세 정보 탭"
              className="flex items-center gap-1 border-b border-gray-200"
            >
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 pb-2.5 pt-1 text-sm font-medium transition-colors border-none bg-transparent cursor-pointer
                              ${
                                activeTab === tab
                                  ? "text-blue-600 border-b-2 border-blue-600"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                  aria-selected={activeTab === tab}
                  role="tab"
                >
                  {tab}
                </button>
              ))}
            </nav>

            {/* 가격 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  $1,800 - $2,200
                </span>
                <span className="text-xs text-gray-400">€1 = 1.08달러</span>
              </div>
              <hr className="border-gray-200 mb-3" />

              {/* 세부 내역 */}
              <ul className="space-y-3" role="list" aria-label="여행 비용 내역">
                {EXPENSE_ITEMS.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm ${item.valueClass}`}>
                        {item.value}
                      </span>
                      {item.hasChevron && (
                        <ChevronRight
                          className="w-4 h-4 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 상세 선기 섹션 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900">상세 선기</h3>
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                  aria-label="상세 선기 더 보기"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* 이미지 카드 (가로 스크롤) */}
              <div
                className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
                role="list"
                aria-label="여행지 이미지"
              >
                {IMAGE_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="shrink-0 w-[140px] cursor-pointer"
                    role="listitem"
                  >
                    <div className="h-24 bg-gray-200 rounded-xl mb-2 flex items-center justify-center text-gray-400 text-xs">
                      이미지
                    </div>
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {card.title}
                    </p>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 mt-0.5 inline-block">
                      #{card.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 고정 버튼 */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
            <button
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                         text-white font-semibold text-sm py-3 rounded-xl
                         transition-colors border-none cursor-pointer"
              aria-label="파리 여행 상세 보기"
            >
              상세 보기
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
