import { z } from 'zod';

// 1인 생활비 상세
export const OnePersonCostSchema = z.object({
  totalWithRent: z.number(),
  withoutRent: z.number(),
  rentAndUtilities: z.number(),
  food: z.number(),
  transport: z.number(),
});
export type OnePersonCost = z.infer<typeof OnePersonCostSchema>;

// 4인 가족 생활비
export const FamilyOf4CostSchema = z.object({
  totalWithRent: z.number(),
});
export type FamilyOf4Cost = z.infer<typeof FamilyOf4CostSchema>;

// 물가 메타 정보
export const CostMetaSchema = z.object({
  lastUpdatedAt: z.string().datetime(),
  source: z.string(),
});

// 국가 물가 상세
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

// 국가 물가 요약
export const CountryCostSummarySchema = z.object({
  countryId: z.number(),
  countryName: z.string(),
  currency: z.string(),
  avgMonthlyCost: z.number(),
  costIndex: z.number().optional(),
});
export type CountryCostSummary = z.infer<typeof CountryCostSummarySchema>;

// 도시 물가 요약
export const CityCostSummarySchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  avgMonthlyCost: z.number(),
  currency: z.string(),
});
export type CityCostSummary = z.infer<typeof CityCostSummarySchema>;

// 환율
export const ExchangeRateSchema = z.object({
  baseCurrency: z.string(),
  targetCurrency: z.string(),
  rate: z.number(),
  updatedAt: z.string().datetime(),
});
export type ExchangeRate = z.infer<typeof ExchangeRateSchema>;
