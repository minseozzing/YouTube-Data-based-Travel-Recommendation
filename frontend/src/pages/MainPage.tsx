import { useSearch } from "@tanstack/react-router";
import { CityDetailModal } from "@/components/city/CityDetailModal";
import { MainNavBar } from "@/components/main/MainNavBar";
import { LeftSidebar } from "@/components/main/LeftSidebar";
import { HeroTextBlock } from "@/components/main/HeroTextBlock";
import { StatBar } from "@/components/main/StatBar";
import { GlobeContainer } from "@/components/globe/GlobeContainer";
import { RightPanel } from "@/components/main/RightPanel";
import maldivesBg from "@/assets/Maldive_beach_1.jpg";
import { useUiStore } from "@/stores/uiStore";
const MainPage = () => {
  // Activates TanStack Router search param subscription for this route
  useSearch({ from: "/_authenticated/main" });
  const isRightPanelOpen = useUiStore((s) => s.isRightPanelOpen);
  const selectedCityImgUrl = useUiStore((s) => s.selectedCityImgUrl);
  const bgImage = selectedCityImgUrl ?? maldivesBg;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      role="main"
      aria-label="다행 메인 페이지"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* MainNavBar — absolute overlay */}
      <MainNavBar />

      {/* Left Sidebar — absolute overlay */}
      <LeftSidebar />

      {/*
        Globe 영역은 기본적으로 right-3(12px)까지 사용합니다.
        오른쪽 패널이 열리면 패널 폭(300px) + 패널과의 간격(12px) + 여유 간격(12px)만큼 오른쪽 공간을 비워
        지구가 좌측 사이드바와 우측 패널 사이의 가운데 영역으로 오도록 합니다.
      */}
      <GlobeContainer
        className={[
          "absolute top-[72px] left-[280px] bottom-3",
          "transition-all duration-300 ease-in-out",
          isRightPanelOpen ? "right-[324px]" : "right-3",
        ].join(" ")}
      />

      {/* Hero Text — overlaid on globe area, pointer-events-none */}
      <HeroTextBlock />

      {/* Stat Bar — bottom center */}
      <StatBar />

      {/* Right Summary Panel — 마커/카드 클릭 시 슬라이드 인 */}
      <RightPanel />

      {/* City Detail Modal — 전체 화면, 상세 보기 버튼으로 진입 */}
      <CityDetailModal />
    </div>
  );
};

export default MainPage;
