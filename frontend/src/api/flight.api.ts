import { axiosInstance } from './axiosInstance';
import {
  FlightApiResponseSchema,
  CitySummarySchema,
  FlightCalendarSchema,
  FlightTrendSchema,
  type CitySummary,
  type FlightCalendar,
  type FlightTrend,
} from '@/schemas/flight.schema';
import {
  getMockCitySummary,
  getMockFlightCalendar,
  getMockFlightTrend,
} from '@/mocks/flightMocks';

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 */
const USE_MOCK_FLIGHT_API = true;

export const flightApi = {
  // GET /api/cities/{cityId}/summary?year_month=YYYY-MM
  getCitySummary: async (cityId: number, yearMonth: string): Promise<CitySummary> => {
    if (USE_MOCK_FLIGHT_API) return getMockCitySummary(cityId, yearMonth);
    const { data } = await axiosInstance.get(`/api/cities/${cityId}/summary`, {
      params: { year_month: yearMonth },
    });
    return FlightApiResponseSchema(CitySummarySchema).parse(data).data;
  },

  // GET /api/flights/calendar/{cityId}?year_month=YYYY-MM
  // 각 날짜에 history(오늘/어제/1주전/2주전 수집가) 포함
  getFlightCalendar: async (cityId: number, yearMonth: string): Promise<FlightCalendar> => {
    if (USE_MOCK_FLIGHT_API) return getMockFlightCalendar(cityId, yearMonth);
    const { data } = await axiosInstance.get(`/api/flights/calendar/${cityId}`, {
      params: { year_month: yearMonth },
    });
    return FlightApiResponseSchema(FlightCalendarSchema).parse(data).data;
  },

  // GET /api/flights/trend/{cityId}
  getFlightTrend: async (cityId: number): Promise<FlightTrend> => {
    if (USE_MOCK_FLIGHT_API) return getMockFlightTrend(cityId);
    const { data } = await axiosInstance.get(`/api/flights/trend/${cityId}`);
    return FlightApiResponseSchema(FlightTrendSchema).parse(data).data;
  },
};
