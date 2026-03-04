import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import AuthCallbackPage from '@/pages/AuthCallbackPage';

// Google OAuth 콜백에서 전달되는 search params
const callbackSearchSchema = z.object({
  code: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute('/auth/callback')({
  validateSearch: callbackSearchSchema,
  component: AuthCallbackPage,
});
