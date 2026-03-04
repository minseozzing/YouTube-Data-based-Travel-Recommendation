import { z } from 'zod';

// 사용자 정보
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  profileImageUrl: z.string(),
  hasCompletedPreference: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;

// 로그인/콜백 응답
export const AuthCallbackResponseSchema = z.object({
  accessToken: z.string(),
  user: UserSchema,
});
export type AuthCallbackResponse = z.infer<typeof AuthCallbackResponseSchema>;

// 토큰 재발급 응답
export const TokenReissueResponseSchema = z.object({
  accessToken: z.string(),
});
export type TokenReissueResponse = z.infer<typeof TokenReissueResponseSchema>;

// Google 로그인 URL 응답
export const GoogleLoginUrlResponseSchema = z.object({
  loginUrl: z.string().url(),
});
export type GoogleLoginUrlResponse = z.infer<typeof GoogleLoginUrlResponseSchema>;

// 선호도 태그 요청
export const PreferenceTagRequestSchema = z.object({
  tags: z.array(z.string()),
});
export type PreferenceTagRequest = z.infer<typeof PreferenceTagRequestSchema>;

// YouTube 연동 상태
export const YoutubeStatusSchema = z.object({
  connected: z.boolean(),
  channelId: z.string().optional(),
});
export type YoutubeStatus = z.infer<typeof YoutubeStatusSchema>;
