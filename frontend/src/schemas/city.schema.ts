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

export const CityDetailSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryId: z.number(),
  countryName: z.string(),
  imgUrl: z.string().url(),
  matchingScore: z.number().optional(),
  recommendReason: z.string().optional(),
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
