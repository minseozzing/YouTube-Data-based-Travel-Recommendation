import { useSearch, useNavigate } from '@tanstack/react-router';
import { useBookmarkList } from '@/hooks/bookmark/useBookmarkList';
import { useDeleteBookmark } from '@/hooks/bookmark/useDeleteBookmark';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QueryErrorFallback from '@/components/common/QueryErrorFallback';

const BookmarkListPage = () => {
  const { keyword } = useSearch({ from: '/_authenticated/bookmarks' });
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useBookmarkList(keyword);
  const { mutate: deleteBookmark } = useDeleteBookmark();

  return (
    <div>
      <h1>BookmarkListPage</h1>
      <div>
        <input
          placeholder="도시/국가 검색"
          defaultValue={keyword ?? ''}
          onBlur={(e) =>
            navigate({ to: '/bookmarks', search: { keyword: e.target.value || undefined } })
          }
          style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
        />
      </div>
      {isLoading && <LoadingSpinner message="북마크 불러오는 중..." />}
      {isError && <QueryErrorFallback error={error as Error} onRetry={() => refetch()} />}
      {data && (
        <div>
          <p>총 {data.length}개의 북마크</p>
          {data.map((item) => (
            <div
              key={item.cityId}
              style={{ border: '1px solid #e5e7eb', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between' }}
            >
              <div>
                <strong>{item.cityName}</strong> / {item.countryName}
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{item.createdAt}</p>
              </div>
              {item.bookmarkId !== undefined && (
                <div>
                  <button
                    onClick={() =>
                      navigate({ to: '/bookmarks/$id', params: { id: item.bookmarkId! } })
                    }
                  >
                    상세
                  </button>
                  <button
                    onClick={() => deleteBookmark(item.bookmarkId!)}
                    style={{ marginLeft: '4px', color: 'red' }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
          <details>
            <summary>raw data</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default BookmarkListPage;
