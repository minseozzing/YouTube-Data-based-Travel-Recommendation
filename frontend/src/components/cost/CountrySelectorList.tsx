import { cn } from '@/lib/utils';

const COMPARE_COUNTRIES = [
  { id: 82, name: '한국', emoji: '🇰🇷' },
  { id: 840, name: '미국', emoji: '🇺🇸' },
  { id: 392, name: '일본', emoji: '🇯🇵' },
  { id: 826, name: '영국', emoji: '🇬🇧' },
  { id: 276, name: '독일', emoji: '🇩🇪' },
];

interface CountrySelectorListProps {
  selectedId: number;
  onSelect: (id: number) => void;
}

export function CountrySelectorList({ selectedId, onSelect }: CountrySelectorListProps) {
  return (
    <div>
      <h3 className="font-semibold text-foreground mb-3 text-sm">비교 국가 선택</h3>
      <ul className="space-y-1.5" role="listbox" aria-label="비교 국가 목록">
        {COMPARE_COUNTRIES.map((country) => (
          <li key={country.id} role="option" aria-selected={selectedId === country.id}>
            <button
              type="button"
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selectedId === country.id
                  ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground',
              )}
              onClick={() => onSelect(country.id)}
              aria-label={`${country.name} 선택`}
            >
              <span className="text-base" aria-hidden="true">{country.emoji}</span>
              <span>{country.name}</span>
              {selectedId === country.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
        비교 기능은 추후 업데이트 예정입니다
      </p>
    </div>
  );
}
