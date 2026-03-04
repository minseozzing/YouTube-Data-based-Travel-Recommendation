import { useLayoutEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

// 배경 이미지(assets에서 import)
import bgImage from "../../assets/Maldive_beach_1.jpg"; // 너 폴더 구조에 맞춰 경로 조정

export default function HomePage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 680, h: 680 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* (1) 배경 이미지 레이어 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* (2) 배경 어둡게(선택) */}
      <div className="absolute inset-0 bg-black/20" />

      {/* (3) 지구본 중앙 레이어(화면 전체 기준) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {/* 지구본 박스: 정사각형 + 원형 마스킹 */}
        <div
          ref={wrapRef}
          className="aspect-square h-[300px] md:h-[400px] lg:h-[450px] rounded-full overflow-hidden shadow-2xl"
        >
          <Globe
            width={size.w}
            height={size.h}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundColor="rgba(0,0,0,0)" // 캔버스 배경 투명
          />
        </div>
      </div>
    </div>
  );
}
