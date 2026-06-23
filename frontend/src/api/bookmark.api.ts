import { axiosInstance } from "./axiosInstance";
import {
  BookmarkPageSchema,
  BookmarkDetailSchema,
  CreateBookmarkRequestSchema,
} from "@/schemas/bookmark.schema";
import type { BookmarkDetail, CreateBookmarkRequest } from "@/schemas/bookmark.schema";
import {
  mockBookmarkCreate,
  mockBookmarkList,
  mockBookmarkGetRaw,
  mockBookmarkUpdateTitle,
  mockBookmarkRemove,
} from "@/mocks/bookmarkMocks";

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 * mock 모드에서는 localStorage 기반 in-memory 저장소를 사용합니다.
 */
const USE_MOCK_BOOKMARK_API = true;

export interface BookmarkListParams {
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBookmarkDetail(data: any): BookmarkDetail {
  const json = data.json ?? {};

  const newsAtSaved = json.news?.top3
    ?.filter((n: { url?: string }) => !!n.url)
    .map((n: { title: string; url: string; description?: string; urlToImage?: string; publishedAt?: string }) => ({
      title: n.title,
      url: n.url,
      description: n.description ?? undefined,
      urlToImage: n.urlToImage ?? undefined,
      publishedAt: n.publishedAt ?? undefined,
    }));

  return BookmarkDetailSchema.parse({
    cityId: json.cityId,
    cityName: json.cityName,
    countryName: json.countryName || json.danger?.countryName || '',
    imgUrl: json.imgUrl || null,
    createdAt: data.savedAt,
    title: data.title ?? null,
    matchingScore: json.score?.finalScore ?? undefined,
    exchangeAtSaved: {
      before: json.exchangeRate?.krwPerDisplayUnit ?? 0,
      current: data.currentExchange?.krwPerDisplayUnit ?? 0,
      currency: json.exchangeRate?.currency ?? undefined,
    },
    newsAtSaved: newsAtSaved?.length ? newsAtSaved : undefined,
    newsSummation: json.news?.summation ?? undefined,
    savedAirTicket: json.airTicketAndHotel?.airTicket ?? undefined,
    savedHotel: json.airTicketAndHotel?.hotel ?? undefined,
    recommendationReason: json.recommendationReason ?? undefined,
    tags: json.tags?.map((t: { name: string }) => t.name) ?? undefined,
    dailyFood: json.livingCostFor1Day?.food ?? undefined,
    dailyTransport: json.livingCostFor1Day?.transportation ?? undefined,
    danger: json.danger ?? undefined,
    touristSpots: json.touristSpot?.map((s: { name: string; lat: number; lon: number }) => ({
      name: s.name,
      lat: s.lat,
      lon: s.lon,
    })) ?? undefined,
  });
}

export const bookmarkApi = {
  // GET /api/bookmarks?keyword=&page=0&size=10&sort=id,desc
  getList: async ({
    keyword,
    page = 0,
    size = 10,
    sort = "id,desc",
  }: BookmarkListParams = {}) => {
    if (USE_MOCK_BOOKMARK_API) return BookmarkPageSchema.parse(mockBookmarkList({ keyword, page, size }));
    const res = await axiosInstance.get("/api/bookmarks", {
      params: { ...(keyword ? { keyword } : {}), page, size, sort },
    });
    return BookmarkPageSchema.parse(res.data);
  },

  // GET /api/bookmarks/{bookmarkId}
  getDetail: async (bookmarkId: number): Promise<BookmarkDetail> => {
    if (USE_MOCK_BOOKMARK_API) return parseBookmarkDetail(mockBookmarkGetRaw(bookmarkId));
    const { data } = await axiosInstance.get(`/api/bookmarks/${bookmarkId}`);
    return parseBookmarkDetail(data);
  },

  // POST /api/bookmarks
  create: async (body: CreateBookmarkRequest) => {
    CreateBookmarkRequestSchema.parse(body);
    if (USE_MOCK_BOOKMARK_API) return mockBookmarkCreate(body);
    const { data } = await axiosInstance.post("/api/bookmarks", body);
    return data;
  },

  // PATCH /api/bookmarks/{bookmarkId} — 제목 수정
  updateTitle: async (bookmarkId: number, title: string): Promise<BookmarkDetail> => {
    if (USE_MOCK_BOOKMARK_API) return parseBookmarkDetail(mockBookmarkUpdateTitle(bookmarkId, title));
    const { data } = await axiosInstance.patch(`/api/bookmarks/${bookmarkId}`, { title });
    return parseBookmarkDetail(data);
  },

  // DELETE /api/bookmarks/{bookmarkId}
  remove: async (bookmarkId: number) => {
    if (USE_MOCK_BOOKMARK_API) return mockBookmarkRemove(bookmarkId);
    const { data } = await axiosInstance.delete(`/api/bookmarks/${bookmarkId}`);
    return data as { message: string; id: number };
  },
};
