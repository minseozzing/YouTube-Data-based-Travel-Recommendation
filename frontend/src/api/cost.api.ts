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
import { z } from 'zod';

export const SEOUL_CITY_ID = 12;

const DUMMY_HISTORY_MAP = {
  d: DUMMY_EXCHANGE_RATE_HISTORY_D,
  w: DUMMY_EXCHANGE_RATE_HISTORY_W,
  m: DUMMY_EXCHANGE_RATE_HISTORY_M,
};

// ── API 응답 스키마 정의 (공통 래퍼 적용) ───────────────────────────────────
const CountryCostApiSchema = ApiResponseSchema(CountryCostSchema);
const CountryCostSummaryApiSchema = ApiResponseSchema(CountryCostSummarySchema);
const CityCostSummaryListApiSchema = ApiResponseSchema(z.array(CityCostSummarySchema));
const ExchangeRateApiSchema = ApiResponseSchema(ExchangeRateSchema);

const ExchangeRateNewApiSchema = ApiResponseSchema(ExchangeRateNewSchema);
const ExchangeRateHistoryApiSchema = ApiResponseSchema(ExchangeRateHistorySchema);
const CostDetailApiSchema = ApiResponseSchema(CostDetailSchema);
const CostCompareApiSchema = ApiResponseSchema(CostCompareSchema);

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
    // 서버가 없으므로 즉시 더미 반환
    console.log('[cost.api] (Offline Mode) returning dummy for getExchangeRateNew');
    return { ...DUMMY_EXCHANGE_RATE, target: currency };
  },

  // GET /api/exchange-rate/history?target_currency=XXX&type=D|W|M
  getExchangeRateHistory: async (
    targetCurrency: string,
    type: 'D' | 'W' | 'M',
  ): Promise<ExchangeRateHistory> => {
    console.log('[cost.api] (Offline Mode) returning dummy for getExchangeRateHistory');
    const dummy = DUMMY_HISTORY_MAP[type.toLowerCase() as 'd' | 'w' | 'm'];
    return { ...dummy, targetCurrency };
  },

  // GET /api/cost/detail?target_type=city|country&target_id=XXX
  getCostDetail: async (
    targetType: 'country' | 'city',
    targetId: number,
  ): Promise<CostDetail> => {
    console.log('[cost.api] (Offline Mode) returning dummy for getCostDetail');
    if (targetId === SEOUL_CITY_ID) return DUMMY_SEOUL_COST_DETAIL;
    
    return {
      ...DUMMY_COST_DETAIL,
      target: { ...DUMMY_COST_DETAIL.target, id: targetId },
    };
  },

  // GET /api/cost/compare?target_type=CITY&base_id=1&target_id=2
  getCostCompare: async (
    targetType: 'COUNTRY' | 'CITY',
    baseId: number,
    targetId: number,
  ): Promise<CostCompare> => {
    console.log('[cost.api] (Offline Mode) returning dummy for getCostCompare');
    return {
      ...DUMMY_COST_COMPARE,
      target: {
        ...DUMMY_COST_COMPARE.target,
        id: targetId,
      },
    };
  },
};
