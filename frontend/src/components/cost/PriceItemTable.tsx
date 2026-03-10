import { Home, UtensilsCrossed, Bus, ShoppingBag } from 'lucide-react';
import type { OnePersonCost } from '@/schemas/cost.schema';

interface PriceItemTableProps {
  currency: string;
  onePerson: OnePersonCost;
  countryLabel: string;
}

export function PriceItemTable({ currency, onePerson, countryLabel }: PriceItemTableProps) {
  const items = [
    {
      icon: Home,
      label: '임대 + 공과금',
      value: onePerson.rentAndUtilities,
    },
    {
      icon: UtensilsCrossed,
      label: '식비',
      value: onePerson.food,
    },
    {
      icon: Bus,
      label: '교통비',
      value: onePerson.transport,
    },
    {
      icon: ShoppingBag,
      label: '기타 (임대 제외)',
      value: onePerson.withoutRent,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">생활비 항목 상세</h3>
        <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full font-medium">
          {countryLabel}
        </span>
      </div>
      <ul className="divide-y divide-border" aria-label="생활비 항목 목록">
        {items.map(({ icon: Icon, label, value }) => (
          <li
            key={label}
            className="flex items-center justify-between py-3.5 gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                <Icon className="size-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {value.toLocaleString()}
              <span className="text-xs text-muted-foreground font-normal ml-1">{currency}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">1인 월 총 생활비 (임대 포함)</span>
        <span className="text-base font-bold text-blue-600 tabular-nums">
          {onePerson.totalWithRent.toLocaleString()}
          <span className="text-sm text-muted-foreground font-normal ml-1">{currency}</span>
        </span>
      </div>
    </div>
  );
}
