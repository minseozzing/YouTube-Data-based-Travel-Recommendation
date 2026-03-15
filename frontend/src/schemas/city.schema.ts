import { z } from 'zod';

// ── CityListItem: GET /api/city (AllCitiesResponse) 매핑 결과 ──────────────
// 백엔드: { id, name, countryName, imgUrl, expectedBudgetFor1day, danger(object), lat, lon }
// api.ts에서 id→cityId, name→cityName, lat→latitude, lon→longitude, expectedBudgetFor1day→estimatedBudget 변환
export const CityListItemSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryName: z.string(),
  imgUrl: z.string(),
  estimatedBudget: z.number(),
  riskLevel: z.number().min(0).max(5), // danger object에서 파생
  latitude: z.number(),
  longitude: z.number(),
  matchingScore: z.number().min(0).max(100).optional(),
});
export type CityListItem = z.infer<typeof CityListItemSchema>;

// ── CountryDanger: 백엔드 CountryDanger { level, description } ────────────
export const CountryDangerItemSchema = z.object({
  level: z.string(),
  description: z.string(),
});

// ── CountryDangerResponse: 백엔드 { countryName, items } ──────────────────
export const CountryDangerSchema = z.object({
  countryName: z.string(),
  items: z.array(CountryDangerItemSchema),
});
export type CountryDanger = z.infer<typeof CountryDangerSchema>;

// ── Score: 백엔드 Score { finalScore, budgetScore, safetyScore, tagMatchScore, newPenaltyScore } ──
export const CityScoreSchema = z.object({
  finalScore: z.number().nullable().optional(),
  budgetScore: z.number().nullable().optional(),
  safetyScore: z.number().nullable().optional(),
  tagMatchScore: z.number().nullable().optional(),
  newPenaltyScore: z.number().nullable().optional(),
});

// ── LivingCostFor1Day: 백엔드 { food, transportation } ──────────────────
export const LivingCostFor1DaySchema = z.object({
  food: z.number(),
  transportation: z.number(),
});

// ── AirTicketAndHotel: 백엔드 { airTicket, hotel } ───────────────────────
export const AirTicketAndHotelSchema = z.object({
  airTicket: z.number(),
  hotel: z.number(),
});

// ── NewsItem: 백엔드 { title, url, content, description, urlToImage, publishedAt } ──
export const NewsItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  urlToImage: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

// ── News: 백엔드 { summation, top3 } ─────────────────────────────────────
export const NewsSchema = z.object({
  summation: z.string().nullable().optional(),
  top3: z.array(NewsItemSchema).optional(),
});

// ── Tag: 백엔드 { name, tagScore } ────────────────────────────────────────
export const TagSchema = z.object({
  name: z.string(),
  tagScore: z.number().nullable().optional(),
});

// ── TouristSpot: 백엔드 { name, description, lat, lon, imageUrl } ─────────
export const TouristSpotSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lon: z.number().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

// ── CityDetail: GET /api/city/{id}?recommend=true|false 결과 ─────────────
// cityId, countryId, countryName, imgUrl, latitude, longitude는 api.ts에서 보완
export const CityDetailSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryId: z.number(),
  countryName: z.string(),
  imgUrl: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  // 추천 모드 (RecommendCityDetailResponse)
  score: CityScoreSchema.nullable().optional(),
  recommendationReason: z.string().nullable().optional(),
  livingCostFor1Day: LivingCostFor1DaySchema.nullable().optional(),
  airTicketAndHotel: AirTicketAndHotelSchema.nullable().optional(),
  news: NewsSchema.nullable().optional(),
  danger: CountryDangerSchema.nullable().optional(),
  tags: z.array(TagSchema).optional(),
  touristSpot: z.array(TouristSpotSchema).optional(),
});
export type CityDetail = z.infer<typeof CityDetailSchema>;

export const RecommendRequestSchema = z.object({
  budget: z.number().positive(),
  duration: z.number().int().positive(),
});
export type RecommendRequest = z.infer<typeof RecommendRequestSchema>;
