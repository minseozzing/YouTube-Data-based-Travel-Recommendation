import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import { NewsItemSchema } from '@/schemas/news.schema';
import { z } from 'zod';

const NewsListApiSchema = ApiResponseSchema(z.array(NewsItemSchema));

export const newsApi = {
  // GET /api/news/{countryId}
  getNewsByCountry: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/news/${countryId}`);
    return NewsListApiSchema.parse(data).data;
  },
};
