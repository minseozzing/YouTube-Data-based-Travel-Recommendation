import { create } from 'zustand';

type CityDetailTab = 'recommend' | 'cost' | 'flight' | 'news';

interface UiState {
  // 선택된 도시 (RightPanel + CityDetailModal 공유)
  selectedCityId: number | null;

  // 우측 요약 패널
  isRightPanelOpen: boolean;

  // 도시 상세 모달 (전체 화면)
  isCityModalOpen: boolean;
  activeCityTab: CityDetailTab;

  // 글로브 필터
  globeBudgetFilter: [number, number];
  globeRiskFilter: number;

  // 액션
  openRightPanel: (cityId: number) => void;
  closeRightPanel: () => void;
  openCityModal: (tab?: CityDetailTab) => void;
  closeCityModal: () => void;
  setActiveCityTab: (tab: CityDetailTab) => void;
  setGlobeBudgetFilter: (range: [number, number]) => void;
  setGlobeRiskFilter: (level: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedCityId: null,
  isRightPanelOpen: false,
  isCityModalOpen: false,
  activeCityTab: 'recommend',
  globeBudgetFilter: [0, 5_000_000],
  globeRiskFilter: 5,

  openRightPanel: (cityId) =>
    set({ selectedCityId: cityId, isRightPanelOpen: true, isCityModalOpen: false }),
  closeRightPanel: () =>
    set({ isRightPanelOpen: false }),
  openCityModal: (tab = 'recommend') =>
    set({ isCityModalOpen: true, activeCityTab: tab }),
  closeCityModal: () =>
    set({ isCityModalOpen: false, activeCityTab: 'recommend' }),
  setActiveCityTab: (tab) => set({ activeCityTab: tab }),
  setGlobeBudgetFilter: (range) => set({ globeBudgetFilter: range }),
  setGlobeRiskFilter: (level) => set({ globeRiskFilter: level }),
}));
