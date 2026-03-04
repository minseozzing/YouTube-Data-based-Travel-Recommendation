import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import MainPage from '@/pages/MainPage';

// search params 스키마 — URL 기반 탭 상태
const mainSearchSchema = z.object({
  tab: z.enum(['recommend', 'cost', 'flight', 'news']).default('recommend'),
});

export const Route = createFileRoute('/_authenticated/main')({
  validateSearch: mainSearchSchema,
  component: MainPage,
});
