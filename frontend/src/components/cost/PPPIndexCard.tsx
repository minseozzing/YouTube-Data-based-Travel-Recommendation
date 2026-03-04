import { Users, Wallet, CalendarDays } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import dayjs from '@/utils/dayjs';
import type { FamilyOf4Cost } from '@/schemas/cost.schema';

interface CostMeta {
  lastUpdatedAt: string;
  source: string;
}

interface PPPIndexCardProps {
  currency: string;
  familyOf4: FamilyOf4Cost;
  salaryAfterTaxMedian: number;
  meta: CostMeta;
}

export function PPPIndexCard({
  currency,
  familyOf4,
  salaryAfterTaxMedian,
  meta,
}: PPPIndexCardProps) {
  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          4인 가족 월 생활비
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-foreground">
            {familyOf4.totalWithRent.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">{currency}</span>
        </div>

        <Separator className="mb-4" />

        <ul className="space-y-3" aria-label="4인 가족 생활비 상세">
          <li className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="size-4 shrink-0" aria-hidden="true" />
              <span className="text-sm">중위 임금 (세후)</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {salaryAfterTaxMedian.toLocaleString()} {currency}
            </span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 shrink-0" aria-hidden="true" />
              <span className="text-sm">임금 대비 생활비 비율</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {salaryAfterTaxMedian > 0
                ? `${((familyOf4.totalWithRent / salaryAfterTaxMedian) * 100).toFixed(0)}%`
                : '—'}
            </span>
          </li>
        </ul>

        <Separator className="mt-4 mb-3" />

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3" aria-hidden="true" />
            <span>
              업데이트: {dayjs(meta.lastUpdatedAt).format('YYYY.MM.DD')}
            </span>
          </div>
          <div className="truncate">출처: {meta.source}</div>
        </div>
      </CardContent>
    </Card>
  );
}
