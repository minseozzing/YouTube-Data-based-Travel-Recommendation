import type { CityDetail, CityListItem } from "@/schemas/city.schema";

/**
 * 백엔드 없이 UI 확인용 더미 도시 상세 데이터
 * GlobeViewer의 DUMMY_CITIES(cityId 1~15)와 cityId 일치
 * recommendedapi.md 명세에 맞춘 고도화된 더미 데이터
 */
export const DUMMY_CITY_DETAILS: Record<number, CityDetail> = {
  1: {
    cityId: 1,
    cityName: "도쿄",
    countryId: 1,
    countryName: "일본",
    imgUrl: "https://picsum.photos/seed/tokyo/800/1200",
    matchingScore: 92,
    recommendReason:
      "일본 특유의 현대와 전통이 공존하는 문화, 안전한 치안, 다양한 미식 경험이 당신의 여행 스타일과 92% 일치합니다. 도쿄 타워와 센소지 사원 등 세계적인 명소를 합리적인 예산으로 즐길 수 있습니다.",
    tags: [
      { name: "미식" },
      { name: "전통문화" },
      { name: "쇼핑" },
      { name: "야경" },
      { name: "애니메이션" }
    ],
    danger: "일부 번화가 호객 행위 주의",
    livingCostFor1Day: {
      accommodation: 65000,
      food: 45000,
      transportation: 10000
    },
    airTicket: {
      departAirTicket: 160000,
      arriveAirTicket: 155000
    },
    news: {
      summation: "벚꽃 개화 시기가 예년보다 빨라져 관광객이 급증하고 있으며, 주요 명소 예약이 필수적입니다.",
      top3: [
        {
          title: "도쿄 벚꽃 축제 개막 소식",
          url: "https://example.com/tokyo-sakura",
          createdAt: "2026-03-09T10:00:00Z"
        },
        {
          title: "시부야 스카이 입장권 매진 행렬",
          url: "https://example.com/shibuya-sky",
          createdAt: "2026-03-08T15:30:00Z"
        },
        {
          title: "신규 오픈한 해리포터 스튜디오 가이드",
          url: "https://example.com/warner-bros-tokyo",
          createdAt: "2026-03-07T09:00:00Z"
        }
      ]
    },
    latitude: 35.6762,
    longitude: 139.6503,
  },
  2: {
    cityId: 2,
    cityName: "파리",
    countryId: 2,
    countryName: "프랑스",
    imgUrl: "https://picsum.photos/seed/paris/800/1200",
    matchingScore: 85,
    recommendReason:
      "세계 예술과 패션의 중심지 파리는 루브르 박물관, 에펠탑 등 문화 콘텐츠가 풍부해 당신의 문화/역사 취향과 85% 매칭됩니다. 센강 크루즈와 몽마르뜨 언덕에서 잊지 못할 낭만을 경험하세요.",
    tags: [{ name: "예술" }, { name: "패션" }, { name: "낭만" }, { name: "역사" }],
    danger: "소매치기 및 분실물 주의 (에펠탑 인근)",
    livingCostFor1Day: {
      accommodation: 120000,
      food: 70000,
      transportation: 15000
    },
    airTicket: {
      departAirTicket: 420000,
      arriveAirTicket: 450000
    },
    news: {
      summation: "올림픽 준비로 인한 일부 지하철 노선 공사 중입니다.",
      top3: [
        { title: "파리 루브르 박물관 야간 개장 안내", url: "https://example.com/louvre", createdAt: "2026-03-05T10:00:00Z" }
      ]
    },
    latitude: 48.8566,
    longitude: 2.3522,
  },
  10: {
    cityId: 10,
    cityName: "발리",
    countryId: 10,
    countryName: "인도네시아",
    imgUrl: "https://picsum.photos/seed/bali/800/1200",
    matchingScore: 95,
    recommendReason:
      "신들의 섬 발리는 우붓의 라이스 테라스, 꾸따 해변의 서핑, 합리적인 물가가 당신의 자연/경관 취향과 95% 완벽하게 매칭됩니다.",
    tags: [
      { name: "해변" },
      { name: "서핑" },
      { name: "힐링" },
      { name: "사원" },
      { name: "저물가" },
      { name: "휴양" }
    ],
    danger: "환전 시 공식 환전소 이용 권장",
    livingCostFor1Day: {
      accommodation: 35000,
      food: 20000,
      transportation: 15000
    },
    airTicket: {
      departAirTicket: 210000,
      arriveAirTicket: 220000
    },
    news: {
      summation: "디지털 노마드를 위한 신규 비자 정책이 발표되어 장기 체류 여행객이 늘고 있습니다.",
      top3: [
        { title: "발리 우붓 요가 페스티벌 일정", url: "https://example.com/bali-yoga", createdAt: "2026-03-01T10:00:00Z" },
        { title: "짱구 지역 교통 체증 심화 주의", url: "https://example.com/canggu-traffic", createdAt: "2026-02-28T10:00:00Z" }
      ]
    },
    latitude: -8.3405,
    longitude: 115.092,
  },
  12: {
    cityId: 12,
    cityName: "서울",
    countryId: 12,
    countryName: "한국",
    imgUrl: "https://picsum.photos/seed/seoul/800/1200",
    matchingScore: 87,
    recommendReason:
      "경복궁과 남산, K-팝과 K-뷰티, 홍대와 강남의 쇼핑까지 전통과 트렌드가 공존하는 서울은 도시/쇼핑 취향과 87% 매칭됩니다.",
    tags: [{ name: "K팝" }, { name: "쇼핑" }, { name: "미식" }, { name: "야경" }],
    livingCostFor1Day: {
      accommodation: 80000,
      food: 40000,
      transportation: 10000
    },
    airTicket: {
      departAirTicket: 0,
      arriveAirTicket: 0
    },
    news: {
      summation: "서울 페스타 준비로 광화문 일대 행사가 진행 중입니다.",
      top3: [{ title: "서울 야경 명소 TOP 5", url: "https://example.com/seoul-night", createdAt: "2026-03-09T10:00:00Z" }]
    },
    latitude: 37.5665,
    longitude: 126.978,
  },
};

