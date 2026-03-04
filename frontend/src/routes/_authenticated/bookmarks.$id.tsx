import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import BookmarkDetailPage from '@/pages/BookmarkDetailPage';

export const Route = createFileRoute('/_authenticated/bookmarks/$id')({
  params: {
    parse: (p) => ({ id: z.coerce.number().parse(p.id) }),
    stringify: (p) => ({ id: String(p.id) }),
  },
  component: BookmarkDetailPage,
});
