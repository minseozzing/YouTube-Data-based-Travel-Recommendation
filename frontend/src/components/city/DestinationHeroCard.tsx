import { useState } from 'react';
import { Landmark, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SaveButton } from '@/components/city/SaveButton';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import type { CityDetail } from '@/schemas/city.schema';

interface DestinationHeroCardProps {
  city: CityDetail;
  className?: string;
}

export function DestinationHeroCard({ city, className }: DestinationHeroCardProps) {
  const [imgError, setImgError] = useState(false);
  const { closeCityModal } = useUiStore();

  return (
    <div className={cn('relative flex flex-col w-72 shrink-0 overflow-hidden rounded-l-2xl', className)}>
      {/* Background image */}
      {!imgError ? (
        <img
          src={city.imgUrl}
          alt={city.cityName}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
          <Landmark className="size-16 text-slate-500" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Back button top-left */}
      <div className="relative z-10 flex items-start p-4">
        <button
          onClick={closeCityModal}
          aria-label="뒤로 가기"
          className={cn(
            'flex items-center gap-1.5 text-xs text-white/80 hover:text-white',
            'bg-black/20 hover:bg-black/40 rounded-lg px-2.5 py-1.5',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
          )}
        >
          <ArrowLeft className="size-3" />
          뒤로가기
        </button>
      </div>

      {/* Spacer to push content down */}
      <div className="flex-1" />

      {/* Bottom content */}
      <div className="relative z-10 p-5 flex flex-col gap-3">
        {/* Matching score badge */}
        {city.matchingScore !== undefined && (
          <div>
            <Badge className="bg-blue-500/90 text-white border-transparent text-xs font-semibold px-2.5 py-0.5 rounded-full">
              매칭 {city.matchingScore}%
            </Badge>
          </div>
        )}

        {/* City and country name */}
        <div>
          <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md">
            {city.cityName}
          </h2>
          <p className="text-sm text-white/80 mt-0.5">{city.countryName}</p>
        </div>

        {/* Save button */}
        <SaveButton city={city} />
      </div>
    </div>
  );
}