// 나머지 도시들을 위한 기본 객체 생성 함수
const createDefaultCity = (id: number, name: string, country: string): CityDetail => ({
  cityId: id,
  cityName: name,
  countryId: id,
  countryName: country,
  imgUrl: `https://picsum.photos/seed/${id}/800/1200`,
  matchingScore: 70,
  recommendReason: `${name}은 매력적인 도시입니다.`,
  tags: [{ name: "여행" }],
  livingCostFor1Day: { accommodation: 50000, food: 30000, transportation: 10000 },
  airTicket: { departAirTicket: 200000, arriveAirTicket: 200000 },
  news: { summation: "활기찬 분위기입니다.", top3: [] },
  latitude: 0,
  longitude: 0,
});

// 기존 DUMMY_CITY_DETAILS 보완 (누락된 ID들에 대해 기본값 채우기)
[3, 4, 5, 6, 7, 8, 9, 11, 13, 14, 15].forEach(id => {
  if (!DUMMY_CITY_DETAILS[id]) {
    DUMMY_CITY_DETAILS[id] = createDefaultCity(id, `도시 ${id}`, "국가");
  }
});

const RISK_LEVEL_BY_CITY: Record<number, number> = {
  1: 1, 2: 2, 3: 2, 4: 1, 5: 2, 6: 1, 7: 2, 8: 1, 9: 2, 10: 2, 11: 1, 12: 1, 13: 3, 14: 1, 15: 3,
};

export const DUMMY_CITIES: CityListItem[] = Object.values(
  DUMMY_CITY_DETAILS,
).map((d) => ({
  cityId: d.cityId,
  cityName: d.cityName,
  countryName: d.countryName,
  imgUrl: d.imgUrl,
  estimatedBudget: (d.livingCostFor1Day ? (d.livingCostFor1Day.accommodation + d.livingCostFor1Day.food + d.livingCostFor1Day.transportation) : 100000) * 7,
  riskLevel: RISK_LEVEL_BY_CITY[d.cityId] ?? 2,
  latitude: d.latitude,
  longitude: d.longitude,
  matchingScore: d.matchingScore,
}));
