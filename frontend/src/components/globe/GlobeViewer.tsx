import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { animate } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useUiStore } from "@/stores/uiStore";
import { useCityList } from "@/hooks/city/useCityList";
import { DUMMY_CITIES } from "@/data/dummyCityData";
import { COUNTRY_NAME_KO } from "@/data/countryNameKo";
import { COUNTRY_NAME_ISO3 } from "@/data/countryNameIso3";
import React from "react";

// 베이스 지도: CDN 50m (world-atlas — 안티메리디안 처리 완벽)
// admin-1: 클릭된 나라의 /geo/{ISO3}.json (10m, lazy load)
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json";

// 줌 임계값
const ZOOM_SHOW_BORDERS = 1.5; // 이상: 나라 경계선 표시 (나라 미선택 시)

interface GlobeViewerProps {
  width: number;
  height: number;
}

type GeoFeature = {
  rsmKey: string;
  properties: {
    name?: string;
    name_en?: string;
    admin?: string;
    iso_a2?: string;
    postal?: string;
    shapeName?: string;
    shapeISO?: string;
    shapeGroup?: string;
  };
  geometry: {
    type: string;
    coordinates: unknown[];
  };
};

function getGeoBounds(geo: GeoFeature) {
  const coords: [number, number][] = [];
  const geom = geo.geometry;

  if (geom.type === "Polygon") {
    (geom.coordinates[0] as [number, number][]).forEach((c) => coords.push(c));
  } else if (geom.type === "MultiPolygon") {
    (geom.coordinates as [number, number][][][]).forEach((poly) =>
      poly[0].forEach((c) => coords.push(c)),
    );
  }

  if (!coords.length) return null;

  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  return {
    minLng,
    maxLng,
    minLat,
    maxLat,
    width: maxLng - minLng,
    height: maxLat - minLat,
  };
}

function calcCountryView(
  minLng: number,
  maxLng: number,
  minLat: number,
  maxLat: number,
  width: number,
  height: number,
): { center: [number, number]; zoom: number } {
  const center: [number, number] = [
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
  ];
  const dLng = Math.max(maxLng - minLng, 1);
  const dLat = Math.max(maxLat - minLat, 1);
  const zoomLng = (360 / dLng) * 0.65;
  const zoomLat = (180 / dLat) * (height / width) * 0.65;
  const zoom = Math.min(Math.min(zoomLng, zoomLat), 16);
  return { center, zoom };
}

function getMarkerColor(score: number | undefined): string {
  if (score === undefined) return "#3b82f6";
  if (score >= 80) return "#10b981";
  if (score >= 50) return "#3b82f6";
  return "#f59e0b";
}

const COUNTRY_STYLE_DEFAULT = {
  outline: "none",
  vectorEffect: "non-scaling-stroke" as const,
};
const COUNTRY_STYLE_PRESSED = { outline: "none" };

const BaseLayer = React.memo(
  ({
    clickedName,
    showBorders,
    onCountryClick,
    onEnter,
    onMove,
    onLeave,
  }: {
    clickedName: string | null;
    showBorders: boolean;
    onCountryClick: (geo: GeoFeature) => void;
    onEnter: (name: string, e: React.MouseEvent) => void;
    onMove: (name: string, e: React.MouseEvent) => void;
    onLeave: () => void;
  }) => (
    <Geographies geography={GEO_URL}>
      {({ geographies }: { geographies: GeoFeature[] }) =>
        geographies.map((geo) => {
          const rawName = geo.properties.name ?? "";
          const isSelected = rawName === clickedName;
          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              tabIndex={-1}
              fill={isSelected ? "#d4d4d4" : "#F1F5F9"}
              stroke={showBorders && !isSelected ? "#626262" : "none"}
              strokeWidth={showBorders && !isSelected ? 0.5 : 0}
              style={{
                default: COUNTRY_STYLE_DEFAULT,
                hover: {
                  fill: isSelected ? "#d4d4d4" : "#7fef7b",
                  outline: "none",
                  cursor: "pointer",
                  vectorEffect: "non-scaling-stroke" as const,
                },
                pressed: COUNTRY_STYLE_PRESSED,
              }}
              onClick={() => onCountryClick(geo)}
              onMouseEnter={(e) => {
                if (!isSelected) onEnter(rawName, e);
              }}
              onMouseMove={(e) => {
                if (!isSelected) onMove(rawName, e);
              }}
              onMouseLeave={onLeave}
            />
          );
        })
      }
    </Geographies>
  ),
);

