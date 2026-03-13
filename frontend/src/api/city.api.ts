import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import { CityDetailSchema, RecommendRequestSchema } from '@/schemas/city.schema';
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

const CityDetailResponseSchema = ApiResponseSchema(CityDetailSchema);

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

  // GET /api/city/{cityId}
  getDetail: async (cityId: number) => {
    const { data } = await axiosInstance.get(`/api/city/${cityId}`);
    return CityDetailResponseSchema.parse(data).data;
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
