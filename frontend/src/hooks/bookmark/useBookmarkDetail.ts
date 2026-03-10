import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmark.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 북마크 상세 조회 (저장 당시 환율/뉴스/항공 스냅샷 포함)
 * GET /api/bookmarks/{bookmarkId}
 * staleTime: 0 (즉시 갱신)
 */
export const useBookmarkDetail = (bookmarkId: number | null) =>
  useQuery({
    queryKey: queryKeys.bookmark.detail(bookmarkId!),
    queryFn: () => bookmarkApi.getDetail(bookmarkId!),
    enabled: bookmarkId !== null,
    staleTime: 0,
  });
