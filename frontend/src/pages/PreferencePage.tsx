import { usePreferenceStore } from '@/stores/preferenceStore';
import { useSubmitPreference } from '@/hooks/auth/usePreference';

const SAMPLE_TAGS = ['자연', '도시', '음식', '역사', '쇼핑', '해변', '산', '문화', '액티비티', '럭셔리'];

const PreferencePage = () => {
  const { selectedTags, toggleTag } = usePreferenceStore();
  const { mutate: submit, isPending } = useSubmitPreference();

  return (
    <div>
      <h1>PreferencePage — 취향 선택</h1>
      <p>선택된 태그: {selectedTags.join(', ') || '없음'}</p>
      <div>
        {SAMPLE_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{ margin: '4px', padding: '4px 12px', background: selectedTags.includes(tag) ? '#3b82f6' : '#e5e7eb', color: selectedTags.includes(tag) ? 'white' : 'black', border: 'none', borderRadius: '16px', cursor: 'pointer' }}
          >
            {tag}
          </button>
        ))}
      </div>
      <pre>{JSON.stringify({ selectedTags }, null, 2)}</pre>
      <button onClick={() => submit(selectedTags)} disabled={isPending || selectedTags.length === 0}>
        {isPending ? '저장 중...' : '선택 완료'}
      </button>
    </div>
  );
};

export default PreferencePage;
