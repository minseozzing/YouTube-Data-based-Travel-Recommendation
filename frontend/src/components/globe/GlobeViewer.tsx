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
  const centerRef = useRef<[number, number]>([127, 35]);
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

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
            [-width * 0.2, -height * 0.2],
            [width * 1.2, height * 1.2],
          ]}
          onMoveEnd={({ coordinates, zoom: z }) => {
            const clamped: [number, number] = [
              coordinates[0],
              Math.max(-85, Math.min(85, coordinates[1])),
            ];
            centerRef.current = clamped;
            setCenter(clamped);
            setZoom(z);
          }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: { rsmKey: string; properties: { name?: string } }[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#F1F5F9"
                  stroke="#CBD5E1"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#058900", outline: "none" },
                    pressed: { outline: "none" },
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
                key={city.cityId}
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
                    isMatched ? getMarkerColor(city.matchingScore) : "#CBD5E1"
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
                  onMouseMove={(e) =>
                    setTooltip({
                      name: city.cityName,
                      x: e.clientX,
                      y: e.clientY,
                    })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
              </Marker>
            );
          })}
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
