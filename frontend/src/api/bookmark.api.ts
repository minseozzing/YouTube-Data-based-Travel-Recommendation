import { axiosInstance } from './axiosInstance';
import { ApiResponseSchema } from '@/schemas/common.schema';
import {
  BookmarkListItemSchema,
  BookmarkDetailSchema,
  CreateBookmarkRequestSchema,
} from '@/schemas/bookmark.schema';
import type { CreateBookmarkRequest } from '@/schemas/bookmark.schema';
import { z } from 'zod';

const BookmarkListApiSchema = ApiResponseSchema(z.array(BookmarkListItemSchema));
const BookmarkDetailApiSchema = ApiResponseSchema(BookmarkDetailSchema);

export const bookmarkApi = {
  // GET /api/bookmarks?keyword=...
  getList: async (keyword?: string) => {
    const { data } = await axiosInstance.get('/api/bookmarks', {
      params: keyword ? { keyword } : undefined,
    });
    return BookmarkListApiSchema.parse(data).data;
  },

  // GET /api/bookmarks/{bookmarkId}
  getDetail: async (bookmarkId: number) => {
    const { data } = await axiosInstance.get(`/api/bookmarks/${bookmarkId}`);
    return BookmarkDetailApiSchema.parse(data).data;
  },

  // POST /api/bookmarks
  create: async (body: CreateBookmarkRequest) => {
    CreateBookmarkRequestSchema.parse(body);
    const { data } = await axiosInstance.post('/api/bookmarks', body);
    return data;
  },

  // DELETE /api/bookmarks/{bookmarkId}
  remove: async (bookmarkId: number) => {
    await axiosInstance.delete(`/api/bookmarks/${bookmarkId}`);
  },
};
