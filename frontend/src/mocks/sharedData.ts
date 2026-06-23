/**
 * mock 브랜치 공통 데이터셋 — 백엔드 없이 프론트엔드를 구동하기 위한 단일 소스.
 *
 * 이미지: 국기는 flagcdn.com(CDN), 도시/국가 대표 사진은 Wikimedia Commons(CDN) 또는
 * frontend/src/assets 의 로컬 이미지를 사용합니다. 저장소에 새 바이너리를 추가하지 않습니다.
 */
import { COUNTRY_NAME_KO } from "@/data/countryNameKo";

export type Continent =
  | "Asia"
  | "Europe"
  | "North America"
  | "South America"
  | "Africa"
  | "Oceania";

// ── 국가 ISO-3166-1 alpha-2 코드 (flagcdn.com 용) ──────────────────────────
export const COUNTRY_ISO2: Record<string, string> = {
  Argentina: "ar",
  Australia: "au",
  Austria: "at",
  Belgium: "be",
  Bolivia: "bo",
  Brazil: "br",
  Cambodia: "kh",
  Canada: "ca",
  Chile: "cl",
  China: "cn",
  Croatia: "hr",
  Cuba: "cu",
  "Czech Republic": "cz",
  Denmark: "dk",
  Egypt: "eg",
  Finland: "fi",
  France: "fr",
  Germany: "de",
  Greece: "gr",
  Hungary: "hu",
  Iceland: "is",
  India: "in",
  Indonesia: "id",
  Italy: "it",
  Japan: "jp",
  Kazakhstan: "kz",
  Kenya: "ke",
  Laos: "la",
  Malaysia: "my",
  Maldives: "mv",
  Mauritius: "mu",
  Mexico: "mx",
  Mongolia: "mn",
  Morocco: "ma",
  Nepal: "np",
  Netherlands: "nl",
  "New Zealand": "nz",
  Norway: "no",
  Palau: "pw",
  Peru: "pe",
  Philippines: "ph",
  Poland: "pl",
  Portugal: "pt",
  Qatar: "qa",
  Russia: "ru",
  Singapore: "sg",
  "South Africa": "za",
  "South Korea": "kr",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Taiwan: "tw",
  Thailand: "th",
  Turkey: "tr",
  "United Arab Emirates": "ae",
  "United Kingdom": "gb",
  "United States": "us",
  Vietnam: "vn",
};

export const flagUrl = (iso2: string) => `https://flagcdn.com/w320/${iso2}.png`;

// ── 전체 국가 목록 (id 부여) — COUNTRY_NAME_KO 의 모든 국가를 포함 ─────────────
const SEOUL_COUNTRY_ID = 58; // cost.api.ts 의 SEOUL_COUNTRY_ID 와 반드시 일치해야 함

export interface MockCountryBase {
  id: number;
  nameEn: string;
  iso2: string;
}

export const ALL_COUNTRIES: MockCountryBase[] = (() => {
  const keys = Object.keys(COUNTRY_NAME_KO);
  const list = keys.map((nameEn, i) => ({
    id: i + 1,
    nameEn,
    iso2: COUNTRY_ISO2[nameEn] ?? "xx",
  }));
  // South Korea 의 id를 58로 강제 — cost.api.ts의 SEOUL_COUNTRY_ID 하드코딩과 정합성 유지
  const koreaIdx = list.findIndex((c) => c.nameEn === "South Korea");
  const clashIdx = list.findIndex((c) => c.id === SEOUL_COUNTRY_ID);
  if (koreaIdx !== -1 && clashIdx !== -1 && koreaIdx !== clashIdx) {
    const tmp = list[koreaIdx].id;
    list[koreaIdx].id = list[clashIdx].id;
    list[clashIdx].id = tmp;
  }
  return list;
})();

export const findCountryByName = (nameEn: string) =>
  ALL_COUNTRIES.find((c) => c.nameEn === nameEn);

