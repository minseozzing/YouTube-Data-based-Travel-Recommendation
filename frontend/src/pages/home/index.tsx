import { useLayoutEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { motion } from "framer-motion";
import bgImage from "../../assets/Maldive_beach_1.jpg";
import { NavBar } from "./components/NavBar";
import { LeftSidebar } from "./components/LeftSidebar";
import { RightPanel } from "./components/RightPanel";

// NavBar:     top-3(12px) + h-12(48px) + gap-3(12px) = 72px
// LeftSidebar: left-3(12px) + w-[250px] + gap-3(12px) = 274px
const GLOBE_LEFT = 274;
const GLOBE_TOP = 72;
const GLOBE_RIGHT = 12; // gap-3
const GLOBE_BOTTOM = 12; // gap-3
const INFO_SPACE = 52; // GlobeInfoBar(~32px) + gap-4(16px) + buffer

// HomePage.tsx (INFO_SPACE 아래에 추가)
type CityPoint = {
  name: string;
  lat: number;
  lng: number;
  size?: number;
};

const CITY_POINTS: CityPoint[] = [
  { name: "도쿄", lat: 35.6762, lng: 139.6503, size: 0.25 },
  { name: "오사카", lat: 34.6937, lng: 135.5023, size: 0.22 },
  { name: "서울", lat: 37.5665, lng: 126.978, size: 0.26 },
  { name: "대구", lat: 35.8714, lng: 128.6014, size: 0.18 },
  { name: "광주", lat: 35.1595, lng: 126.8526, size: 0.18 },
  { name: "부산", lat: 35.1796, lng: 129.0756, size: 0.2 },
  { name: "제주도", lat: 33.4996, lng: 126.5312, size: 0.2 },
  { name: "독도", lat: 37.2411, lng: 131.8645, size: 0.16 },

  { name: "LA", lat: 34.0522, lng: -118.2437, size: 0.22 },

  { name: "다낭", lat: 16.0544, lng: 108.2022, size: 0.2 },
  { name: "상하이", lat: 31.2304, lng: 121.4737, size: 0.23 },
  { name: "홍콩", lat: 22.3193, lng: 114.1694, size: 0.22 },
  { name: "발리", lat: -8.3405, lng: 115.092, size: 0.22 },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [globeSize, setGlobeSize] = useState(500);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.max(
        Math.min(Math.round(width), Math.round(height) - INFO_SPACE),
        100,
      );
      setGlobeSize(s);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.main
      className="relative h-screen w-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      aria-label="GlobeTrekker 홈페이지"
    >
      {/* (1) 배경 이미지 레이어 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />

      {/* (2) 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* (3) 네비게이션 바 */}
      <NavBar />

      {/* (4) 왼쪽 사이드바 */}
      <LeftSidebar />

      {/* (5) 지구본 - navbar 하단·leftbar 우측 gap-3 기준으로 중앙 배치 */}
      <div
        ref={containerRef}
        className="absolute z-10 flex flex-col items-center justify-center gap-4"
        style={{
          left: GLOBE_LEFT,
          top: GLOBE_TOP,
          right: GLOBE_RIGHT,
          bottom: GLOBE_BOTTOM,
        }}
        aria-label="3D 지구본"
      >
        <div
          className="rounded-full overflow-hidden shadow-2xl"
          style={{ width: globeSize, height: globeSize }}
        >
          <Globe
            width={globeSize}
            height={globeSize}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)"
            // 도시 점 데이터 연결
            pointsData={CITY_POINTS}
            // lat/lng 매핑
            pointLat={(d) => (d as CityPoint).lat}
            pointLng={(d) => (d as CityPoint).lng}
            // 점 크기(기본값은 size 없으면 0.2)
            pointAltitude={0.006}
            // 점 색상
            pointColor={() => "yellow"}
            // 도시명 툴팁
            pointLabel={(d) => (d as CityPoint).name}
          />
        </div>
      </div>

      {/* (6) 오른쪽 상세 패널 토글 버튼 (패널이 닫혔을 때만 표시) */}
      {!isPanelOpen && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.25 }}
          onClick={() => setIsPanelOpen(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30
                     bg-white/85 backdrop-blur-md shadow-lg
                     px-3 py-2 rounded-xl text-xs font-semibold text-gray-700
                     hover:bg-white transition-colors border-none cursor-pointer"
          aria-label="여행지 상세 패널 열기"
        >
          상세 보기
        </motion.button>
      )}

      {/* (7) 오른쪽 상세 패널 */}
      <RightPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </motion.main>
  );
}
