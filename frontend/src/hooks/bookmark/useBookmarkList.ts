import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmark.api';
import { queryKeys } from '@/utils/queryKeys';
import type { BookmarkListItem } from '@/schemas/bookmark.schema';

// TODO: 더미 데이터 — API 연동 후 제거
const DUMMY_LIST: BookmarkListItem[] = [
  { cityId: 1, cityName: '도쿄', countryName: '일본', imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', createdAt: '2024-01-15T10:00:00Z', bookmarkId: 101 },
  { cityId: 2, cityName: '방콕', countryName: '태국', imgUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400', createdAt: '2024-02-20T10:00:00Z', bookmarkId: 102 },
  { cityId: 3, cityName: '파리', countryName: '프랑스', imgUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', createdAt: '2024-03-10T10:00:00Z', bookmarkId: 103 },
  { cityId: 4, cityName: '뉴욕', countryName: '미국', imgUrl: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400', createdAt: '2024-04-05T10:00:00Z', bookmarkId: 104 },
  { cityId: 5, cityName: '발리', countryName: '인도네시아', imgUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', createdAt: '2024-05-01T10:00:00Z', bookmarkId: 105 },
  { cityId: 6, cityName: '바르셀로나', countryName: '스페인', imgUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400', createdAt: '2024-06-15T10:00:00Z', bookmarkId: 106 },
];

/**
 * 북마크 목록 조회
 * GET /api/bookmarks?keyword=...
 * staleTime: 0 (즉시 갱신)
 */
export const useBookmarkList = (keyword?: string) =>
  useQuery({
    queryKey: queryKeys.bookmark.list(keyword),
    // TODO: 더미 → queryFn: () => bookmarkApi.getList(keyword)
    queryFn: async () => DUMMY_LIST,
    staleTime: 0,
  });
