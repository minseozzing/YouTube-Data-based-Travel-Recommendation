import { z } from 'zod';

// ── Legacy schemas (kept for backward compatibility) ─────────────────────────

export const OnePersonCostSchema = z.object({
  totalWithRent: z.number(),
  withoutRent: z.number(),
  rentAndUtilities: z.number(),
  food: z.number(),
  transport: z.number(),
});
export type OnePersonCost = z.infer<typeof OnePersonCostSchema>;

export const FamilyOf4CostSchema = z.object({
  totalWithRent: z.number(),
});
export type FamilyOf4Cost = z.infer<typeof FamilyOf4CostSchema>;

export const CostMetaSchema = z.object({
  lastUpdatedAt: z.string().datetime(),
  source: z.string(),
});

export const CountryCostSchema = z.object({
  countryId: z.number(),
  currency: z.string(),
  onePerson: OnePersonCostSchema,
  familyOf4: FamilyOf4CostSchema,
  salaryAfterTaxMedian: z.number(),
  population: z.number(),
  meta: CostMetaSchema,
});
export type CountryCost = z.infer<typeof CountryCostSchema>;

export const CountryCostSummarySchema = z.object({
  countryId: z.number(),
  countryName: z.string(),
  currency: z.string(),
  avgMonthlyCost: z.number(),
  costIndex: z.number().optional(),
});
export type CountryCostSummary = z.infer<typeof CountryCostSummarySchema>;

export const CityCostSummarySchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  avgMonthlyCost: z.number(),
  currency: z.string(),
});
export type CityCostSummary = z.infer<typeof CityCostSummarySchema>;

export const ExchangeRateSchema = z.object({
  baseCurrency: z.string(),
  targetCurrency: z.string(),
  rate: z.number(),
  updatedAt: z.string().datetime(),
});
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;

// ── New API schemas (Costapi.md) ──────────────────────────────────────────────

// A. GET /api/exchange-rate
export const ExchangeRateNewSchema = z.object({
  base: z.string(),
  target: z.string(),
  rate: z.number(),
  asOf: z.string(),
  meta: z.object({
    lastUpdatedAt: z.string(),
    source: z.string(),
  }),
});
export type ExchangeRateNew = z.infer<typeof ExchangeRateNewSchema>;

// B. GET /api/exchange-rate/history
export const ExchangeRateTrendItemSchema = z.object({
  date: z.string(),
  rate_1krw_to_target: z.number(),
  krw_per_1target: z.number(),
});
export type ExchangeRateTrendItem = z.infer<typeof ExchangeRateTrendItemSchema>;

export const ExchangeRateLatestSchema = z.object({
  event_date: z.string(),
  rate_1krw_to_target: z.number(),
  krw_per_1target: z.number(),
  display_unit: z.number(),
  display_symbol: z.string(),
  krw_per_display_unit: z.number(),
});
export type ExchangeRateLatest = z.infer<typeof ExchangeRateLatestSchema>;

export const ExchangeRateHistorySchema = z.object({
  base_currency: z.string(),
  target_currency: z.string(),
  type: z.enum(['d', 'w', 'm']),
  latest: ExchangeRateLatestSchema,
  trend: z.array(ExchangeRateTrendItemSchema),
});
export type ExchangeRateHistory = z.infer<typeof ExchangeRateHistorySchema>;

// C. GET /api/cost/detail
export const CostEatingOutSchema = z.object({
  lunch_menu: z.number(),
  dinner_in_a_resturant_for_2: z.number(),
  fast_food_meal: z.number(),
  beer_in_a_pub: z.number(),
  cappuccino: z.number(),
  coke_pepsi: z.number(),
});
export type CostEatingOut = z.infer<typeof CostEatingOutSchema>;

export const CostTransportationSchema = z.object({
  local_transport_ticket: z.number(),
  monthly_ticket_local_transport: z.number(),
  taxi_ride: z.number(),
  gas_pterol: z.number(),
});
export type CostTransportation = z.infer<typeof CostTransportationSchema>;

export const CostGroceriesSchema = z.object({
  milk: z.number(),
  bread: z.number(),
  rice: z.number(),
  egg: z.number(),
  chicken: z.number(),
  steak: z.number(),
  apple: z.number(),
  banana: z.number(),
  orange: z.number(),
  tomato: z.number(),
  potato: z.number(),
  onion: z.number(),
  water: z.number(),
  coke: z.number(),
  wine: z.number(),
  beer: z.number(),
  cigarette: z.number(),
  cold_medicine: z.number(),
  shampoo: z.number(),
  toilet_paper: z.number(),
  toothpaste: z.number(),
});
export type CostGroceries = z.infer<typeof CostGroceriesSchema>;

export const CostOtherSchema = z.object({
  gym_month: z.number(),
  cinema_ticket: z.number(),
  haircut: z.number(),
  brand_jeans: z.number(),
  brand_sneakers: z.number(),
});
export type CostOther = z.infer<typeof CostOtherSchema>;

export const LivingCostSchema = z.object({
  id: z.number(),
  daily_budget: z.number(),
  without_rent: z.number(),
  food: z.number(),
  transport: z.number(),
  monthly_salary_after_tax: z.number(),
  population: z.number(),
  eating_out: CostEatingOutSchema,
  transportation: CostTransportationSchema,
  groceries: CostGroceriesSchema,
  other: CostOtherSchema,
  created_at: z.string(),
  updated_at: z.string(),
});
export type LivingCost = z.infer<typeof LivingCostSchema>;

export const CostTargetSchema = z.object({
  id: z.number(),
  name: z.string(),
  continent: z.string().optional(),
  currency: z.string(),
  img_url: z.string().optional(),
});
export type CostTarget = z.infer<typeof CostTargetSchema>;

export const CostDetailSchema = z.object({
  target_type: z.enum(['country', 'city']),
  target: CostTargetSchema,
  living_cost: LivingCostSchema,
});
export type CostDetail = z.infer<typeof CostDetailSchema>;

// D. GET /api/cost/compare/{city_id}
export const CompareItemSchema = z.object({
  item_key: z.string(),
  item_name: z.string(),
  seoul_price: z.number(),
  target_price: z.number(),
  difference_krw: z.number(),
  difference_percent: z.number(),
});
export type CompareItem = z.infer<typeof CompareItemSchema>;

export const CostCompareSchema = z.object({
  base_city: z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    currency: z.string(),
  }),
  target_city: z.object({
    id: z.number(),
    name: z.string(),
    country: z.string(),
    currency: z.string(),
  }),
  cost_vs_seoul: z.object({
    currency: z.string(),
    seoul_daily_budget: z.number(),
    target_daily_budget: z.number(),
    daily_budget_gap_krw: z.number(),
    daily_budget_gap_percent: z.number(),
    summary: z.string(),
  }),
  expected_daily_budget: z.object({
    currency: z.string(),
    total: z.number(),
    breakdown: z.object({
      food: z.number(),
      transport: z.number(),
      accommodation: z.number(),
    }),
    calculation_notes: z.array(z.string()),
  }),
  item_comparison: z.object({
    currency: z.string(),
    base_city: z.string(),
    target_city: z.string(),
    items: z.array(CompareItemSchema),
  }),
});
export type CostCompare = z.infer<typeof CostCompareSchema>;