// ── 풍부한 데이터를 가진 국가 (대표 사진/대륙/통화/예산) ────────────────────────
export interface RichCountry {
  nameEn: string;
  continent: Continent;
  currency: string;
  imgUrl: string;
  dailyBudgetKRW: number;
  population: number;
  salaryAfterTaxMedian: number;
}

export const RICH_COUNTRIES: RichCountry[] = [
  { nameEn: "Japan", continent: "Asia", currency: "JPY", imgUrl: "tokyo", dailyBudgetKRW: 95000, population: 124000000, salaryAfterTaxMedian: 2600000 },
  { nameEn: "South Korea", continent: "Asia", currency: "KRW", imgUrl: "seoul", dailyBudgetKRW: 80000, population: 51700000, salaryAfterTaxMedian: 2800000 },
  { nameEn: "Maldives", continent: "Asia", currency: "MVR", imgUrl: "male", dailyBudgetKRW: 180000, population: 521000, salaryAfterTaxMedian: 900000 },
  { nameEn: "United Arab Emirates", continent: "Asia", currency: "AED", imgUrl: "dubai", dailyBudgetKRW: 150000, population: 9890000, salaryAfterTaxMedian: 3200000 },
  { nameEn: "Switzerland", continent: "Europe", currency: "CHF", imgUrl: "zurich", dailyBudgetKRW: 200000, population: 8740000, salaryAfterTaxMedian: 5200000 },
  { nameEn: "Morocco", continent: "Africa", currency: "MAD", imgUrl: "marrakesh", dailyBudgetKRW: 55000, population: 37500000, salaryAfterTaxMedian: 700000 },
  { nameEn: "France", continent: "Europe", currency: "EUR", imgUrl: "paris", dailyBudgetKRW: 130000, population: 68000000, salaryAfterTaxMedian: 2400000 },
  { nameEn: "Thailand", continent: "Asia", currency: "THB", imgUrl: "bangkok", dailyBudgetKRW: 50000, population: 71600000, salaryAfterTaxMedian: 700000 },
  { nameEn: "United States", continent: "North America", currency: "USD", imgUrl: "nyc", dailyBudgetKRW: 170000, population: 334900000, salaryAfterTaxMedian: 4200000 },
  { nameEn: "Australia", continent: "Oceania", currency: "AUD", imgUrl: "sydney", dailyBudgetKRW: 160000, population: 26600000, salaryAfterTaxMedian: 4000000 },
  { nameEn: "Brazil", continent: "South America", currency: "BRL", imgUrl: "rio", dailyBudgetKRW: 65000, population: 216400000, salaryAfterTaxMedian: 800000 },
  { nameEn: "Italy", continent: "Europe", currency: "EUR", imgUrl: "rome", dailyBudgetKRW: 120000, population: 58900000, salaryAfterTaxMedian: 2000000 },
  { nameEn: "United Kingdom", continent: "Europe", currency: "GBP", imgUrl: "london", dailyBudgetKRW: 155000, population: 67700000, salaryAfterTaxMedian: 3300000 },
  { nameEn: "Vietnam", continent: "Asia", currency: "VND", imgUrl: "hanoi", dailyBudgetKRW: 40000, population: 98200000, salaryAfterTaxMedian: 500000 },
  { nameEn: "Spain", continent: "Europe", currency: "EUR", imgUrl: "barcelona", dailyBudgetKRW: 105000, population: 47600000, salaryAfterTaxMedian: 1700000 },
  { nameEn: "Singapore", continent: "Asia", currency: "SGD", imgUrl: "singapore", dailyBudgetKRW: 140000, population: 5900000, salaryAfterTaxMedian: 3500000 },
  { nameEn: "Egypt", continent: "Africa", currency: "EGP", imgUrl: "cairo", dailyBudgetKRW: 45000, population: 112700000, salaryAfterTaxMedian: 400000 },
  { nameEn: "Argentina", continent: "South America", currency: "ARS", imgUrl: "buenosaires", dailyBudgetKRW: 60000, population: 45800000, salaryAfterTaxMedian: 600000 },
  { nameEn: "Canada", continent: "North America", currency: "CAD", imgUrl: "toronto", dailyBudgetKRW: 145000, population: 39600000, salaryAfterTaxMedian: 3600000 },
];

