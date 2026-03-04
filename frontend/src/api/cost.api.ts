import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import {
  CountryCostSchema,
  CountryCostSummarySchema,
  CityCostSummarySchema,
  ExchangeRateSchema,
} from '@/schemas/cost.schema';
import { z } from 'zod';

const CountryCostApiSchema = ApiResponseSchema(CountryCostSchema);
const CountryCostSummaryApiSchema = ApiResponseSchema(CountryCostSummarySchema);
const CityCostSummaryListApiSchema = ApiResponseSchema(z.array(CityCostSummarySchema));
const ExchangeRateApiSchema = ApiResponseSchema(ExchangeRateSchema);

export const costApi = {
  // GET /api/cost/countries/{countryId}
  getCountryCost: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}`);
    return CountryCostApiSchema.parse(data).data;
  },

  // GET 국가 물가 요약 (엔드포인트 확정 시 업데이트)
  getCountryCostSummary: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}/summary`);
    return CountryCostSummaryApiSchema.parse(data).data;
  },

  // GET 국가 내 도시 물가 요약 리스트
  getCityCostListByCountry: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}/cities`);
    return CityCostSummaryListApiSchema.parse(data).data;
  },

  // GET 현재 환율
  getExchangeRate: async (baseCurrency: string, targetCurrency: string) => {
    const { data } = await axiosInstance.get('/api/cost/exchange', {
      params: { base: baseCurrency, target: targetCurrency },
    });
    return ExchangeRateApiSchema.parse(data).data;
  },
};
