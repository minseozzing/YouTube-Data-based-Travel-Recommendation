import { z } from 'zod';

export const CityListItemSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryName: z.string(),
  imgUrl: z.string().url(),
  estimatedBudget: z.number(),
  riskLevel: z.number().min(0).max(5),
  latitude: z.number(),
  longitude: z.number(),
  matchingScore: z.number().min(0).max(100).optional(),
});
export type CityListItem = z.infer<typeof CityListItemSchema>;

// 하루 생활비 상세
export const LivingCostFor1DaySchema = z.object({
  food: z.number(),
  transportation: z.number(),
  accommodation: z.number(),
});

// 항공권 상세
export const AirTicketSchema = z.object({
  departAirTicket: z.number(),
  arriveAirTicket: z.number(),
});

// 뉴스 항목
export const NewsItemSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  createdAt: z.string(), // ISO timestamp
});

// 뉴스 요약 및 리스트
export const NewsSchema = z.object({
  summation: z.string(),
  top3: z.array(NewsItemSchema),
});

// 태그
export const TagSchema = z.object({
  name: z.string(),
});

export const CityDetailSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryId: z.number(),
  countryName: z.string(),
  imgUrl: z.string().url(),
  matchingScore: z.number().optional(),
  recommendReason: z.string().optional(),
  
  // recommendedapi.md 연동 필드
  livingCostFor1Day: LivingCostFor1DaySchema.optional(),
  airTicket: AirTicketSchema.optional(),
  news: NewsSchema.optional(),
  danger: z.string().optional(),
  tags: z.array(TagSchema).optional(),

  // 기존 호환성용 필드 (선택적 유지)
  keywords: z.array(z.string()).optional(),
  dailyCost: z.number().optional(),
  flightPrice: z.number().optional(),
  
  latitude: z.number(),
  longitude: z.number(),
});
export type CityDetail = z.infer<typeof CityDetailSchema>;

export const RecommendRequestSchema = z.object({
  budget: z.number().positive(),
  duration: z.number().int().positive(),
});
export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
