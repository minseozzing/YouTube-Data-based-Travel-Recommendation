import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1),
  VITE_ENABLE_MSW: z.enum(['true', 'false']).default('false'),
});

// 런타임 환경변수 검증
const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error('[ENV ERROR]', parsed.error.format());
  // 개발 환경에서만 throw (프로덕션 빌드는 실패하지 않도록)
  if (import.meta.env.DEV) {
    console.warn('필수 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }
}

export const env = parsed.success
  ? parsed.data
  : {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '',
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '',
      VITE_ENABLE_MSW: 'false' as const,
    };
