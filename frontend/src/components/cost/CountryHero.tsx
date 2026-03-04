import { Globe } from 'lucide-react';

const COUNTRY_NAME_MAP: Record<number, string> = {
  392: '일본',
  764: '태국',
  250: '프랑스',
  840: '미국',
  756: '스위스',
  578: '노르웨이',
  208: '덴마크',
  704: '베트남',
  360: '인도네시아',
  116: '캄보디아',
  82: '한국',
  826: '영국',
  276: '독일',
};

interface CountryHeroProps {
  countryId: number;
  currency: string;
}

export function CountryHero({ countryId, currency }: CountryHeroProps) {
  const countryName = COUNTRY_NAME_MAP[countryId] ?? `국가 #${countryId}`;

  return (
    <header className="mb-8">
      <div className="flex items-end gap-4 flex-wrap">
        <h1 className="text-5xl font-bold text-foreground tracking-tight">
          {countryName}
        </h1>
        <div className="flex items-center gap-1.5 mb-1.5 text-muted-foreground">
          <Globe className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium">{currency}</span>
        </div>
      </div>
      <p className="text-muted-foreground text-sm mt-2">
        국가 코드 #{countryId} · Numbeo 물가 데이터 기준
      </p>
    </header>
  );
}

export { COUNTRY_NAME_MAP };
