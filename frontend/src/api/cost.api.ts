import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import {
  CountryCostSchema,
  CountryCostSummarySchema,
  CityCostSummarySchema,
  ExchangeRateSchema,
  ExchangeRateNewSchema,
  ExchangeRateHistorySchema,
  CostDetailSchema,
  CostCompareSchema,
  type ExchangeRateNew,
  type ExchangeRateHistory,
  type CostDetail,
  type CostCompare,
} from '@/schemas/cost.schema';
import {
  DUMMY_EXCHANGE_RATE,
  DUMMY_EXCHANGE_RATE_HISTORY_D,
  DUMMY_EXCHANGE_RATE_HISTORY_W,
  DUMMY_EXCHANGE_RATE_HISTORY_M,
  DUMMY_COST_DETAIL,
  DUMMY_SEOUL_COST_DETAIL,
  DUMMY_COST_COMPARE,
} from '@/data/cost.dummy';

export const SEOUL_CITY_ID = 1;

const DUMMY_HISTORY_MAP = {
  d: DUMMY_EXCHANGE_RATE_HISTORY_D,
  w: DUMMY_EXCHANGE_RATE_HISTORY_W,
  m: DUMMY_EXCHANGE_RATE_HISTORY_M,
};
import { z } from 'zod';

const CountryCostApiSchema = ApiResponseSchema(CountryCostSchema);
const CountryCostSummaryApiSchema = ApiResponseSchema(CountryCostSummarySchema);
const CityCostSummaryListApiSchema = ApiResponseSchema(z.array(CityCostSummarySchema));
const ExchangeRateApiSchema = ApiResponseSchema(ExchangeRateSchema);

export const costApi = {
  // ── Legacy endpoints ───────────────────────────────────────────────────────

  getCountryCost: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}`);
    return CountryCostApiSchema.parse(data).data;
  },

  getCountryCostSummary: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}/summary`);
    return CountryCostSummaryApiSchema.parse(data).data;
  },

  getCityCostListByCountry: async (countryId: number) => {
    const { data } = await axiosInstance.get(`/api/cost/countries/${countryId}/cities`);
    return CityCostSummaryListApiSchema.parse(data).data;
  },

  getExchangeRate: async (baseCurrency: string, targetCurrency: string) => {
    const { data } = await axiosInstance.get('/api/cost/exchange', {
      params: { base: baseCurrency, target: targetCurrency },
    });
    return ExchangeRateApiSchema.parse(data).data;
  },

  // ── New endpoints (Costapi.md) ─────────────────────────────────────────────

  // GET /api/exchange-rate?currency=XXX
  getExchangeRateNew: async (currency: string): Promise<ExchangeRateNew> => {
    try {
      const { data } = await axiosInstance.get('/api/exchange-rate', {
        params: { currency },
      });
      return ExchangeRateNewSchema.parse(data);
    } catch (err) {
      console.warn('[cost.api] using dummy data for getExchangeRateNew', err);
      return DUMMY_EXCHANGE_RATE;
    }
  },

  // GET /api/exchange-rate/history?target_currency=XXX&type=D|W|M
  getExchangeRateHistory: async (
    targetCurrency: string,
    type: 'D' | 'W' | 'M',
  ): Promise<ExchangeRateHistory> => {
    try {
      const { data } = await axiosInstance.get('/api/exchange-rate/history', {
        params: { target_currency: targetCurrency, type },
      });
      return ExchangeRateHistorySchema.parse(data);
    } catch (err) {
      console.warn('[cost.api] using dummy data for getExchangeRateHistory', err);
      return DUMMY_HISTORY_MAP[type.toLowerCase() as 'd' | 'w' | 'm'];
    }
  },

  // GET /api/cost/detail?target_type=city|country&target_id=XXX
  getCostDetail: async (
    targetType: 'country' | 'city',
    targetId: number,
  ): Promise<CostDetail> => {
    try {
      const { data } = await axiosInstance.get('/api/cost/detail', {
        params: { target_type: targetType, target_id: targetId },
      });
      return CostDetailSchema.parse(data);
    } catch (err) {
      console.warn('[cost.api] using dummy data for getCostDetail', err);
      return targetId === SEOUL_CITY_ID ? DUMMY_SEOUL_COST_DETAIL : DUMMY_COST_DETAIL;
    }
  },

  // GET /api/cost/compare?target_type=CITY&base_id=1&target_id=2
  getCostCompare: async (
    targetType: 'COUNTRY' | 'CITY',
    baseId: number,
    targetId: number,
  ): Promise<CostCompare> => {
    try {
      const { data } = await axiosInstance.get('/api/cost/compare', {
        params: { target_type: targetType, base_id: baseId, target_id: targetId },
      });
      return CostCompareSchema.parse(data);
    } catch (err) {
      console.warn('[cost.api] using dummy data for getCostCompare', err);
      return DUMMY_COST_COMPARE;
    }
  },
};
