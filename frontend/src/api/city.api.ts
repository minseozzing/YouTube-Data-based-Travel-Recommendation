import { axiosInstance } from './axiosInstance';
import { RecommendRequestSchema } from '@/schemas/city.schema';
import type { CityDetail } from '@/schemas/city.schema';
import { z } from 'zod';

const BackendCitySchema = z.object({
  id: z.number(),
  name: z.string(),
  countryName: z.string(),
  imgUrl: z.string().nullable(),
  expectedBudgetFor1day: z.number().nullable(),
  danger: z.string().nullable(),
  lat: z.number().nullable(),
  lon: z.number().nullable(),
});

const dangerToRiskLevel = (danger: string | null): number => {
  if (!danger) return 1;
  if (danger.includes('자제')) return 4;
  if (danger.includes('주의')) return 3;
  if (danger.includes('유의')) return 2;
  return 1;
};

const BackendLivingCostSchema = z.object({
  food: z.number(),
  transportation: z.number(),
});

const BackendAirTicketAndHotelSchema = z.object({
  airTicket: z.number(),
  hotel: z.number(),
});

const BackendTagResponseSchema = z.object({
  name: z.string(),
  tagScore: z.number().nullable().optional(),
});

const BackendNewsItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  content: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  urlToImage: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

const BackendRecommendDetailSchema = z.object({
  name: z.string(),
  score: z.object({
    finalScore: z.number().nullable().optional(),
    budgetScore: z.number().nullable().optional(),
    safetyScore: z.number().nullable().optional(),
    tagMatchScore: z.number().nullable().optional(),
    newPenaltyScore: z.number().nullable().optional(),
  }).nullable().optional(),
  recommendationReason: z.string().nullable().optional(),
  livingCostFor1Day: BackendLivingCostSchema.nullable().optional(),
  airTicketAndHotel: BackendAirTicketAndHotelSchema.nullable().optional(),
  news: z.object({
    summation: z.string().nullable().optional(),
    top3: z.array(BackendNewsItemSchema).optional(),
  }).nullable().optional(),
  danger: z.string().nullable().optional(),
  tags: z.array(BackendTagResponseSchema).optional(),
  touristSpot: z.array(z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    lat: z.number().nullable().optional(),
    lon: z.number().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
  })).optional(),
});

const BackendNotRecommendDetailSchema = z.object({
  name: z.string(),
  livingCostFor1Day: BackendLivingCostSchema.nullable().optional(),
  airTicketAndHotel: BackendAirTicketAndHotelSchema.nullable().optional(),
  danger: z.string().nullable().optional(),
  tags: z.array(BackendTagResponseSchema).optional(),
});

export const cityApi = {
  // GET /api/city
  getList: async (params?: { lat?: number; lng?: number; query?: string }) => {
    const { data } = await axiosInstance.get('/api/city', { params });
    return z.array(BackendCitySchema).parse(data).map((city) => ({
      cityId: city.id,
      cityName: city.name,
      countryName: city.countryName,
      imgUrl: city.imgUrl ?? '',
      estimatedBudget: (city.expectedBudgetFor1day ?? 0) * 7,
      riskLevel: dangerToRiskLevel(city.danger),
      latitude: city.lat ?? 0,
      longitude: city.lon ?? 0,
      matchingScore: undefined,
    }));
  },

  // GET /api/city/{cityId}?recommend=true|false
  getDetail: async (cityId: number, recommend: boolean): Promise<CityDetail> => {
    const { data } = await axiosInstance.get(`/api/city/${cityId}`, { params: { recommend } });

    if (recommend) {
      const city = BackendRecommendDetailSchema.parse(data);
      const lc = city.livingCostFor1Day;
      const at = city.airTicketAndHotel;
      return {
        cityId,
        cityName: city.name,
        countryId: 0,
        countryName: '',
        imgUrl: '',
        matchingScore: city.score?.finalScore ?? undefined,
        recommendReason: city.recommendationReason ?? undefined,
        livingCostFor1Day: lc
          ? { food: lc.food, transportation: lc.transportation, accommodation: at?.hotel ?? 0 }
          : undefined,
        dailyCost: lc ? lc.food + lc.transportation : undefined,
        flightPrice: at?.airTicket,
        news: city.news
          ? {
              summation: city.news.summation ?? '',
              top3: (city.news.top3 ?? []).map((item) => ({
                title: item.title,
                url: item.url,
                createdAt: item.publishedAt ?? '',
              })),
            }
          : undefined,
        danger: city.danger ?? undefined,
        tags: city.tags?.map((t) => ({ name: t.name })),
        keywords: city.tags?.map((t) => t.name),
        latitude: 0,
        longitude: 0,
      };
    } else {
      const city = BackendNotRecommendDetailSchema.parse(data);
      const lc = city.livingCostFor1Day;
      const at = city.airTicketAndHotel;
      return {
        cityId,
        cityName: city.name,
        countryId: 0,
        countryName: '',
        imgUrl: '',
        livingCostFor1Day: lc
          ? { food: lc.food, transportation: lc.transportation, accommodation: at?.hotel ?? 0 }
          : undefined,
        dailyCost: lc ? lc.food + lc.transportation : undefined,
        flightPrice: at?.airTicket,
        danger: city.danger ?? undefined,
        tags: city.tags?.map((t) => ({ name: t.name })),
        keywords: city.tags?.map((t) => t.name),
        latitude: 0,
        longitude: 0,
      };
    }
  },

  // POST /api/recommend
  recommend: async (body: { budget: number; duration: number }) => {
    RecommendRequestSchema.parse(body);
    const { data } = await axiosInstance.post('/api/recommend', body);
    return z.array(BackendCitySchema).parse(data).map((city) => ({
      cityId: city.id,
      cityName: city.name,
      countryName: city.countryName,
      imgUrl: city.imgUrl ?? '',
      estimatedBudget: (city.expectedBudgetFor1day ?? 0) * 7,
      riskLevel: dangerToRiskLevel(city.danger),
      latitude: city.lat ?? 0,
      longitude: city.lon ?? 0,
      matchingScore: undefined,
    }));
  },
};
