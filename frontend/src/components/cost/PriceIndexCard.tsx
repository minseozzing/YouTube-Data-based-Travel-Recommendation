import { Home, UtensilsCrossed, Bus, ShoppingBag } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OnePersonCost } from '@/schemas/cost.schema';

interface PriceIndexCardProps {
  currency: string;
  onePerson: OnePersonCost;
}

export function PriceIndexCard({ currency, onePerson }: PriceIndexCardProps) {
  const subItems = [
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
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          1인 월 생활비
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-foreground">
            {onePerson.totalWithRent.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">{currency}</span>
        </div>
        <Separator className="mb-4" />
        <ul className="space-y-3" aria-label="1인 생활비 상세">
          {subItems.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {value.toLocaleString()} {currency}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
