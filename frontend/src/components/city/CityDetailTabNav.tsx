import { Sparkles, TrendingUp, Plane, Newspaper, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type CityDetailTab = 'recommend' | 'cost' | 'flight' | 'news';

interface TabConfig {
  id: CityDetailTab;
  label: string;
  icon: LucideIcon;
}

const TABS: TabConfig[] = [
  { id: 'recommend', label: '추천 이유', icon: Sparkles },
  { id: 'cost', label: '생활물가 비교', icon: TrendingUp },
  { id: 'flight', label: '항공권 탐색', icon: Plane },
  { id: 'news', label: '현지 뉴스', icon: Newspaper },
];

interface CityDetailTabNavProps {
  activeTab: CityDetailTab;
  onTabChange: (tab: CityDetailTab) => void;
}

export function CityDetailTabNav({ activeTab, onTabChange }: CityDetailTabNavProps) {
  return (
    <nav
      role="tablist"
      aria-label="도시 상세 탭"
      className="flex border-b border-border shrink-0"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tab-panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-inset',
              isActive
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3.5" />
            {tab.label}
            {/* Active underline */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
