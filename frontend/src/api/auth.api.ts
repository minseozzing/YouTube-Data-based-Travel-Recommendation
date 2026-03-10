import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import {
  AuthCallbackResponseSchema,
  TokenReissueResponseSchema,
  GoogleLoginUrlResponseSchema,
  PreferenceTagRequestSchema,
  YoutubeStatusSchema,
} from '@/schemas/auth.schema';
import type { PreferenceTagRequest } from '@/schemas/auth.schema';

const GoogleLoginUrlApiSchema = ApiResponseSchema(GoogleLoginUrlResponseSchema);
const AuthCallbackApiSchema = ApiResponseSchema(AuthCallbackResponseSchema);
const TokenReissueApiSchema = ApiResponseSchema(TokenReissueResponseSchema);
const YoutubeStatusApiSchema = ApiResponseSchema(YoutubeStatusSchema);

export const authApi = {
  // GET /api/auth/google/login-url
  getGoogleLoginUrl: async () => {
    const { data } = await axiosInstance.get('/api/auth/google/login-url');
    return GoogleLoginUrlApiSchema.parse(data).data;
  },

  // POST /api/auth/exchange (토큰 교환)
  exchangeCode: async (code: string) => {
    const { data } = await axiosInstance.post('/api/auth/exchange', { code });
    return AuthCallbackApiSchema.parse(data).data;
  },

  // POST /api/auth/reissue
  reissueToken: async () => {
    const { data } = await axiosInstance.post('/api/auth/reissue');
    return TokenReissueApiSchema.parse(data).data;
  },

  // POST /api/auth/logout
  logout: async () => {
    await axiosInstance.post('/api/auth/logout');
  },

  // DELETE /api/auth/withdraw
  withdraw: async () => {
    await axiosInstance.delete('/api/auth/withdraw');
  },

  // POST /api/members/tag
  submitPreference: async (body: PreferenceTagRequest) => {
    PreferenceTagRequestSchema.parse(body);
    await axiosInstance.post('/api/members/tag', body);
  },

  // PATCH /api/members/tag
  updatePreference: async (body: PreferenceTagRequest) => {
    PreferenceTagRequestSchema.parse(body);
    await axiosInstance.patch('/api/members/tag', body);
  },

  // GET /api/members/youtube/status
  getYoutubeStatus: async () => {
    const { data } = await axiosInstance.get('/api/members/youtube/status');
    return YoutubeStatusApiSchema.parse(data).data;
  },

  // GET /api/members/youtube/tag
  getYoutubeConsentUrl: async () => {
    const { data } = await axiosInstance.get('/api/members/youtube/tag');
    return GoogleLoginUrlApiSchema.parse(data).data;
  },
};
