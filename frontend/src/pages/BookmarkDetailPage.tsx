import { useParams } from '@tanstack/react-router';
import { useBookmarkDetail } from '@/hooks/bookmark/useBookmarkDetail';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QueryErrorFallback from '@/components/common/QueryErrorFallback';

const BookmarkDetailPage = () => {
  const { id } = useParams({ from: '/_authenticated/bookmarks/$id' });
  const { data, isLoading, isError, error, refetch } = useBookmarkDetail(id);

  return (
    <div>
      <h1>BookmarkDetailPage — ID: {id}</h1>
      {isLoading && <LoadingSpinner message="북마크 상세 불러오는 중..." />}
      {isError && <QueryErrorFallback error={error as Error} onRetry={() => refetch()} />}
      {data && (
        <div>
          <h2>
            {data.cityName}, {data.countryName}
          </h2>
          {data.matchingScore !== undefined && <p>매칭 점수: {data.matchingScore}%</p>}
          {data.flightAtSaved && (
            <p>저장 당시 항공권: {data.flightAtSaved.price.toLocaleString()}원</p>
          )}
          {data.exchangeAtSaved && (
            <p>
              저장 당시 환율: {data.exchangeAtSaved.before} → 현재: {data.exchangeAtSaved.current}
            </p>
          )}
          <details>
            <summary>raw data</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default BookmarkDetailPage;