// ── 도시/국가 대표 사진 (Wikimedia Commons thumbnail, 안정적인 CDN 링크) ─────────
export const CITY_IMAGE: Record<string, string> = {
  paris: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/330px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
  bangkok: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%A3%E0%B8%A1%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B8%84%E0%B9%88%E0%B8%B3%E0%B8%84%E0%B8%B7%E0%B8%99.jpg/330px-%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%9A%E0%B8%A3%E0%B8%A1%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B9%83%E0%B8%99%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B8%84%E0%B9%88%E0%B8%B3%E0%B8%84%E0%B8%B7%E0%B8%99.jpg",
  nyc: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/330px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
  sydney: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/330px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
  rio: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Cidade_Maravilhosa.jpg/330px-Cidade_Maravilhosa.jpg",
  rome: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg/330px-Trevi_Fountain%2C_Rome%2C_Italy_2_-_May_2007.jpg",
  london: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/330px-London_Skyline_%28125508655%29.jpeg",
  osaka: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Osaka_Castle_02bs3200.jpg/330px-Osaka_Castle_02bs3200.jpg",
  busan: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Haeundae_Beach_May_2024.jpg/330px-Haeundae_Beach_May_2024.jpg",
  hanoi: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hanoi_skyline_with_Ba_Vi_Mountain.jpg/330px-Hanoi_skyline_with_Ba_Vi_Mountain.jpg",
  barcelona: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg/330px-Aerial_view_of_Barcelona%2C_Spain_%2851227309370%29_edited.jpg",
  singapore: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Marina_Bay_Singapore-3499.jpg/330px-Marina_Bay_Singapore-3499.jpg",
  cairo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg/330px-Cairo_Opera_House%2C_Al_Hurriyah_Park_and_the_Nile_river_%2814797782354%29.jpg",
  buenosaires: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Avenida_9_de_Julio%2C_Buenos_Aires_%2840089810910%29.jpg/330px-Avenida_9_de_Julio%2C_Buenos_Aires_%2840089810910%29.jpg",
  toronto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Toronto_Skyline_from_Snake_Island%2C_February_28_2026_%2808%29.jpg/330px-Toronto_Skyline_from_Snake_Island%2C_February_28_2026_%2808%29.jpg",
};

// 로컬 자산(이미 저장소에 존재) — Vite가 빌드 시 처리
import tokyoImg from "@/assets/Tokyo_Tower.png";
import maleImg from "@/assets/Maldive_beach_1.jpg";
import dubaiImg from "@/assets/dubai-uae.jpg";
import seoulImg from "@/assets/south-korea.jpg";
import zurichImg from "@/assets/swiss.jpg";
import marrakeshImg from "@/assets/ma.jpg";

export const LOCAL_IMAGE: Record<string, string> = {
  tokyo: tokyoImg,
  male: maleImg,
  dubai: dubaiImg,
  seoul: seoulImg,
  zurich: zurichImg,
  marrakesh: marrakeshImg,
};

export const resolveImage = (key: string): string =>
  LOCAL_IMAGE[key] ?? CITY_IMAGE[key] ?? "";

// ── 도시 데이터 ──────────────────────────────────────────────────────────────
const SEOUL_CITY_ID = 162; // cost.api.ts 의 SEOUL_CITY_ID 와 반드시 일치해야 함

export interface MockTouristSpot {
  name: string;
  koName: string;
  lat: number;
  lon: number;
  score: number;
  tags: string[];
}

