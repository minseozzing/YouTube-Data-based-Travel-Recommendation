import { create } from 'zustand';

type CityDetailTab = 'recommend' | 'cost' | 'flight' | 'news';

interface UiState {
  // 도시 상세 모달
  selectedCityId: number | null;
  isCityModalOpen: boolean;
  activeCityTab: CityDetailTab;

  // 글로브 필터
  globeBudgetFilter: [number, number];
  globeRiskFilter: number;

  // 액션
  openCityModal: (cityId: number, tab?: CityDetailTab) => void;
  closeCityModal: () => void;
  setActiveCityTab: (tab: CityDetailTab) => void;
  setGlobeBudgetFilter: (range: [number, number]) => void;
  setGlobeRiskFilter: (level: number) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedCityId: null,
  isCityModalOpen: false,
  activeCityTab: 'recommend',
  globeBudgetFilter: [0, 5_000_000],
  globeRiskFilter: 5,

  openCityModal: (cityId, tab = 'recommend') =>
    set({ selectedCityId: cityId, isCityModalOpen: true, activeCityTab: tab }),
  closeCityModal: () =>
    set({ selectedCityId: null, isCityModalOpen: false, activeCityTab: 'recommend' }),
  setActiveCityTab: (tab) => set({ activeCityTab: tab }),
  setGlobeBudgetFilter: (range) => set({ globeBudgetFilter: range }),
  setGlobeRiskFilter: (level) => set({ globeRiskFilter: level }),
}));
