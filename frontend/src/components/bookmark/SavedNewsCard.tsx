import { Newspaper, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { BookmarkDetail } from '@/schemas/bookmark.schema';

type NewsAtSavedItem = NonNullable<BookmarkDetail['newsAtSaved']>[number];

const MAX_NEWS_ITEMS = 3;

interface SavedNewsCardProps {
  news?: NewsAtSavedItem[];
}

interface NewsItemRowProps {
  item: NewsAtSavedItem;
  index: number;
}

function NewsItemRow({ item, index }: NewsItemRowProps) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-slate-50 transition-colors"
      aria-label={`${item.title} — ${item.source} (새 탭에서 열기)`}
    >
      {/* 번호 배지 */}
      <span
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 mt-0.5"
        aria-hidden="true"
      >
        {index + 1}
      </span>

      {/* 뉴스 내용 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </p>
        <div className="mt-0.5 flex items-center gap-1">
          <p className="text-xs text-slate-400">{item.source}</p>
          <ExternalLink className="size-3 text-slate-300 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
        </div>
      </div>
    </a>
  );
}

export function SavedNewsCard({ news }: SavedNewsCardProps) {
  const displayedNews = news && news.length > 0 ? news.slice(0, MAX_NEWS_ITEMS) : null;

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
          <Newspaper className="size-4 text-purple-500" aria-hidden="true" />
          주요 이슈
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayedNews ? (
          <div className="space-y-1">
            {displayedNews.map((item, idx) => (
              <NewsItemRow key={idx} item={item} index={idx} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">저장된 뉴스 데이터가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
