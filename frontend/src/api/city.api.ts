import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import { CityListItemSchema, CityDetailSchema, RecommendRequestSchema } from '@/schemas/city.schema';
import { z } from 'zod';

const CityListResponseSchema = ApiResponseSchema(z.array(CityListItemSchema));
const CityDetailResponseSchema = ApiResponseSchema(CityDetailSchema);

export const cityApi = {
  // GET /api/city
  getList: async (params?: { lat?: number; lng?: number; query?: string }) => {
    const { data } = await axiosInstance.get('/api/city', { params });
    return CityListResponseSchema.parse(data).data;
  },

  // GET /api/city/{cityId}
  getDetail: async (cityId: number) => {
    const { data } = await axiosInstance.get(`/api/city/${cityId}`);
    return CityDetailResponseSchema.parse(data).data;
  },

  // POST /api/recommend
  recommend: async (body: { budget: number; duration: number }) => {
    RecommendRequestSchema.parse(body); // 요청 검증
    const { data } = await axiosInstance.post('/api/recommend', body);
    return CityListResponseSchema.parse(data).data;
  },
};
