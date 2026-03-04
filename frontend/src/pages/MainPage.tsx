import { useSearch, useNavigate } from '@tanstack/react-router';
import { useUiStore } from '@/stores/uiStore';
import { useCityList } from '@/hooks/city/useCityList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QueryErrorFallback from '@/components/common/QueryErrorFallback';

type MainTab = 'recommend' | 'cost' | 'flight' | 'news';

const MainPage = () => {
  const { tab } = useSearch({ from: '/_authenticated/main' });
  const navigate = useNavigate();
  const { openCityModal } = useUiStore();

  const { data: cities, isLoading, isError, error, refetch } = useCityList();

  const setTab = (newTab: MainTab) => {
    navigate({ to: '/main', search: { tab: newTab } });
  };

  return (
    <div>
      <h1>MainPage</h1>
      <div>
        {(['recommend', 'cost', 'flight', 'news'] as MainTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ margin: '4px', padding: '4px 12px', background: tab === t ? '#3b82f6' : '#e5e7eb', color: tab === t ? 'white' : 'black', border: 'none', cursor: 'pointer' }}
          >
            {t}
          </button>
        ))}
      </div>
      <p>현재 탭: {tab}</p>

      {isLoading && <LoadingSpinner message="도시 목록 불러오는 중..." />}
      {isError && <QueryErrorFallback error={error as Error} onRetry={() => refetch()} />}
      {cities && (
        <div>
          <h2>도시 목록 ({cities.length}개)</h2>
          {cities.map((city) => (
            <div
              key={city.cityId}
              style={{ border: '1px solid #e5e7eb', padding: '8px', margin: '4px', cursor: 'pointer' }}
              onClick={() => openCityModal(city.cityId)}
            >
              <strong>{city.cityName}</strong> / {city.countryName}
              {city.matchingScore !== undefined && <span> (매칭: {city.matchingScore}%)</span>}
            </div>
          ))}
          <details>
            <summary>raw data</summary>
            <pre>{JSON.stringify(cities, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default MainPage;
