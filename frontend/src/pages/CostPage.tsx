import { useNavigate } from '@tanstack/react-router';

const CostPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>CostPage — 글로벌 물가 탐색</h1>
      <p>국가를 선택하면 상세 물가를 볼 수 있습니다.</p>
      <div>
        {/* 임시 더미 데이터 */}
        {[{ id: 82, name: '한국' }, { id: 840, name: '미국' }, { id: 392, name: '일본' }].map((country) => (
          <button
            key={country.id}
            onClick={() => navigate({ to: '/cost/$countryId', params: { countryId: country.id } })}
            style={{ margin: '4px', padding: '8px 16px', border: '1px solid #e5e7eb', cursor: 'pointer' }}
          >
            {country.name} (ID: {country.id})
          </button>
        ))}
      </div>
    </div>
  );
};

export default CostPage;
