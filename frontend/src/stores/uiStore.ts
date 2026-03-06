import { create } from "zustand";

type CityDetailTab = "recommend" | "cost" | "flight" | "news";

interface UiState {
  // 선택된 도시 (RightPanel + CityDetailModal 공유)
  selectedCityId: number | null;
  selectedCityImgUrl: string | null;
  selectedCityCoords: { lat: number; lng: number } | null;

  // 우측 요약 패널
  isRightPanelOpen: boolean;

  // 추천 상태
  isRecommendActive: boolean;

  // 도시 상세 모달 (전체 화면)
  isCityModalOpen: boolean;
  activeCityTab: CityDetailTab;

  // 글로브 필터
  globeBudgetFilter: [number, number];
  globeRiskFilter: number;
  globeDuration: number;

  // 액션
  openRightPanel: (
    cityId: number,
    imgUrl?: string,
    coords?: { lat: number; lng: number },
  ) => void;
  closeRightPanel: () => void;
  openCityModal: (tab?: CityDetailTab) => void;
  closeCityModal: () => void;
  setActiveCityTab: (tab: CityDetailTab) => void;
  setGlobeBudgetFilter: (range: [number, number]) => void;
  setGlobeRiskFilter: (level: number) => void;
  setGlobeDuration: (days: number) => void;
  setRecommendActive: (v: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedCityId: null,
  selectedCityImgUrl: null,
  selectedCityCoords: null,
  isRightPanelOpen: false,
  isCityModalOpen: false,
  activeCityTab: "recommend",
  globeBudgetFilter: [0, 5_000_000],
  globeRiskFilter: 5,

  openRightPanel: (cityId, imgUrl, coords) =>
    set({
      selectedCityId: cityId,
      selectedCityImgUrl: imgUrl ?? null,
      selectedCityCoords: coords ?? null,
      isRightPanelOpen: true,
      isCityModalOpen: false,
    }),
  closeRightPanel: () => set({ isRightPanelOpen: false }),
  openCityModal: (tab = "recommend") =>
    set({ isCityModalOpen: true, activeCityTab: tab }),
  closeCityModal: () =>
    set({ isCityModalOpen: false, activeCityTab: "recommend" }),
  setActiveCityTab: (tab) => set({ activeCityTab: tab }),
  globeDuration: 2,
  setGlobeBudgetFilter: (range) => set({ globeBudgetFilter: range }),
  setGlobeRiskFilter: (level) => set({ globeRiskFilter: level }),
  setGlobeDuration: (days) => set({ globeDuration: days }),
  isRecommendActive: false,
  setRecommendActive: (v) => set({ isRecommendActive: v }),
}));