export interface MockCity {
  id: number;
  nameEn: string; // CITY_NAME_KO 의 key
  countryNameEn: string;
  lat: number;
  lon: number;
  imageKey: string;
  food: number;
  transportation: number;
  accommodation: number;
  riskLevel: number;
  dangerDescription?: string;
  tags: { name: string; score: number }[];
  touristSpots: MockTouristSpot[];
}

export const MOCK_CITIES: MockCity[] = [
  {
    id: 210, nameEn: "Tokyo", countryNameEn: "Japan", lat: 35.6762, lon: 139.6503, imageKey: "tokyo",
    food: 28000, transportation: 9000, accommodation: 110000, riskLevel: 0,
    tags: [{ name: "쇼핑몰", score: 0.9 }, { name: "길거리음식", score: 0.85 }, { name: "야경", score: 0.8 }, { name: "전통시장", score: 0.6 }],
    touristSpots: [
      { name: "Senso-ji Temple", koName: "센소지", lat: 35.7148, lon: 139.7967, score: 0.95, tags: ["사원", "유적지"] },
      { name: "Shibuya Crossing", koName: "시부야 스크램블", lat: 35.6595, lon: 139.7004, score: 0.9, tags: ["야경", "쇼핑몰"] },
      { name: "Tokyo Tower", koName: "도쿄타워", lat: 35.6586, lon: 139.7454, score: 0.88, tags: ["야경", "건축"] },
    ],
  },
  {
    id: 211, nameEn: "Osaka", countryNameEn: "Japan", lat: 34.6937, lon: 135.5023, imageKey: "osaka",
    food: 26000, transportation: 8000, accommodation: 95000, riskLevel: 0,
    tags: [{ name: "길거리음식", score: 0.95 }, { name: "야경", score: 0.75 }, { name: "쇼핑몰", score: 0.7 }],
    touristSpots: [
      { name: "Osaka Castle", koName: "오사카성", lat: 34.6873, lon: 135.5262, score: 0.92, tags: ["유적지", "건축"] },
      { name: "Dotonbori", koName: "도톤보리", lat: 34.6687, lon: 135.5012, score: 0.9, tags: ["길거리음식", "야경"] },
    ],
  },
  {
    id: SEOUL_CITY_ID, nameEn: "Seoul", countryNameEn: "South Korea", lat: 37.5665, lon: 126.9780, imageKey: "seoul",
    food: 24000, transportation: 6000, accommodation: 90000, riskLevel: 0,
    tags: [{ name: "전통시장", score: 0.85 }, { name: "카페", score: 0.9 }, { name: "쇼핑몰", score: 0.8 }, { name: "나이트라이프", score: 0.75 }],
    touristSpots: [
      { name: "Gyeongbokgung Palace", koName: "경복궁", lat: 37.5796, lon: 126.9770, score: 0.95, tags: ["유적지", "건축"] },
      { name: "Myeongdong", koName: "명동", lat: 37.5636, lon: 126.9850, score: 0.88, tags: ["쇼핑몰", "길거리음식"] },
      { name: "Hangang Park", koName: "한강공원", lat: 37.5283, lon: 126.9326, score: 0.82, tags: ["야경", "산"] },
    ],
  },
  {
    id: 212, nameEn: "Busan", countryNameEn: "South Korea", lat: 35.1796, lon: 129.0756, imageKey: "busan",
    food: 22000, transportation: 6000, accommodation: 80000, riskLevel: 0,
    tags: [{ name: "해변", score: 0.95 }, { name: "해산물", score: 0.9 }, { name: "야경", score: 0.7 }],
    touristSpots: [
      { name: "Haeundae Beach", koName: "해운대해수욕장", lat: 35.1587, lon: 129.1604, score: 0.93, tags: ["해변"] },
      { name: "Gamcheon Culture Village", koName: "감천문화마을", lat: 35.0975, lon: 129.0107, score: 0.86, tags: ["건축", "전통시장"] },
    ],
  },
  {
    id: 213, nameEn: "Male", countryNameEn: "Maldives", lat: 4.1755, lon: 73.5093, imageKey: "male",
    food: 45000, transportation: 15000, accommodation: 250000, riskLevel: 0,
    tags: [{ name: "해변", score: 1 }, { name: "스노클링", score: 0.95 }, { name: "리조트", score: 0.9 }],
    touristSpots: [
      { name: "Maldives Underwater Reef", koName: "몰디브 산호초", lat: 4.1992, lon: 73.5111, score: 0.97, tags: ["스노클링", "해변"] },
    ],
  },
  {
    id: 214, nameEn: "Dubai", countryNameEn: "United Arab Emirates", lat: 25.2048, lon: 55.2708, imageKey: "dubai",
    food: 40000, transportation: 12000, accommodation: 180000, riskLevel: 0,
    tags: [{ name: "건축", score: 0.95 }, { name: "쇼핑몰", score: 0.95 }, { name: "사막", score: 0.8 }, { name: "야경", score: 0.85 }],
    touristSpots: [
      { name: "Burj Khalifa", koName: "부르즈 할리파", lat: 25.1972, lon: 55.2744, score: 0.97, tags: ["건축", "야경"] },
      { name: "Dubai Mall", koName: "두바이몰", lat: 25.1972, lon: 55.2796, score: 0.88, tags: ["쇼핑몰"] },
    ],
  },
  {
    id: 215, nameEn: "Zurich", countryNameEn: "Switzerland", lat: 47.3769, lon: 8.5417, imageKey: "zurich",
    food: 50000, transportation: 14000, accommodation: 200000, riskLevel: 0,
    tags: [{ name: "산", score: 0.9 }, { name: "호수", score: 0.9 }, { name: "트레킹", score: 0.8 }],
    touristSpots: [
      { name: "Lake Zurich", koName: "취리히 호수", lat: 47.3559, lon: 8.5478, score: 0.9, tags: ["호수"] },
    ],
  },
  {
    id: 216, nameEn: "Marrakesh", countryNameEn: "Morocco", lat: 31.6295, lon: -7.9811, imageKey: "marrakesh",
    food: 18000, transportation: 6000, accommodation: 60000, riskLevel: 1, dangerDescription: "여행 전 최신 안전 정보를 확인하세요.",
    tags: [{ name: "전통시장", score: 0.95 }, { name: "사막", score: 0.85 }, { name: "건축", score: 0.8 }],
    touristSpots: [
      { name: "Jardin Majorelle", koName: "마조렐 정원", lat: 31.6412, lon: -8.0033, score: 0.9, tags: ["건축"] },
      { name: "Jemaa el-Fnaa", koName: "제마 엘프나 광장", lat: 31.6258, lon: -7.9891, score: 0.93, tags: ["전통시장", "길거리음식"] },
    ],
  },
  {
    id: 217, nameEn: "Paris", countryNameEn: "France", lat: 48.8566, lon: 2.3522, imageKey: "paris",
    food: 38000, transportation: 10000, accommodation: 150000, riskLevel: 0,
    tags: [{ name: "건축", score: 0.95 }, { name: "박물관", score: 0.9 }, { name: "미슐랭", score: 0.85 }],
    touristSpots: [
      { name: "Eiffel Tower", koName: "에펠탑", lat: 48.8584, lon: 2.2945, score: 0.98, tags: ["건축", "야경"] },
      { name: "Louvre Museum", koName: "루브르 박물관", lat: 48.8606, lon: 2.3376, score: 0.95, tags: ["박물관"] },
    ],
  },
  {
    id: 218, nameEn: "Bangkok", countryNameEn: "Thailand", lat: 13.7563, lon: 100.5018, imageKey: "bangkok",
    food: 16000, transportation: 5000, accommodation: 55000, riskLevel: 0,
    tags: [{ name: "길거리음식", score: 0.95 }, { name: "사원", score: 0.9 }, { name: "나이트라이프", score: 0.85 }],
    touristSpots: [
      { name: "Grand Palace", koName: "왓 프라깨우", lat: 13.7500, lon: 100.4913, score: 0.95, tags: ["사원", "건축"] },
      { name: "Chatuchak Market", koName: "짜뚜짝 시장", lat: 13.7999, lon: 100.5500, score: 0.85, tags: ["전통시장"] },
    ],
  },
  {
    id: 219, nameEn: "New York City", countryNameEn: "United States", lat: 40.7128, lon: -74.0060, imageKey: "nyc",
    food: 48000, transportation: 13000, accommodation: 220000, riskLevel: 0,
    tags: [{ name: "야경", score: 0.95 }, { name: "박물관", score: 0.85 }, { name: "쇼핑몰", score: 0.85 }, { name: "페스티벌", score: 0.7 }],
    touristSpots: [
      { name: "Times Square", koName: "타임스퀘어", lat: 40.7580, lon: -73.9855, score: 0.95, tags: ["야경", "쇼핑몰"] },
      { name: "Central Park", koName: "센트럴파크", lat: 40.7829, lon: -73.9654, score: 0.92, tags: ["산"] },
    ],
  },
  {
    id: 220, nameEn: "Sydney", countryNameEn: "Australia", lat: -33.8688, lon: 151.2093, imageKey: "sydney",
    food: 42000, transportation: 11000, accommodation: 170000, riskLevel: 0,
    tags: [{ name: "해변", score: 0.9 }, { name: "건축", score: 0.85 }, { name: "서핑", score: 0.8 }],
    touristSpots: [
      { name: "Sydney Opera House", koName: "시드니 오페라하우스", lat: -33.8568, lon: 151.2153, score: 0.97, tags: ["건축", "야경"] },
      { name: "Bondi Beach", koName: "본다이 비치", lat: -33.8908, lon: 151.2743, score: 0.9, tags: ["해변", "서핑"] },
    ],
  },
  {
    id: 221, nameEn: "Rio De Janeiro", countryNameEn: "Brazil", lat: -22.9068, lon: -43.1729, imageKey: "rio",
    food: 20000, transportation: 7000, accommodation: 70000, riskLevel: 1, dangerDescription: "여행 전 최신 안전 정보를 확인하세요.",
    tags: [{ name: "해변", score: 0.95 }, { name: "페스티벌", score: 0.9 }, { name: "산", score: 0.7 }],
    touristSpots: [
      { name: "Christ the Redeemer", koName: "거대 예수상", lat: -22.9519, lon: -43.2105, score: 0.97, tags: ["산", "건축"] },
      { name: "Copacabana Beach", koName: "코파카바나 해변", lat: -22.9711, lon: -43.1822, score: 0.92, tags: ["해변"] },
    ],
  },
  {
    id: 222, nameEn: "Rome", countryNameEn: "Italy", lat: 41.9028, lon: 12.4964, imageKey: "rome",
    food: 32000, transportation: 8000, accommodation: 120000, riskLevel: 0,
    tags: [{ name: "유적지", score: 0.97 }, { name: "건축", score: 0.9 }, { name: "미슐랭", score: 0.75 }],
    touristSpots: [
      { name: "Colosseum", koName: "콜로세움", lat: 41.8902, lon: 12.4922, score: 0.98, tags: ["유적지"] },
      { name: "Trevi Fountain", koName: "트레비 분수", lat: 41.9009, lon: 12.4833, score: 0.92, tags: ["건축"] },
    ],
  },
  {
    id: 223, nameEn: "London", countryNameEn: "United Kingdom", lat: 51.5074, lon: -0.1278, imageKey: "london",
    food: 40000, transportation: 12000, accommodation: 180000, riskLevel: 0,
    tags: [{ name: "박물관", score: 0.92 }, { name: "건축", score: 0.88 }, { name: "쇼핑몰", score: 0.8 }],
    touristSpots: [
      { name: "Big Ben", koName: "빅벤", lat: 51.5007, lon: -0.1246, score: 0.95, tags: ["건축"] },
      { name: "British Museum", koName: "영국 박물관", lat: 51.5194, lon: -0.1270, score: 0.93, tags: ["박물관"] },
    ],
  },
  {
    id: 224, nameEn: "Hanoi", countryNameEn: "Vietnam", lat: 21.0285, lon: 105.8542, imageKey: "hanoi",
    food: 12000, transportation: 4000, accommodation: 45000, riskLevel: 0,
    tags: [{ name: "길거리음식", score: 0.95 }, { name: "전통시장", score: 0.85 }, { name: "호수", score: 0.7 }],
    touristSpots: [
      { name: "Hoan Kiem Lake", koName: "호안끼엠 호수", lat: 21.0285, lon: 105.8524, score: 0.9, tags: ["호수"] },
      { name: "Old Quarter", koName: "구시가지", lat: 21.0339, lon: 105.8500, score: 0.88, tags: ["길거리음식", "전통시장"] },
    ],
  },
  {
    id: 225, nameEn: "Barcelona", countryNameEn: "Spain", lat: 41.3851, lon: 2.1734, imageKey: "barcelona",
    food: 33000, transportation: 9000, accommodation: 115000, riskLevel: 0,
    tags: [{ name: "건축", score: 0.95 }, { name: "해변", score: 0.85 }, { name: "나이트라이프", score: 0.8 }],
    touristSpots: [
      { name: "Sagrada Familia", koName: "사그라다 파밀리아", lat: 41.4036, lon: 2.1744, score: 0.98, tags: ["건축"] },
      { name: "Park Guell", koName: "구엘 공원", lat: 41.4145, lon: 2.1527, score: 0.9, tags: ["건축", "산"] },
    ],
  },
  {
    id: 226, nameEn: "Singapore", countryNameEn: "Singapore", lat: 1.3521, lon: 103.8198, imageKey: "singapore",
    food: 30000, transportation: 8000, accommodation: 130000, riskLevel: 0,
    tags: [{ name: "쇼핑몰", score: 0.9 }, { name: "야경", score: 0.9 }, { name: "테마파크", score: 0.8 }],
    touristSpots: [
      { name: "Marina Bay Sands", koName: "마리나 베이 샌즈", lat: 1.2834, lon: 103.8607, score: 0.96, tags: ["야경", "건축"] },
      { name: "Gardens by the Bay", koName: "가든스 바이 더 베이", lat: 1.2816, lon: 103.8636, score: 0.93, tags: ["야경"] },
    ],
  },
  {
    id: 227, nameEn: "Cairo", countryNameEn: "Egypt", lat: 30.0444, lon: 31.2357, imageKey: "cairo",
    food: 11000, transportation: 4000, accommodation: 40000, riskLevel: 1, dangerDescription: "여행 전 최신 안전 정보를 확인하세요.",
    tags: [{ name: "유적지", score: 0.98 }, { name: "사막", score: 0.85 }, { name: "전통시장", score: 0.75 }],
    touristSpots: [
      { name: "Pyramids of Giza", koName: "기자 피라미드", lat: 29.9792, lon: 31.1342, score: 0.99, tags: ["유적지", "사막"] },
    ],
  },
  {
    id: 228, nameEn: "Buenos Aires", countryNameEn: "Argentina", lat: -34.6037, lon: -58.3816, imageKey: "buenosaires",
    food: 18000, transportation: 6000, accommodation: 65000, riskLevel: 0,
    tags: [{ name: "건축", score: 0.85 }, { name: "나이트라이프", score: 0.85 }, { name: "와인", score: 0.8 }],
    touristSpots: [
      { name: "La Boca", koName: "라보카", lat: -34.6345, lon: -58.3631, score: 0.88, tags: ["건축", "전통시장"] },
    ],
  },
  {
    id: 229, nameEn: "Toronto", countryNameEn: "Canada", lat: 43.6532, lon: -79.3832, imageKey: "toronto",
    food: 36000, transportation: 10000, accommodation: 140000, riskLevel: 0,
    tags: [{ name: "건축", score: 0.85 }, { name: "쇼핑몰", score: 0.8 }, { name: "호수", score: 0.7 }],
    touristSpots: [
      { name: "CN Tower", koName: "CN 타워", lat: 43.6426, lon: -79.3871, score: 0.93, tags: ["건축", "야경"] },
    ],
  },
];

