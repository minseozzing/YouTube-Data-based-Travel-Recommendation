import { TripSettingsPanel } from './TripSettingsPanel';
import { TopMatchingList } from './TopMatchingList';

// top-[72px] = NavBar(48px) + gap(12px) + top-offset(12px)
// left-3 = 12px from left
// bottom-3 = 12px from bottom
// w-64 = 256px

export function LeftSidebar() {
  return (
    <aside
      className="absolute z-20 flex flex-col gap-3 top-[72px] left-3 bottom-3 w-64"
      aria-label="여행 설정 사이드바"
    >
      <TripSettingsPanel />
      <TopMatchingList />
    </aside>
  );
}
