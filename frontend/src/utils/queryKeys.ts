export const queryKeys = {
  city: {
    all: ['city'] as const,
    list: (params?: object) => ['city', 'list', params] as const,
    detail: (cityId: number) => ['city', 'detail', cityId] as const,
    recommend: (params: object) => ['city', 'recommend', params] as const,
  },
  cost: {
    all: ['cost'] as const,
    country: (countryId: number) => ['cost', 'country', countryId] as const,
    city: (cityId: number) => ['cost', 'city', cityId] as const,
    summary: () => ['cost', 'summary'] as const,
    exchange: (base: string, target: string) => ['cost', 'exchange', base, target] as const,
  },
  flight: {
    all: ['flight'] as const,
    monthly: (cityId: number, year: number, month: number) =>
      ['flight', 'monthly', cityId, year, month] as const,
    daily: (cityId: number, date: string) => ['flight', 'daily', cityId, date] as const,
    info: (cityId: number) => ['flight', 'info', cityId] as const,
    monthlyDaily: (cityId: number, year: number, month: number) =>
      ['flight', 'monthly-daily', cityId, year, month] as const,
  },
  news: {
    byCountry: (countryId: number) => ['news', countryId] as const,
  },
  bookmark: {
    all: ['bookmark'] as const,
    list: (keyword?: string) => ['bookmark', 'list', keyword] as const,
    detail: (id: number) => ['bookmark', 'detail', id] as const,
  },
} as const;