export const findCity = (id: number) => MOCK_CITIES.find((c) => c.id === id);
export const findRichCountry = (nameEn: string) =>
  RICH_COUNTRIES.find((c) => c.nameEn === nameEn);

export { SEOUL_CITY_ID, SEOUL_COUNTRY_ID };

// ── 태그 (선호도/관심 태그) ──────────────────────────────────────────────────
export interface MockTagCategory {
  categoryId: number;
  categoryName: string;
  tags: string[];
}

export const TAG_CATEGORIES: MockTagCategory[] = [
  { categoryId: 1, categoryName: "자연/풍경", tags: ["해변", "산", "호수", "사막", "오로라"] },
  { categoryId: 2, categoryName: "음식/미식", tags: ["길거리음식", "미슐랭", "카페", "와인", "해산물"] },
  { categoryId: 3, categoryName: "문화/역사", tags: ["유적지", "박물관", "사원", "건축", "전통시장"] },
  { categoryId: 4, categoryName: "액티비티/모험", tags: ["스노클링", "트레킹", "스카이다이빙", "서핑", "스키"] },
  { categoryId: 5, categoryName: "휴양/힐링", tags: ["스파", "온천", "리조트", "크루즈", "캠핑"] },
  { categoryId: 6, categoryName: "쇼핑/도시", tags: ["쇼핑몰", "야경", "나이트라이프", "페스티벌", "테마파크"] },
];

