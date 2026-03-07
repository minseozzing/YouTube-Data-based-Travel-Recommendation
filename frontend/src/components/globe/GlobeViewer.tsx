import { useMemo, useState, useEffect, useRef } from "react";
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

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GlobeViewerProps {
  width: number;
  height: number;
}

type GeoFeature = {
  rsmKey: string;
  properties: { name?: string };
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
      poly[0].forEach((c) => coords.push(c))
    );
  }
  if (!coords.length) return null;
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return {
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
  };
}

function calcCountryView(
  minLng: number,
  maxLng: number,
  minLat: number,
  maxLat: number,
  width: number,
  height: number
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

export function GlobeViewer({ width, height }: GlobeViewerProps) {
  const {
    openRightPanel,
    globeBudgetFilter,
    globeRiskFilter,
    globeDuration,
    selectedCityCoords,
    isRecommendActive,
  } = useUiStore();

  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [zoom, setZoom] = useState(1);
  const centerRef = useRef<[number, number]>([0, 20]);
  const zoomRef = useRef(1);
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  function animateToView(newCenter: [number, number], newZoom: number) {
    const [fromLng, fromLat] = centerRef.current;
    const fromZoom = zoomRef.current;
    animate(0, 1, {
      duration: 0.8,
      ease: "easeInOut",
      onUpdate: (t) => {
        const next: [number, number] = [
          fromLng + (newCenter[0] - fromLng) * t,
          fromLat + (newCenter[1] - fromLat) * t,
        ];
        const nextZoom = fromZoom + (newZoom - fromZoom) * t;
        centerRef.current = next;
        zoomRef.current = nextZoom;
        setCenter(next);
        setZoom(nextZoom);
      },
    });
  }

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
  const OFFSETS = [-2, -1, 0, 1, 2] as const;

  return (
    <>
      <ComposableMap
        width={width}
        height={height}
        projection="geoMercator"
        projectionConfig={{ scale: width / 7 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          translateExtent={[
            [-1e10, -height * 0.2],
            [1e10, height * 1.2],
          ]}
          onMoveEnd={({ coordinates, zoom: z }) => {
            // 경도를 [-180, 180]으로 정규화 (트레드밀 스냅백)
            const rawLng = coordinates[0];
            const normalizedLng = ((rawLng + 180) % 360 + 360) % 360 - 180;
            const next: [number, number] = [
              normalizedLng,
              Math.max(-85, Math.min(85, coordinates[1])),
            ];
            centerRef.current = next;
            zoomRef.current = z;
            setCenter(next);
            setZoom(z);
          }}
        >
          {OFFSETS.map((offset, slotIndex) => (
            <g key={slotIndex} transform={`translate(${offset * worldWidth}, 0)`}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: GeoFeature[] }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#F1F5F9"
                      stroke="#CBD5E1"
                      strokeWidth={0.3}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#058900", outline: "none", cursor: "pointer" },
                        pressed: { outline: "none" },
                      }}
                      onClick={() => {
                        const bounds = getGeoBounds(geo);
                        if (!bounds) return;
                        const { center: newCenter, zoom: newZoom } = calcCountryView(
                          bounds.minLng, bounds.maxLng,
                          bounds.minLat, bounds.maxLat,
                          width, height
                        );
                        // 현재 위치에서 가장 가까운 동치 경도로 보정 (깜박임 방지)
                        const currentLng = centerRef.current[0];
                        const diff = ((newCenter[0] - currentLng + 180) % 360 + 360) % 360 - 180;
                        animateToView([currentLng + diff, newCenter[1]], newZoom);
                      }}
                      onMouseEnter={(e) =>
                        setTooltip({
                          name: COUNTRY_NAME_KO[geo.properties.name ?? ""] ?? geo.properties.name ?? "",
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseMove={(e) =>
                        setTooltip({
                          name: COUNTRY_NAME_KO[geo.properties.name ?? ""] ?? geo.properties.name ?? "",
                          x: e.clientX,
                          y: e.clientY,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))
                }
              </Geographies>
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
                      fill={isMatched ? getMarkerColor(city.matchingScore) : "#CBD5E1"}
                      stroke="#fff"
                      strokeWidth={0.2}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) =>
                        setTooltip({ name: city.cityName, x: e.clientX, y: e.clientY })
                      }
                      onMouseMove={(e) =>
                        setTooltip({ name: city.cityName, x: e.clientX, y: e.clientY })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    />
                  </Marker>
                );
              })}
            </g>
          ))}
        </ZoomableGroup>
      </ComposableMap>
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
