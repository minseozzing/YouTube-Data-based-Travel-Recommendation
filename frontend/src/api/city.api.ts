import { axiosInstance } from "./axiosInstance";
import type { CityDetail } from "@/schemas/city.schema";
import { z } from "zod";

// 백엔드 CountryDanger { level, description }
const BackendCountryDangerItemSchema = z.object({
  level: z.string(),
  description: z.string(),
});

// 백엔드 CountryDangerResponse { countryName, items }
const BackendCountryDangerSchema = z
  .object({
    countryName: z.string(),
    items: z.array(BackendCountryDangerItemSchema),
  })
  .nullable()
  .optional();

// GET /api/city → AllCitiesResponse
const BackendCitySchema = z.object({
  id: z.number(),
  name: z.string(),
  imgUrl: z.string().nullable(),
  expectedBudgetFor1day: z.number().nullable(),
  danger: BackendCountryDangerSchema,
  lat: z.number().nullable(),
  lon: z.number().nullable(),
});

// danger 문자열에서 riskLevel 파생
const dangerToRiskLevel = (
  danger:
    | { countryName: string; items: { level: string; description: string }[] }
    | null
    | undefined,
): number => {
  if (!danger || danger.items.length === 0) return 1;
  const levels = danger.items.map((item) => item.level);
  if (levels.some((l) => l.includes("자제"))) return 4;
  if (levels.some((l) => l.includes("주의"))) return 3;
  if (levels.some((l) => l.includes("유의"))) return 2;
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

const BackendTouristSpotSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lon: z.number().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

// GET /api/city/{id}?recommend=true → RecommendCityDetailResponse
const BackendRecommendDetailSchema = z.object({
  name: z.string(),
  score: z
    .object({
      finalScore: z.number().nullable().optional(),
      budgetScore: z.number().nullable().optional(),
      safetyScore: z.number().nullable().optional(),
      tagMatchScore: z.number().nullable().optional(),
      newPenaltyScore: z.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  recommendationReason: z.string().nullable().optional(),
  livingCostFor1Day: BackendLivingCostSchema.nullable().optional(),
  airTicketAndHotel: BackendAirTicketAndHotelSchema.nullable().optional(),
  news: z
    .object({
      summation: z.string().nullable().optional(),
      top3: z.array(BackendNewsItemSchema).optional(),
    })
    .nullable()
    .optional(),
  danger: BackendCountryDangerSchema,
  tags: z.array(BackendTagResponseSchema).optional(),
  touristSpot: z.array(BackendTouristSpotSchema).optional(),
});

// GET /api/city/{id}?recommend=false → NotRecommendCityDetailResponse
const BackendNotRecommendDetailSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  livingCostFor1Day: BackendLivingCostSchema.nullable().optional(),
  airTicketAndHotel: BackendAirTicketAndHotelSchema.nullable().optional(),
  danger: BackendCountryDangerSchema,
  tags: z.array(BackendTagResponseSchema).optional(),
});

export const cityApi = {
  // GET /api/city
  getList: async (params?: { lat?: number; lng?: number; query?: string }) => {
    const { data } = await axiosInstance.get("/api/city", { params });
    return z
      .array(BackendCitySchema)
      .parse(data)
      .map((city) => ({
        cityId: city.id,
        cityName: city.name,
        countryName: city.danger?.countryName ?? "",
        imgUrl: city.imgUrl ?? "",
        estimatedBudget: (city.expectedBudgetFor1day ?? 0) * 7,
        riskLevel: dangerToRiskLevel(city.danger),
        latitude: city.lat ?? 0,
        longitude: city.lon ?? 0,
        matchingScore: undefined,
      }));
  },

  // GET /api/city/{cityId}?recommend=true|false
  getDetail: async (
    cityId: number,
    recommend: boolean,
    recommendParams?: {
      selectedTags: string[];
      userDailyBudget: number;
      travelDays: number;
      month: number;
    },
  ): Promise<CityDetail> => {
    const { data } = await axiosInstance.get(`/api/city/${cityId}`, {
      params: recommend && recommendParams
        ? { recommend, ...recommendParams }
        : { recommend },
      timeout: recommend ? 60_000 : 10_000,
    });

    if (recommend) {
      const city = BackendRecommendDetailSchema.parse(data);
      return {
        cityId,
        cityName: city.name,
        countryId: 0,
        countryName: "",
        imgUrl: "",
        latitude: 0,
        longitude: 0,
        score: city.score ?? undefined,
        recommendationReason: city.recommendationReason ?? undefined,
        livingCostFor1Day: city.livingCostFor1Day ?? undefined,
        airTicketAndHotel: city.airTicketAndHotel ?? undefined,
        news: city.news ?? undefined,
        danger: city.danger ?? undefined,
        tags: city.tags,
        touristSpot: city.touristSpot,
      };
    } else {
      const city = BackendNotRecommendDetailSchema.parse(data);
      return {
        cityId,
        cityName: city.name,
        countryId: 0,
        countryName: "",
        imgUrl: "",
        latitude: 0,
        longitude: 0,
        livingCostFor1Day: city.livingCostFor1Day ?? undefined,
        airTicketAndHotel: city.airTicketAndHotel ?? undefined,
        danger: city.danger ?? undefined,
        tags: city.tags,
      };
    }
  },

  // POST /api/recommend → RecommendCitySummaryResponse
  recommend: async (body: {
    selectedTags: string[];
    userDailyBudget: number;
    travelDays: number;
    month: number;
  }) => {
    const BackendRecommendResponseSchema = z.object({
      requestContext: z.object({
        selectedTags: z.array(z.string()),
        userDailyBudget: z.number(),
        travelDays: z.number(),
        month: z.number(),
      }).optional(),
      recommendations: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          imgUrl: z.string().nullable().optional(),
          expectedBudgetFor1day: z.number().nullable().optional(),
          danger: BackendCountryDangerSchema,
          lat: z.number().nullable().optional(),
          lon: z.number().nullable().optional(),
        }),
      ),
    });
    const { data } = await axiosInstance.post("/api/recommend", body);
    const parsed = BackendRecommendResponseSchema.parse(data);
    return parsed.recommendations.map((item, index) => ({
      rank: index + 1,
      country: item.danger?.countryName ?? "",
      city: item.name,
      totalScore: 0,
      reason: null,
    }));
  },
};