// ── 환율 (KRW 기준, 1 외화 단위당 원화) — 데모용 고정 근사값 ──────────────────
export const CURRENCY_KRW_PER_UNIT: Record<string, number> = {
  KRW: 1,
  JPY: 9.2,
  USD: 1380,
  EUR: 1480,
  GBP: 1720,
  CHF: 1520,
  AED: 376,
  THB: 38,
  VND: 0.054,
  BRL: 245,
  AUD: 890,
  CAD: 990,
  SGD: 1010,
  EGP: 27,
  ARS: 1.3,
  MVR: 88,
  MAD: 136,
};

export interface MockExchangeInfo {
  currency: string;
  krwPer1Target: number;
  rate1KrwToTarget: number;
  displayUnit: number;
  displaySymbol: string;
  krwPerDisplayUnit: number;
}

export const getExchangeInfo = (currency: string): MockExchangeInfo => {
  const krwPer1Target = CURRENCY_KRW_PER_UNIT[currency] ?? 1000;
  const displayUnit = currency === "JPY" || currency === "VND" ? 100 : 1;
  return {
    currency,
    krwPer1Target,
    rate1KrwToTarget: 1 / krwPer1Target,
    displayUnit,
    displaySymbol: currency,
    krwPerDisplayUnit: krwPer1Target * displayUnit,
  };
};

export const ALL_TAGS: { tagId: number; categoryId: number; tagName: string; categoryName: string }[] =
  TAG_CATEGORIES.flatMap((cat, catIdx) =>
    cat.tags.map((tagName, tagIdx) => ({
      tagId: catIdx * 5 + tagIdx + 1,
      categoryId: cat.categoryId,
      tagName,
      categoryName: cat.categoryName,
    })),
  );
