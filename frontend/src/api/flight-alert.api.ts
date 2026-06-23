import { axiosInstance } from './axiosInstance';
import { z } from 'zod';
import {
  FlightAlertSubscriptionSchema,
  FlightAlertNotificationsPageSchema,
} from '@/schemas/flight-alert.schema';
import {
  mockGetSubscriptions,
  mockUpsertSubscription,
  mockDeleteSubscription,
} from '@/mocks/flightAlertMocks';

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 * 알림 발송(가격 매칭) 시뮬레이션은 제공하지 않으며 알림 목록은 항상 빈 값입니다.
 */
const USE_MOCK_FLIGHT_ALERT_API = true;

export const flightAlertApi = {
  getSubscriptions: async () => {
    if (USE_MOCK_FLIGHT_ALERT_API) return z.array(FlightAlertSubscriptionSchema).parse(mockGetSubscriptions());
    const { data } = await axiosInstance.get('/api/flight-alerts/subscriptions');
    return z.array(FlightAlertSubscriptionSchema).parse(data);
  },

  upsertSubscription: async (cityId: number, thresholdPrice: number) => {
    if (USE_MOCK_FLIGHT_ALERT_API) return FlightAlertSubscriptionSchema.parse(mockUpsertSubscription(cityId, thresholdPrice));
    const { data } = await axiosInstance.put(
      `/api/flight-alerts/subscriptions/${cityId}`,
      { thresholdPrice },
    );
    return FlightAlertSubscriptionSchema.parse(data);
  },

  deleteSubscription: async (cityId: number) => {
    if (USE_MOCK_FLIGHT_ALERT_API) return mockDeleteSubscription(cityId);
    const { data } = await axiosInstance.delete(
      `/api/flight-alerts/subscriptions/${cityId}`,
    );
    return data as { message: string; id: number };
  },

  getNotifications: async (params?: { page?: number; size?: number }) => {
    if (USE_MOCK_FLIGHT_ALERT_API) {
      return FlightAlertNotificationsPageSchema.parse({
        content: [], page: params?.page ?? 0, size: params?.size ?? 10, totalElements: 0, totalPages: 1, hasNext: false,
      });
    }
    const { data } = await axiosInstance.get('/api/flight-alerts/notifications', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        sort: 'createdAt,desc',
      },
    });
    return FlightAlertNotificationsPageSchema.parse(data);
  },

  getUnreadCount: async () => {
    if (USE_MOCK_FLIGHT_ALERT_API) return { count: 0 };
    const { data } = await axiosInstance.get(
      '/api/flight-alerts/notifications/unread-count',
    );
    return z.object({ count: z.number() }).parse(data);
  },

  markRead: async (notificationId: number) => {
    if (USE_MOCK_FLIGHT_ALERT_API) return { message: 'ok', id: notificationId };
    const { data } = await axiosInstance.patch(
      `/api/flight-alerts/notifications/${notificationId}/read`,
    );
    return data as { message: string; id: number };
  },
};
