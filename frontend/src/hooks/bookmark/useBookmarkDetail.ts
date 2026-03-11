import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmark.api';
import { queryKeys } from '@/utils/queryKeys';
import type { BookmarkDetail } from '@/schemas/bookmark.schema';

// TODO: 더미 데이터 — API 연동 후 제거
const DUMMY_DETAIL: BookmarkDetail = {
  cityId: 1,
  cityName: '도쿄',
  countryName: '일본',
  imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  createdAt: '2024-01-15T10:00:00Z',
  matchingScore: 87,
  exchangeAtSaved: { before: 850, current: 920 },
  newsAtSaved: [
    { title: '일본 벚꽃 시즌 시작, 관광객 급증', source: 'NHK', url: 'https://www.nhk.or.jp' },
    { title: '도쿄 지하철 요금 인상 예정', source: 'Nikkei', url: 'https://www.nikkei.com' },
  ],
  flightAtSaved: {
    origin: '서울(ICN)',
    destination: '도쿄(NRT)',
    price: 320000,
    startDate: '2024-04-01',
    endDate: '2024-04-07',
  },
};

/**
 * 북마크 상세 조회 (저장 당시 환율/뉴스/항공 스냅샷 포함)
 * GET /api/bookmarks/{bookmarkId}
 * staleTime: 0 (즉시 갱신)
 */
export const useBookmarkDetail = (bookmarkId: number | null) =>
  useQuery({
    queryKey: queryKeys.bookmark.detail(bookmarkId!),
    // TODO: 더미 → queryFn: () => bookmarkApi.getDetail(bookmarkId!)
    queryFn: async () => DUMMY_DETAIL,
    enabled: bookmarkId !== null,
    staleTime: 0,
  });
