import { useNavigate } from '@tanstack/react-router';
import { Bus, Utensils, BedDouble, ArrowRight, Wallet } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface CostItem {
  icon: LucideIcon;
  label: string;
  price: string;
}

const DUMMY_COST_ITEMS: CostItem[] = [
  { icon: Bus, label: '교통 (버스)', price: '약 1,200원' },
  { icon: Utensils, label: '식사 (로컬)', price: '약 8,000원' },
  { icon: BedDouble, label: '숙박 (중급)', price: '약 80,000원' },
];

interface CostItemRowProps {
  icon: LucideIcon;
  label: string;
  price: string;
}

function CostItemRow({ icon: Icon, label, price }: CostItemRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
      <div className="flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-lg bg-amber-50">
          <Icon className="size-3.5 text-amber-500" aria-hidden="true" />
        </span>
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-800">{price}</span>
    </div>
  );
}

interface CostSummaryCardProps {
  cityId: number;
}

export function CostSummaryCard({ cityId }: CostSummaryCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="gap-4">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-base text-slate-700">
          <Wallet className="size-4 text-amber-500" aria-hidden="true" />
          해외 물가
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {DUMMY_COST_ITEMS.map((item) => (
            <CostItemRow key={item.label} icon={item.icon} label={item.label} price={item.price} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">* 추후 실제 물가 데이터로 연동 예정입니다.</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full gap-1.5"
          onClick={() => void navigate({ to: '/cost/$countryId', params: { countryId: cityId } })}
          aria-label="해외 물가 상세 분석 페이지로 이동"
        >
          상세 분석하기
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
}
