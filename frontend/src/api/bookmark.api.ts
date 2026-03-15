import { axiosInstance } from "./axiosInstance";
import { ApiResponseSchema } from "@/schemas/common.schema";
import {
  BookmarkPageSchema,
  BookmarkDetailSchema,
  CreateBookmarkRequestSchema,
} from "@/schemas/bookmark.schema";
import type { CreateBookmarkRequest } from "@/schemas/bookmark.schema";

const BookmarkDetailApiSchema = ApiResponseSchema(BookmarkDetailSchema);

export interface BookmarkListParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const bookmarkApi = {
  // GET /api/bookmarks?keyword=&page=0&size=10&sort=id,desc
  getList: async ({
    keyword,
    page = 0,
    size = 10,
    sort = "id,desc",
  }: BookmarkListParams = {}) => {
    const res = await axiosInstance.get("/api/bookmarks", {
      params: { ...(keyword ? { keyword } : {}), page, size, sort },
    });
    const data = res.data;

    console.log(res);
    console.log(data);

    return BookmarkPageSchema.parse(data);
  },

  // GET /api/bookmarks/{bookmarkId}
  getDetail: async (bookmarkId: number) => {
    const { data } = await axiosInstance.get(`/api/bookmarks/${bookmarkId}`);
    console.log(data);
    return BookmarkDetailApiSchema.parse(data).data;
  },

  // POST /api/bookmarks
  create: async (body: CreateBookmarkRequest) => {
    CreateBookmarkRequestSchema.parse(body);
    const { data } = await axiosInstance.post("/api/bookmarks", body);
    return data;
  },

  // DELETE /api/bookmarks/{bookmarkId}
  remove: async (bookmarkId: number) => {
    await axiosInstance.delete(`/api/bookmarks/${bookmarkId}`);
  },
};
