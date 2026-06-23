import {
  MOCK_CITIES,
  findCity,
  findRichCountry,
  getExchangeInfo,
  resolveImage,
  type MockCity,
} from './sharedData';

function buildDanger(city: MockCity) {
  return {
    countryName: city.countryNameEn,
    items:
      city.riskLevel >= 1
        ? [{ level: '여행유의', description: city.dangerDescription ?? null }]
        : [],
  };
}

function dailyTotal(city: MockCity) {
  return city.food + city.transportation + city.accommodation;
}

function cityCurrency(city: MockCity): string {
  return findRichCountry(city.countryNameEn)?.currency ?? 'USD';
}

let newsSeq = 1;
function buildNewsTop3(city: MockCity) {
  const topics = ['여행 안내', '현지 날씨', '관광지 소식'];
  return {
    summation: `${city.nameEn}의 최근 여행 관련 소식을 요약했습니다.`,
    top3: topics.map((topic) => ({
      title: `[${city.countryNameEn}] ${city.nameEn} ${topic}`,
      url: `https://example.com/news/${newsSeq++}`,
      content: null,
      description: `${city.nameEn} 지역의 ${topic} 관련 모의 뉴스입니다.`,
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })),
  };
}

// GET /api/city — AllCitiesResponse
export function getMockCityListRaw() {
  return MOCK_CITIES.map((city) => ({
    id: city.id,
    name: city.nameEn,
    imgUrl: resolveImage(city.imageKey),
    livingCostFor1Day: dailyTotal(city),
    danger: buildDanger(city),
    lat: city.lat,
    lon: city.lon,
  }));
}

// GET /api/city/view-history
export function getMockViewHistoryRaw() {
  return MOCK_CITIES.slice(0, 3).map((city) => ({
    cityId: city.id,
    cityName: city.nameEn,
    countryName: city.countryNameEn,
    dailyBudget: dailyTotal(city),
    imgUrl: resolveImage(city.imageKey),
    lastViewTime: new Date().toISOString(),
  }));
}

interface RecommendBody {
  selectedTags: string[];
  userTotalBudget: number;
  travelDays: number;
  month: number;
}

function scoreCity(city: MockCity, body: RecommendBody) {
  const estimatedTotal = dailyTotal(city) * Math.max(body.travelDays, 1);
  const ratio = body.userTotalBudget > 0 ? estimatedTotal / body.userTotalBudget : 1;
  const budgetScore = ratio <= 1 ? 100 : Math.max(0, 100 - (ratio - 1) * 100);
  const safetyScore = 100 - city.riskLevel * 30;
  const tagMatchScore =
    body.selectedTags.length === 0
      ? 50
      : (body.selectedTags.reduce((sum, tagName) => {
          const matched = city.tags.find((t) => t.name === tagName);
          return sum + (matched ? matched.score * 100 : 0);
        }, 0) /
          body.selectedTags.length);
  const newPenaltyScore = 90;
  const finalScore =
    0.4 * tagMatchScore + 0.3 * budgetScore + 0.2 * safetyScore + 0.1 * newPenaltyScore;
  return { finalScore, budgetScore, safetyScore, tagMatchScore, newPenaltyScore };
}

// POST /api/recommend
export function getMockRecommendRaw(body: RecommendBody) {
  const ranked = MOCK_CITIES.map((city) => ({ city, scores: scoreCity(city, body) }))
    .sort((a, b) => b.scores.finalScore - a.scores.finalScore);

  return {
    recommendId: crypto.randomUUID(),
    requestContext: { ...body },
    recommendations: ranked.map(({ city, scores }) => ({
      id: city.id,
      name: city.nameEn,
      imgUrl: resolveImage(city.imageKey),
      livingCostFor1Day: dailyTotal(city),
      scores: {
        total: Math.round(scores.finalScore),
        tag: Math.round(scores.tagMatchScore),
        budget: Math.round(scores.budgetScore),
        safety: Math.round(scores.safetyScore),
        newsPenalty: Math.round(scores.newPenaltyScore),
      },
      danger: buildDanger(city),
      lat: city.lat,
      lon: city.lon,
    })),
  };
}

// GET /api/city/{id}?recommend=true|false
export function getMockCityDetailRaw(
  cityId: number,
  recommend: boolean,
  recommendParams?: RecommendBody,
) {
  const city = findCity(cityId);
  if (!city) throw new Error(`Mock city not found: ${cityId}`);

  const currency = cityCurrency(city);
  const exchange = getExchangeInfo(currency);
  const livingCostFor1Day = {
    food: city.food,
    transportation: city.transportation,
    accommodation: city.accommodation,
    hotel: city.accommodation,
    total: dailyTotal(city),
  };
  const exchangeRate = {
    currency: exchange.currency,
    krwPerDisplayUnit: exchange.krwPerDisplayUnit,
    eventDate: new Date().toISOString().slice(0, 10),
    displayUnit: exchange.displayUnit,
    displaySymbol: exchange.displaySymbol,
  };

  if (recommend) {
    const scores = scoreCity(city, recommendParams ?? { selectedTags: [], userTotalBudget: dailyTotal(city) * 5, travelDays: 5, month: new Date().getMonth() + 1 });
    return {
      name: city.nameEn,
      score: {
        finalScore: Math.round(scores.finalScore),
        budgetScore: Math.round(scores.budgetScore),
        safetyScore: Math.round(scores.safetyScore),
        tagMatchScore: Math.round(scores.tagMatchScore),
        newPenaltyScore: Math.round(scores.newPenaltyScore),
      },
      recommendationReason: `${city.nameEn}은(는) 선택하신 태그와 예산에 잘 맞는 여행지입니다.`,
      livingCostFor1Day,
      airTicketAndHotel: {
        airTicket: Math.round(city.accommodation * 1.4 / 1000) * 1000,
        hotel: city.accommodation,
      },
      news: buildNewsTop3(city),
      danger: buildDanger(city),
      tags: city.tags.map((t) => ({ name: t.name, tagScore: t.score })),
      touristSpot: city.touristSpots.map((spot) => ({
        name: spot.name,
        koName: spot.koName,
        description: `${spot.koName}은(는) ${city.nameEn}의 인기 명소입니다.`,
        lat: spot.lat,
        lon: spot.lon,
        imageUrl: null,
        spotScore: spot.score,
        tags: spot.tags,
        tagScores: Object.fromEntries(spot.tags.map((t) => [t, spot.score])),
      })),
      exchangeRate,
    };
  }

  return {
    id: city.id,
    name: city.nameEn,
    imgUrl: resolveImage(city.imageKey),
    livingCostFor1Day,
    airTicketAndHotel: {
      airTicket: Math.round(city.accommodation * 1.4 / 1000) * 1000,
      hotel: city.accommodation,
    },
    danger: buildDanger(city),
    tags: city.tags.map((t) => ({ name: t.name, tagScore: t.score })),
    exchangeRate,
  };
}
