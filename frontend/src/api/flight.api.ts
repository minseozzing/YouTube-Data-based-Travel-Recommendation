import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import {
  MonthlyFlightSchema,
  DailyFlightSchema,
  FlightInfoSchema,
  MonthlyDailyPriceSchema,
} from '@/schemas/flight.schema';
import { z } from 'zod';

const MonthlyFlightApiSchema = ApiResponseSchema(MonthlyFlightSchema);
const DailyFlightListApiSchema = ApiResponseSchema(z.array(DailyFlightSchema));
const FlightInfoApiSchema = ApiResponseSchema(FlightInfoSchema);
const MonthlyDailyPriceListApiSchema = ApiResponseSchema(z.array(MonthlyDailyPriceSchema));

export const flightApi = {
  // GET 월별 항공권 최저가
  getMonthlyFlight: async (cityId: number, year: number, month: number) => {
    const { data } = await axiosInstance.get(`/api/flight/${cityId}/monthly`, {
      params: { year, month },
    });
    return MonthlyFlightApiSchema.parse(data).data;
  },

  // GET 일자별 최근 크롤링 30일 가격
  getDailyFlights: async (cityId: number, date: string) => {
    const { data } = await axiosInstance.get(`/api/flight/${cityId}/daily`, {
      params: { date },
    });
    return DailyFlightListApiSchema.parse(data).data;
  },

  // GET 도시 비행시간 숙박비
  getFlightInfo: async (cityId: number) => {
    const { data } = await axiosInstance.get(`/api/flight/${cityId}/info`);
    return FlightInfoApiSchema.parse(data).data;
  },

  // GET 월별 모든 일일 가격
  getMonthlyAllDailyPrices: async (cityId: number, year: number, month: number) => {
    const { data } = await axiosInstance.get(`/api/flight/${cityId}/monthly-daily`, {
      params: { year, month },
    });
    return MonthlyDailyPriceListApiSchema.parse(data).data;
  },
};
