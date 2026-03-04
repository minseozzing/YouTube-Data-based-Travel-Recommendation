import { useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";

type CityMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export default function HomePage() {
  const globeRef = useRef<any>(null);

  // 예시 마커(나중에 API/추천 결과로 교체)
  const markers: CityMarker[] = useMemo(
    () => [
      { id: "seoul", name: "Seoul", lat: 37.5665, lng: 126.978 },
      { id: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503 },
      { id: "bangkok", name: "Bangkok", lat: 13.7563, lng: 100.5018 },
      { id: "paris", name: "Paris", lat: 48.8566, lng: 2.3522 },
    ],
    [],
  );

  const [hovered, setHovered] = useState<CityMarker | null>(null);

  const zoomIn = () => {
    const g = globeRef.current;
    if (!g) return;
    const pov = g.pointOfView();
    g.pointOfView(
      { ...pov, altitude: Math.max(0.6, pov.altitude * 0.85) },
      400,
    );
  };

  const zoomOut = () => {
    const g = globeRef.current;
    if (!g) return;
    const pov = g.pointOfView();
    g.pointOfView(
      { ...pov, altitude: Math.min(3.0, pov.altitude * 1.15) },
      400,
    );
  };

  const flyTo = (m: CityMarker) => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: m.lat, lng: m.lng, altitude: 0.9 }, 900);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 3D Globe */}
      <Globe
        ref={globeRef}
        // Google Earth 느낌의 “밝은 지구 + 우주 배경”
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        // 분위기(대기) 효과
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.18}
        // 자동 회전(너무 빠르면 0.2~0.4로 낮추세요)
        onGlobeReady={() => {
          const g = globeRef.current;
          if (!g) return;

          // 초기 카메라 시점
          g.pointOfView({ lat: 20, lng: 0, altitude: 1.8 }, 0);

          // auto-rotate
          const controls = g.controls();
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.45;

          // 확대/축소 범위 제한(너무 가까이/멀리 가지 않게)
          controls.minDistance = 180;
          controls.maxDistance = 900;
        }}
        // 마커(도시 점)
        pointsData={markers}
        pointLat={(d: any) => d.lat}
        pointLng={(d: any) => d.lng}
        pointAltitude={0.01}
        pointRadius={0.45}
        pointLabel={(d: any) => d.name}
        onPointHover={(d: any) => setHovered(d ?? null)}
        onPointClick={(d: any) => {
          if (!d) return;
          flyTo(d);
        }}
      />

      {/* Google Earth 스타일 HUD(오버레이 UI) */}
      <div className="pointer-events-none absolute left-4 top-4 z-10">
        <div className="pointer-events-auto rounded-xl bg-black/55 px-4 py-3 text-white backdrop-blur">
          <div className="text-sm opacity-90">Dahaeng Globe</div>
          <div className="mt-1 text-xs opacity-70">
            Drag: rotate · Wheel: zoom · Click marker: fly
          </div>

          {hovered ? (
            <div className="mt-2 text-sm">
              <span className="opacity-70">Hover:</span>{" "}
              <span className="font-semibold">{hovered.name}</span>
            </div>
          ) : (
            <div className="mt-2 text-sm opacity-70">Hover a city marker</div>
          )}
        </div>
      </div>

      {/* 줌 버튼 */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={zoomIn}
          className="rounded-lg bg-black/60 px-3 py-2 text-white backdrop-blur hover:bg-black/75"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          className="rounded-lg bg-black/60 px-3 py-2 text-white backdrop-blur hover:bg-black/75"
        >
          −
        </button>
      </div>

      {/* 하단 추천(임시) */}
      <div className="absolute bottom-4 left-1/2 z-10 w-[min(720px,calc(100vw-32px))] -translate-x-1/2">
        <div className="rounded-2xl bg-black/55 p-3 text-white backdrop-blur">
          <div className="mb-2 text-sm opacity-80">Quick Fly</div>
          <div className="flex flex-wrap gap-2">
            {markers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => flyTo(m)}
                className="rounded-full bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
