import { useQuery } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmark.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 북마크 목록 조회
 * GET /api/bookmarks?keyword=...
 * staleTime: 0 (즉시 갱신)
 */
export const useBookmarkList = (keyword?: string) =>
  useQuery({
    queryKey: queryKeys.bookmark.list(keyword),
    queryFn: () => bookmarkApi.getList(keyword),
    staleTime: 0,
  });
