import { useParams } from '@tanstack/react-router';
import { useCountryCost } from '@/hooks/cost/useCountryCost';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QueryErrorFallback from '@/components/common/QueryErrorFallback';

const CountryCostDetailPage = () => {
  const { countryId } = useParams({ from: '/_authenticated/cost/$countryId' });
  const { data, isLoading, isError, error, refetch } = useCountryCost(countryId);

  return (
    <div>
      <h1>CountryCostDetailPage — 국가 ID: {countryId}</h1>
      {isLoading && <LoadingSpinner message="물가 데이터 불러오는 중..." />}
      {isError && <QueryErrorFallback error={error as Error} onRetry={() => refetch()} />}
      {data && (
        <div>
          <p>통화: {data.currency}</p>
          <p>1인 월 생활비 (임대 포함): {data.onePerson.totalWithRent} {data.currency}</p>
          <p>중위임금: {data.salaryAfterTaxMedian} {data.currency}</p>
          <details>
            <summary>raw data</summary>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default CountryCostDetailPage;
