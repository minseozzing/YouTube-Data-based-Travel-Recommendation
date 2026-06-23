/**
 * mock 모드의 유튜브 취향 분석 결과 — 가상의 "해변/음식/야경/트레킹/사원/건축"
 * 관심사를 가진 사용자의 시청 이력을 흉내낸다. 도시별 매칭은 YoutubeTab이
 * city.tags 와 비교해 자체적으로 계산하므로, 여기서는 계정 단위의 고정된
 * 분석 결과만 제공하면 된다 (실제 /api/interest/analyze 와 동일한 계약).
 */

interface MockInterestTag {
  tagId: number;
  categoryName: string;
  tagName: string;
  score: number;
  confidence: number;
  reason: string;
  evidenceKeywords: { keyword: string; sourceType: string; score: number }[];
  sourceBadges: { sourceType: string; percent: number }[];
}

const MOCK_INTEREST_TAGS: MockInterestTag[] = [
  {
    tagId: 1,
    categoryName: '자연/풍경',
    tagName: '해변',
    score: 0.92,
    confidence: 0.88,
    reason: '몰디브·발리 등 해변 휴양 콘텐츠를 반복적으로 시청하고 관련 영상에 좋아요를 눌렀습니다.',
    evidenceKeywords: [
      { keyword: '몰디브 브이로그', sourceType: 'PLAYLIST_TITLE', score: 0.9 },
      { keyword: '해변 리조트', sourceType: 'LIKED_VIDEO_TAG', score: 0.85 },
      { keyword: '스노클링', sourceType: 'PLAYLIST_VIDEO_TAG', score: 0.7 },
      { keyword: '인피니티풀', sourceType: 'LIKED_VIDEO_TITLE', score: 0.6 },
    ],
    sourceBadges: [
      { sourceType: 'PLAYLIST_TITLE', percent: 40 },
      { sourceType: 'LIKED_VIDEO_TAG', percent: 35 },
      { sourceType: 'PLAYLIST_VIDEO_TAG', percent: 25 },
    ],
  },
  {
    tagId: 6,
    categoryName: '음식/미식',
    tagName: '길거리음식',
    score: 0.85,
    confidence: 0.8,
    reason: '아시아 길거리 음식 투어, 야시장 먹방 채널을 구독하고 자주 시청했습니다.',
    evidenceKeywords: [
      { keyword: '야시장 먹방', sourceType: 'SUBSCRIPTION_TITLE', score: 0.8 },
      { keyword: '길거리음식 투어', sourceType: 'PLAYLIST_TITLE', score: 0.78 },
      { keyword: '동남아 맛집', sourceType: 'LIKED_VIDEO_TAG', score: 0.65 },
    ],
    sourceBadges: [
      { sourceType: 'SUBSCRIPTION_TITLE', percent: 45 },
      { sourceType: 'PLAYLIST_TITLE', percent: 30 },
      { sourceType: 'LIKED_VIDEO_TAG', percent: 25 },
    ],
  },
  {
    tagId: 27,
    categoryName: '쇼핑/도시',
    tagName: '야경',
    score: 0.8,
    confidence: 0.75,
    reason: '도시 야경 드론 영상, 전망대 브이로그를 즐겨보고 관련 재생목록을 만들었습니다.',
    evidenceKeywords: [
      { keyword: '도시 야경', sourceType: 'PLAYLIST_TITLE', score: 0.82 },
      { keyword: '전망대 브이로그', sourceType: 'PLAYLIST_VIDEO_TITLE', score: 0.7 },
      { keyword: '드론 야경', sourceType: 'LIKED_VIDEO_TAG', score: 0.6 },
    ],
    sourceBadges: [
      { sourceType: 'PLAYLIST_TITLE', percent: 50 },
      { sourceType: 'PLAYLIST_VIDEO_TITLE', percent: 30 },
      { sourceType: 'LIKED_VIDEO_TAG', percent: 20 },
    ],
  },
  {
    tagId: 13,
    categoryName: '문화/역사',
    tagName: '사원',
    score: 0.74,
    confidence: 0.7,
    reason: '동남아·일본 사원 탐방 콘텐츠에 좋아요를 누르고 관련 영상을 반복 시청했습니다.',
    evidenceKeywords: [
      { keyword: '사원 탐방', sourceType: 'LIKED_VIDEO_TITLE', score: 0.72 },
      { keyword: '왓 프라깨우', sourceType: 'LIKED_VIDEO_TAG', score: 0.55 },
    ],
    sourceBadges: [
      { sourceType: 'LIKED_VIDEO_TITLE', percent: 60 },
      { sourceType: 'LIKED_VIDEO_TAG', percent: 40 },
    ],
  },
  {
    tagId: 14,
    categoryName: '문화/역사',
    tagName: '건축',
    score: 0.7,
    confidence: 0.68,
    reason: '유럽 랜드마크 건축물 다큐멘터리 재생목록을 구독하고 있습니다.',
    evidenceKeywords: [
      { keyword: '유럽 건축 다큐', sourceType: 'PLAYLIST_TITLE', score: 0.68 },
      { keyword: '랜드마크', sourceType: 'PLAYLIST_VIDEO_TAG', score: 0.55 },
    ],
    sourceBadges: [
      { sourceType: 'PLAYLIST_TITLE', percent: 55 },
      { sourceType: 'PLAYLIST_VIDEO_TAG', percent: 45 },
    ],
  },
  {
    tagId: 17,
    categoryName: '액티비티/모험',
    tagName: '트레킹',
    score: 0.62,
    confidence: 0.6,
    reason: '알프스·스위스 트레킹 코스 영상을 몇 차례 시청한 기록이 있습니다.',
    evidenceKeywords: [
      { keyword: '알프스 트레킹', sourceType: 'PLAYLIST_VIDEO_TITLE', score: 0.6 },
      { keyword: '스위스 하이킹', sourceType: 'LIKED_VIDEO_TAG', score: 0.5 },
    ],
    sourceBadges: [
      { sourceType: 'PLAYLIST_VIDEO_TITLE', percent: 60 },
      { sourceType: 'LIKED_VIDEO_TAG', percent: 40 },
    ],
  },
];

export function getMockInterestAnalysisRaw() {
  const topKeywords = MOCK_INTEREST_TAGS.flatMap((tag) =>
    tag.evidenceKeywords.map((kw) => ({
      keyword: kw.keyword,
      normalizedKeyword: kw.keyword,
      sourceType: kw.sourceType,
      score: kw.score,
    })),
  );
  return { tags: MOCK_INTEREST_TAGS, topKeywords };
}

export function getMockInterestTagsRaw() {
  return {
    tagIds: MOCK_INTEREST_TAGS.map((t) => t.tagId),
    tagNames: MOCK_INTEREST_TAGS.map((t) => t.tagName),
  };
}
