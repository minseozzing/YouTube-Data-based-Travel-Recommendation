import { z } from 'zod';

// 월별 항공권 최저가
export const MonthlyFlightSchema = z.object({
  year: z.number(),
  month: z.number(),
  minPrice: z.number(),
  currency: z.string(),
  origin: z.string(),
  destination: z.string(),
});
export type MonthlyFlight = z.infer<typeof MonthlyFlightSchema>;

// 일자별 항공권 가격
export const DailyFlightSchema = z.object({
  date: z.string(),
  price: z.number(),
  currency: z.string(),
  origin: z.string(),
  destination: z.string(),
  airline: z.string().optional(),
  flightDuration: z.number().optional(), // 분 단위
});
export type DailyFlight = z.infer<typeof DailyFlightSchema>;

// 비행 정보 (비행시간 + 숙박비)
export const FlightInfoSchema = z.object({
  cityId: z.number(),
  origin: z.string(),
  destination: z.string(),
  flightDurationMinutes: z.number(),
  avgAccommodationPerNight: z.number(),
  currency: z.string(),
});
export type FlightInfo = z.infer<typeof FlightInfoSchema>;

// 월별 모든 일일 가격
export const MonthlyDailyPriceSchema = z.object({
  date: z.string(),
  price: z.number(),
});
export type MonthlyDailyPrice = z.infer<typeof MonthlyDailyPriceSchema>;
