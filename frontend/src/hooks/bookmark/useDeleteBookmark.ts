import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookmarkApi } from '@/api/bookmark.api';
import { queryKeys } from '@/utils/queryKeys';

/**
 * 북마크 삭제
 * DELETE /api/bookmarks/{bookmarkId}
 */
export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookmarkId: number) => bookmarkApi.remove(bookmarkId),
    onSuccess: () => {
      // 북마크 목록 캐시 즉시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmark.all });
    },
  });
};
