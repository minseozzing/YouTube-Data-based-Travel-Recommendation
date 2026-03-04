import { Sparkles, TrendingUp, Plane, Newspaper, ChevronRight, type LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CityDetail } from '@/schemas/city.schema';

interface RecommendTabProps {
  city: CityDetail;
  onTabChange: (tab: 'recommend' | 'cost' | 'flight' | 'news') => void;
}

interface RelatedInfoItemProps {
  icon: LucideIcon;
  label: string;
  subtext: string;
  onClick: () => void;
}

function RelatedInfoItem({ icon: Icon, label, subtext, onClick }: RelatedInfoItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full p-3 rounded-xl border border-border',
        'hover:bg-accent/50 hover:border-blue-200 dark:hover:border-blue-800',
        'transition-colors text-left',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
      )}
    >
      <div className="shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
        <Icon className="size-4 text-slate-600 dark:text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtext}</p>
      </div>
      <ChevronRight className="size-3.5 text-muted-foreground ml-auto shrink-0" />
    </button>
  );
}

export function RecommendTab({ city, onTabChange }: RecommendTabProps) {
  const recommendText =
    city.recommendReason ??
    'AI가 분석한 추천 이유를 불러오는 중입니다.';

  const dailyCostText =
    city.dailyCost !== undefined
      ? `일평균 ${city.dailyCost.toLocaleString()}원`
      : '비교 데이터 보기';

  const flightPriceText =
    city.flightPrice !== undefined
      ? `${city.flightPrice.toLocaleString()}원~`
      : '가격 조회하기';

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* AI Recommend Section */}
      <section aria-label="AI 맞춤 추천 분석">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-foreground">AI 맞춤 추천 분석</h3>
        </div>

        {city.matchingScore !== undefined && (
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">매칭 점수: </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              {city.matchingScore}%
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">
          {recommendText}
        </p>

        {/* Keywords */}
        {city.keywords && city.keywords.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                인기 키워드
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {city.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="text-xs text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 rounded-full px-2.5"
                >
                  #{keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Related Info Section */}
      <section aria-label="관련 정보">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          관련 정보
        </h3>
        <div className="flex flex-col gap-2">
          <RelatedInfoItem
            icon={TrendingUp}
            label="생활물가 비교"
            subtext={dailyCostText}
            onClick={() => onTabChange('cost')}
          />
          <RelatedInfoItem
            icon={Plane}
            label="최저 항공권"
            subtext={flightPriceText}
            onClick={() => onTabChange('flight')}
          />
          <RelatedInfoItem
            icon={Newspaper}
            label="현지 뉴스"
            subtext="최신 현지 소식 보기"
            onClick={() => onTabChange('news')}
          />
        </div>
      </section>
    </div>
  );
}
