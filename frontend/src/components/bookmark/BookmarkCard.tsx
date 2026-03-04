import { useState, type MouseEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { X, Landmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import dayjs from '@/utils/dayjs';
import type { BookmarkListItem } from '@/schemas/bookmark.schema';

const CONTINENT_LABEL_MAP: Record<string, string> = {
  asia: 'ASIA',
  europe: 'EUROPE',
  americas: 'AMERICAS',
  oceania: 'OCEANIA',
  'middle east': 'MIDDLE EAST',
  africa: 'AFRICA',
};

function getContinentBadgeClass(continent: string): string {
  const lower = continent.toLowerCase();
  if (lower.includes('asia')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (lower.includes('europe')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (lower.includes('americ')) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (lower.includes('oceania')) return 'bg-cyan-100 text-cyan-700 border-cyan-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
}

interface BookmarkCardProps {
  item: BookmarkListItem;
  onDelete: (bookmarkId: number) => void;
}

export function BookmarkCard({ item, onDelete }: BookmarkCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    if (item.bookmarkId !== undefined) {
      void navigate({ to: '/bookmarks/$id', params: { id: item.bookmarkId } });
    }
  };

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation();
    if (item.bookmarkId !== undefined) {
      onDelete(item.bookmarkId);
    }
  };

  const continentLabel =
    CONTINENT_LABEL_MAP[item.countryName.toLowerCase()] ?? item.countryName.toUpperCase();
  const badgeClass = getContinentBadgeClass(item.countryName);

  return (
    <motion.article
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-slate-200',
        'cursor-pointer shadow-sm',
      )}
      onClick={handleCardClick}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-label={`${item.cityName} 북마크 상세 보기`}
    >
      {/* 이미지 영역 */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {!imgError ? (
          <img
            src={item.imgUrl}
            alt={item.cityName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <Landmark className="size-12 text-slate-400" aria-hidden="true" />
          </div>
        )}

        {/* 삭제 버튼 — hover 시 표시 */}
        {item.bookmarkId !== undefined && (
          <button
            className={cn(
              'absolute right-2 top-2 flex size-7 items-center justify-center rounded-full',
              'bg-black/50 text-white opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100 hover:bg-black/70',
            )}
            onClick={handleDelete}
            aria-label={`${item.cityName} 북마크 삭제`}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col gap-1.5 p-4">
        <Badge
          className={cn('w-fit border text-[10px] font-semibold uppercase tracking-wide', badgeClass)}
        >
          {continentLabel}
        </Badge>
        <h3 className="text-base font-bold text-slate-900 leading-tight">{item.cityName}</h3>
        <p className="text-sm text-slate-500 leading-snug line-clamp-2">
          {item.cityName}, {item.countryName}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {dayjs(item.createdAt).format('YYYY.MM.DD')}
        </p>
      </div>
    </motion.article>
  );
}
