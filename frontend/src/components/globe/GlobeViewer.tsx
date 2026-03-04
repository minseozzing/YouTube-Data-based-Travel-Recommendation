import { useRef, useCallback, useMemo } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { useUiStore } from '@/stores/uiStore';
import { useCityList } from '@/hooks/city/useCityList';
import type { CityListItem } from '@/schemas/city.schema';

const DUMMY_CITIES: CityListItem[] = [
  { cityId: 1,  cityName: '도쿄',      countryName: '일본',     imgUrl: 'https://picsum.photos/seed/tokyo/800/600',     estimatedBudget: 1500000, riskLevel: 1, latitude: 35.6762,  longitude: 139.6503, matchingScore: 92 },
  { cityId: 2,  cityName: '파리',      countryName: '프랑스',   imgUrl: 'https://picsum.photos/seed/paris/800/600',     estimatedBudget: 2200000, riskLevel: 2, latitude: 48.8566,  longitude: 2.3522,   matchingScore: 85 },
  { cityId: 3,  cityName: '뉴욕',      countryName: '미국',     imgUrl: 'https://picsum.photos/seed/newyork/800/600',   estimatedBudget: 3000000, riskLevel: 2, latitude: 40.7128,  longitude: -74.0060, matchingScore: 78 },
  { cityId: 4,  cityName: '시드니',    countryName: '호주',     imgUrl: 'https://picsum.photos/seed/sydney/800/600',    estimatedBudget: 2500000, riskLevel: 1, latitude: -33.8688, longitude: 151.2093, matchingScore: 70 },
  { cityId: 5,  cityName: '방콕',      countryName: '태국',     imgUrl: 'https://picsum.photos/seed/bangkok/800/600',   estimatedBudget: 900000,  riskLevel: 2, latitude: 13.7563,  longitude: 100.5018, matchingScore: 88 },
  { cityId: 6,  cityName: '두바이',    countryName: 'UAE',      imgUrl: 'https://picsum.photos/seed/dubai/800/600',     estimatedBudget: 2800000, riskLevel: 1, latitude: 25.2048,  longitude: 55.2708,  matchingScore: 65 },
  { cityId: 7,  cityName: '바르셀로나',countryName: '스페인',   imgUrl: 'https://picsum.photos/seed/barcelona/800/600', estimatedBudget: 1800000, riskLevel: 2, latitude: 41.3851,  longitude: 2.1734,   matchingScore: 82 },
  { cityId: 8,  cityName: '싱가포르',  countryName: '싱가포르', imgUrl: 'https://picsum.photos/seed/singapore/800/600', estimatedBudget: 2000000, riskLevel: 1, latitude: 1.3521,   longitude: 103.8198, matchingScore: 90 },
  { cityId: 9,  cityName: '로마',      countryName: '이탈리아', imgUrl: 'https://picsum.photos/seed/rome/800/600',      estimatedBudget: 2100000, riskLevel: 2, latitude: 41.9028,  longitude: 12.4964,  matchingScore: 76 },
  { cityId: 10, cityName: '발리',      countryName: '인도네시아',imgUrl: 'https://picsum.photos/seed/bali/800/600',     estimatedBudget: 800000,  riskLevel: 2, latitude: -8.3405,  longitude: 115.0920, matchingScore: 95 },
  { cityId: 11, cityName: '암스테르담',countryName: '네덜란드', imgUrl: 'https://picsum.photos/seed/amsterdam/800/600', estimatedBudget: 1900000, riskLevel: 1, latitude: 52.3676,  longitude: 4.9041,   matchingScore: 72 },
  { cityId: 12, cityName: '서울',      countryName: '한국',     imgUrl: 'https://picsum.photos/seed/seoul/800/600',     estimatedBudget: 1200000, riskLevel: 1, latitude: 37.5665,  longitude: 126.9780, matchingScore: 87 },
  { cityId: 13, cityName: '이스탄불',  countryName: '터키',     imgUrl: 'https://picsum.photos/seed/istanbul/800/600',  estimatedBudget: 1100000, riskLevel: 3, latitude: 41.0082,  longitude: 28.9784,  matchingScore: 60 },
  { cityId: 14, cityName: '프라하',    countryName: '체코',     imgUrl: 'https://picsum.photos/seed/prague/800/600',    estimatedBudget: 1400000, riskLevel: 1, latitude: 50.0755,  longitude: 14.4378,  matchingScore: 80 },
  { cityId: 15, cityName: '칸쿤',      countryName: '멕시코',   imgUrl: 'https://picsum.photos/seed/cancun/800/600',    estimatedBudget: 1600000, riskLevel: 3, latitude: 21.1619,  longitude: -86.8515, matchingScore: 55 },
];

interface GlobeViewerProps {
  width: number;
  height: number;
}

const INITIAL_LAT = 35;
const INITIAL_LNG = 127;
const INITIAL_ALTITUDE = 2.0;

function getMarkerColor(score: number | undefined): string {
  if (score === undefined) return '#3b82f6';
  if (score >= 80) return '#10b981';
  if (score >= 50) return '#3b82f6';
  return '#f59e0b';
}

export function GlobeViewer({ width, height }: GlobeViewerProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { openRightPanel, globeBudgetFilter, globeRiskFilter } = useUiStore();
  const { data: citiesFromApi } = useCityList();
  const cities = citiesFromApi ?? DUMMY_CITIES;

  const handleGlobeReady = useCallback(() => {
    globeRef.current?.pointOfView(
      { lat: INITIAL_LAT, lng: INITIAL_LNG, altitude: INITIAL_ALTITUDE },
      0,
    );
  }, []);

  const filteredCities = useMemo<CityListItem[]>(() => {
    return cities.filter((city) => {
      const withinBudget =
        city.estimatedBudget >= globeBudgetFilter[0] &&
        city.estimatedBudget <= globeBudgetFilter[1];
      const withinRisk = city.riskLevel <= globeRiskFilter;
      return withinBudget && withinRisk;
    });
  }, [cities, globeBudgetFilter, globeRiskFilter]);

  const handlePointClick = useCallback(
    (point: object) => {
      openRightPanel((point as CityListItem).cityId);
    },
    [openRightPanel],
  );

  const pointColorFn = useCallback(
    (d: object) => getMarkerColor((d as CityListItem).matchingScore),
    [],
  );

  const pointLatFn = useCallback(
    (d: object) => (d as CityListItem).latitude,
    [],
  );

  const pointLngFn = useCallback(
    (d: object) => (d as CityListItem).longitude,
    [],
  );

  const pointLabelFn = useCallback(
    (d: object) => (d as CityListItem).cityName,
    [],
  );

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundColor="rgba(0,0,0,0)"
      onGlobeReady={handleGlobeReady}
      pointsData={filteredCities}
      pointLat={pointLatFn}
      pointLng={pointLngFn}
      pointAltitude={0.006}
      pointRadius={0.5}
      pointColor={pointColorFn}
      pointLabel={pointLabelFn}
      onPointClick={handlePointClick}
    />
  );
}
