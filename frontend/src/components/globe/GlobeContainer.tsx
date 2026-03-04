import { useRef, useState, useLayoutEffect, Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const GlobeViewer = lazy(() =>
  import('./GlobeViewer').then((m) => ({ default: m.GlobeViewer })),
);

interface GlobeContainerProps {
  className?: string;
}

function GlobeFallback() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Loader2 className="size-8 animate-spin text-blue-400" aria-hidden="true" />
    </div>
  );
}

export function GlobeContainer({ className }: GlobeContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [globeSize, setGlobeSize] = useState(500);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.max(Math.min(Math.round(width), Math.round(height)), 100);
      setGlobeSize(s);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'rounded-full overflow-hidden flex items-center justify-center',
        className,
      )}
      aria-label="3D 지구본 시각화"
    >
      <Suspense fallback={<GlobeFallback />}>
        <GlobeViewer width={globeSize} height={globeSize} />
      </Suspense>
    </div>
  );
}
