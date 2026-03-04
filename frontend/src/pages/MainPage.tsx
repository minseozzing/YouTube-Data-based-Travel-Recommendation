import { useSearch } from '@tanstack/react-router';
import { CityDetailModal } from '@/components/city/CityDetailModal';
import { MainNavBar } from '@/components/main/MainNavBar';
import { LeftSidebar } from '@/components/main/LeftSidebar';
import { HeroTextBlock } from '@/components/main/HeroTextBlock';
import { StatBar } from '@/components/main/StatBar';
import { GlobeContainer } from '@/components/globe/GlobeContainer';
import maldivesBg from '@/assets/Maldive_beach_1.jpg';

const MainPage = () => {
  // Activates TanStack Router search param subscription for this route
  useSearch({ from: '/_authenticated/main' });

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      role="main"
      aria-label="다행 메인 페이지"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${maldivesBg})` }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

      {/* MainNavBar — absolute overlay */}
      <MainNavBar />

      {/* Left Sidebar — absolute overlay */}
      <LeftSidebar />

      {/* Globe Container — fills remaining space (right of sidebar, below navbar) */}
      {/* top-[72px] = navbar(48) + gap*2(24); left-[280px] = sidebar(256) + gap*2(24); right-3; bottom-3 */}
      <GlobeContainer className="absolute top-[72px] left-[280px] right-3 bottom-3" />

      {/* Hero Text — overlaid on globe area, pointer-events-none */}
      <HeroTextBlock />

      {/* Stat Bar — bottom center */}
      <StatBar />

      {/* City Detail Modal — global single instance, always mounted */}
      <CityDetailModal />
    </div>
  );
};

export default MainPage;