// 모든 국가 GeoJSON이 mapshaper 5% simplify 처리됨
function getAdminUrl(iso: string) {
  return `/geo/${iso}.json`;
}

const ADMIN_STYLE = {
  default: {
    outline: "none",
    pointerEvents: "none",
    vectorEffect: "non-scaling-stroke" as const,
  },
  hover: { outline: "none" },
  pressed: { outline: "none" },
} as const;

// react-simple-maps가 URL 기반 fetch를 내부적으로 캐시하므로
// 재클릭 시 네트워크 요청 없이 즉시 렌더됨
const AdminLayer = React.memo(({ iso }: { iso: string }) => (
  <Geographies geography={getAdminUrl(iso)}>
    {({ geographies }: { geographies: GeoFeature[] }) =>
      geographies
        .filter((geo) => {
          const bounds = getGeoBounds(geo);
          if (!bounds) return false;

          // 지도 전체를 덮는 비정상 geometry 제거
          if (bounds.width > 300 || bounds.height > 140) return false;

          return true;
        })
        .map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="none"
            stroke="#334155"
            strokeWidth={0.8}
            style={ADMIN_STYLE}
          />
        ))
    }
  </Geographies>
));

export function GlobeViewer({ width, height }: GlobeViewerProps) {
  const {
    openRightPanel,
    globeBudgetFilter,
    globeRiskFilter,
    globeDuration,
    selectedCityCoords,
    isRecommendActive,
  } = useUiStore();

  // ── state ──────────────────────────────────────────────
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const [clickedIso, setClickedIso] = useState<string | null>(null);
  const [clickedName, setClickedName] = useState<string | null>(null);
  // 1순위: 줌 애니메이션 중 admin 렌더 차단
  const [isZooming, setIsZooming] = useState(false);

  // ── refs ───────────────────────────────────────────────
  const centerRef = useRef<[number, number]>([0, 20]);
  const zoomRef = useRef(1);
  const tooltipThrottleRef = useRef<number>(0);
  const clickedNameRef = useRef<string | null>(null);
  clickedNameRef.current = clickedName; // 매 렌더마다 동기화
  // 1순위: 줌 타이머 ref (클린업용)
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 파생값 ─────────────────────────────────────────────
  const showBorders = zoom >= ZOOM_SHOW_BORDERS;
  // 1순위: 줌 중이면 admin 렌더 차단 (줌 완료 후 표시)
  const showAdmin = !!clickedIso && !isZooming;

  // ── 콜백 ───────────────────────────────────────────────
  const handleTooltipMove = useCallback((name: string, e: React.MouseEvent) => {
    const now = Date.now();
    if (now - tooltipThrottleRef.current < 32) return;
    tooltipThrottleRef.current = now;
    setTooltip({ name, x: e.clientX, y: e.clientY });
  }, []);

  const handleEnter = useCallback((rawName: string, e: React.MouseEvent) => {
    setTooltip({
      name: COUNTRY_NAME_KO[rawName] ?? rawName,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const handleMove = useCallback(
    (rawName: string, e: React.MouseEvent) => {
      handleTooltipMove(COUNTRY_NAME_KO[rawName] ?? rawName, e);
    },
    [handleTooltipMove],
  );

  const handleCountryClick = useCallback(
    (geo: GeoFeature) => {
      const rawName = geo.properties.name ?? "";
      if (rawName === clickedNameRef.current) {
        setClickedIso(null);
        setClickedName(null);
        return;
      }
      const bounds = getGeoBounds(geo);
      if (!bounds) return;
      const iso = COUNTRY_NAME_ISO3[rawName];
      if (iso) setClickedIso(iso);
      setClickedName(rawName);

      // 1순위: 줌 시작 → admin 렌더 차단
      setIsZooming(true);
      if (zoomTimerRef.current) clearTimeout(zoomTimerRef.current);
      zoomTimerRef.current = setTimeout(() => setIsZooming(false), 700);

      const { center: newCenter, zoom: newZoom } = calcCountryView(
        bounds.minLng,
        bounds.maxLng,
        bounds.minLat,
        bounds.maxLat,
        width,
        height,
      );
      const currentLng = centerRef.current[0];
      const diff =
        ((((newCenter[0] - currentLng + 180) % 360) + 360) % 360) - 180;
      const targetCenter: [number, number] = [currentLng + diff, newCenter[1]];
      centerRef.current = targetCenter;
      zoomRef.current = newZoom;
      setCenter(targetCenter);
      setZoom(newZoom);
    },
    [width, height],
  );

  useEffect(() => {
    if (!selectedCityCoords) return;
    const [fromLng, fromLat] = centerRef.current;
    const toLng = selectedCityCoords.lng;
    const toLat = selectedCityCoords.lat;
    const controls = animate(0, 1, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (t) => {
        const next: [number, number] = [
          fromLng + (toLng - fromLng) * t,
          fromLat + (toLat - fromLat) * t,
        ];
        centerRef.current = next;
        setCenter(next);
      },
    });
    return () => controls.stop();
  }, [selectedCityCoords]);

  const { data: citiesFromApi } = useCityList();
  const cities = citiesFromApi?.length ? citiesFromApi : DUMMY_CITIES;

  const matchedCityIds = useMemo<Set<number>>(() => {
    if (!isRecommendActive) return new Set();
    const matched = cities.filter((city) => {
      const adjustedBudget = (city.estimatedBudget / 7) * globeDuration;
      const withinBudget =
        adjustedBudget >= globeBudgetFilter[0] &&
        adjustedBudget <= globeBudgetFilter[1];
      const withinRisk = city.riskLevel <= globeRiskFilter;
      return withinBudget && withinRisk;
    });
    return new Set(matched.map((c) => c.cityId));
  }, [
    cities,
    globeBudgetFilter,
    globeRiskFilter,
    globeDuration,
    isRecommendActive,
  ]);

  const worldWidth = (2 * Math.PI * width) / 7;
  const OFFSETS = [-1, 0, 1] as const;

  return (
    <>
      <ComposableMap
        width={width}
        height={height}
        projection="geoMercator"
        projectionConfig={{ scale: width / 7 }}
        tabIndex={-1}
        style={{ width: "100%", height: "100%", outline: "none" }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={0.8}
          maxZoom={20}
          translateExtent={[
            [-1e10, -1e10],
            [1e10, 1e10],
          ]}
          onMoveEnd={({ coordinates, zoom: z }) => {
            // 경도를 [-180, 180]으로 정규화 (트레드밀 스냅백)
            const rawLng = coordinates[0];
            const normalizedLng = ((((rawLng + 180) % 360) + 360) % 360) - 180;
            const next: [number, number] = [
              normalizedLng,
              Math.max(-85, Math.min(85, coordinates[1])),
            ];
            centerRef.current = next;
            zoomRef.current = z;
            setCenter(next);
            setZoom(Math.round(z * 10) / 10);
          }}
        >
          {OFFSETS.map((offset, slotIndex) => (
            <g
              key={slotIndex}
              transform={`translate(${offset * worldWidth}, 0)`}
            >
              {/* 나라 채우기 + 경계선 레이어 (10m) */}
              <BaseLayer
                clickedName={clickedName}
                showBorders={showBorders}
                onCountryClick={handleCountryClick}
                onEnter={handleEnter}
                onMove={handleMove}
                onLeave={handleLeave}
              />

              {/* 대륙 외곽선 — 줌 1.5 미만에서만 (나라 선택 여부 무관) */}
              {zoom < ZOOM_SHOW_BORDERS && (
                <Geographies geography={LAND_URL}>
                  {({ geographies }: { geographies: GeoFeature[] }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", pointerEvents: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>
              )}

              {/* 행정구역 레이어 — 줌 완료 후에만 렌더 (isZooming=false 시) */}
              {showAdmin && clickedIso && <AdminLayer iso={clickedIso} />}

              {/* 도시 마커 */}
              {cities.map((city) => {
                const isMatched =
                  !isRecommendActive || matchedCityIds.has(city.cityId);
                return (
                  <Marker
                    key={`${city.cityId}-${slotIndex}`}
                    coordinates={[city.longitude, city.latitude]}
                    onClick={() =>
                      openRightPanel(city.cityId, city.imgUrl, {
                        lat: city.latitude,
                        lng: city.longitude,
                      })
                    }
                  >
                    <circle
                      r={5 / zoom}
                      fill={
                        isMatched
                          ? getMarkerColor(city.matchingScore)
                          : "#CBD5E1"
                      }
                      stroke="#fff"
                      strokeWidth={0.2}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          name: city.cityName,
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseMove={(e) => handleTooltipMove(city.cityName, e)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </Marker>
                );
              })}
            </g>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      {/* 디버그: 현재 줌 레벨 표시 — 확인 후 제거 가능 */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 11,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        zoom: {zoom.toFixed(2)}
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y - 28,
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 4,
            fontSize: 12,
            pointerEvents: "none",
            zIndex: 50,
            whiteSpace: "nowrap",
          }}
        >
          {tooltip.name}
        </div>
      )}
    </>
  );
}
