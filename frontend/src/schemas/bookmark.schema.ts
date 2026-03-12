import { z } from "zod";

// 북마크 목록 아이템
export const BookmarkListItemSchema = z.object({
  id: z.number(),
  cityId: z.number(),
  cityName: z.string(),
  countryName: z.string(),
  imgUrl: z.string().url().nullable(),
  createdAt: z.string().datetime({ offset: false }),
});
export type BookmarkListItem = z.infer<typeof BookmarkListItemSchema>;

// 북마크 목록 페이지네이션 응답
export const BookmarkPageSchema = z.object({
  content: z.array(BookmarkListItemSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
});
export type BookmarkPage = z.infer<typeof BookmarkPageSchema>;

// 저장 당시 환율 스냅샷
export const ExchangeAtSavedSchema = z.object({
  before: z.number(),
  current: z.number(),
});

// 저장 당시 뉴스 스냅샷
export const NewsAtSavedItemSchema = z.object({
  title: z.string(),
  source: z.string(),
  url: z.string().url(),
});

// 저장 당시 항공 스냅샷
export const FlightAtSavedSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  price: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

// 북마크 상세
export const BookmarkDetailSchema = z.object({
  cityId: z.number(),
  cityName: z.string(),
  countryName: z.string(),
  imgUrl: z.string().url(),
  createdAt: z.string().datetime(),
  matchingScore: z.number().optional(),
  exchangeAtSaved: ExchangeAtSavedSchema.optional(),
  newsAtSaved: z.array(NewsAtSavedItemSchema).optional(),
  flightAtSaved: FlightAtSavedSchema.optional(),
});
export type BookmarkDetail = z.infer<typeof BookmarkDetailSchema>;

// 북마크 생성 요청
export const CreateBookmarkRequestSchema = z.object({
  country: z.string(),
  city: z.string(),
  json: z.string(), // 상세 정보 JSON 문자열
});
export type CreateBookmarkRequest = z.infer<typeof CreateBookmarkRequestSchema>;
