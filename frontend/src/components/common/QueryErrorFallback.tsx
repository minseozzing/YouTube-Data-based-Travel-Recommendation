interface QueryErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
}

const QueryErrorFallback = ({ error, onRetry }: QueryErrorFallbackProps) => {
  return (
    <div style={{ padding: '16px', border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fef2f2' }}>
      <p style={{ color: '#dc2626', fontWeight: 'bold' }}>데이터를 불러오지 못했습니다.</p>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>{error.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ marginTop: '8px', padding: '4px 12px', border: '1px solid #dc2626', borderRadius: '4px', cursor: 'pointer' }}
        >
          다시 시도
        </button>
      )}
    </div>
  );
};

export default QueryErrorFallback;
