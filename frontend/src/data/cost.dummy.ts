import type {
  ExchangeRateNew,
  ExchangeRateHistory,
  CostDetail,
  CostCompare,
} from '@/schemas/cost.schema';

// ── A. /api/exchange-rate?currency=JPY ───────────────────────────────────────
export const DUMMY_EXCHANGE_RATE: ExchangeRateNew = {
  base: 'KRW',
  target: 'JPY',
  rate: 0.11,
  asOf: '2026-03-08',
  meta: {
    lastUpdatedAt: '2026-03-08T01:00:00Z',
    source: 'fx_provider_v1',
  },
};

// ── B. /api/exchange-rate/history (일별/주별/월별) ────────────────────────────
const EXCHANGE_LATEST = {
  event_date: '2026-03-08',
  rate_1krw_to_target: 0.11,
  krw_per_1target: 9.09,
  display_unit: 100,
  display_symbol: 'JPY(100)',
  krw_per_display_unit: 909.0,
};

export const DUMMY_EXCHANGE_RATE_HISTORY_D: ExchangeRateHistory = {
  base_currency: 'KRW',
  target_currency: 'JPY',
  type: 'd',
  latest: EXCHANGE_LATEST,
  trend: [
    { date: '2026-03-02', rate_1krw_to_target: 0.108, krw_per_1target: 9.26 },
    { date: '2026-03-03', rate_1krw_to_target: 0.109, krw_per_1target: 9.17 },
    { date: '2026-03-04', rate_1krw_to_target: 0.109, krw_per_1target: 9.17 },
    { date: '2026-03-05', rate_1krw_to_target: 0.108, krw_per_1target: 9.26 },
    { date: '2026-03-06', rate_1krw_to_target: 0.110, krw_per_1target: 9.09 },
    { date: '2026-03-07', rate_1krw_to_target: 0.111, krw_per_1target: 9.01 },
    { date: '2026-03-08', rate_1krw_to_target: 0.110, krw_per_1target: 9.09 },
  ],
};

export const DUMMY_EXCHANGE_RATE_HISTORY_W: ExchangeRateHistory = {
  base_currency: 'KRW',
  target_currency: 'JPY',
  type: 'w',
  latest: EXCHANGE_LATEST,
  trend: [
    { date: '2026-01-19', rate_1krw_to_target: 0.106, krw_per_1target: 9.43 },
    { date: '2026-01-26', rate_1krw_to_target: 0.107, krw_per_1target: 9.35 },
    { date: '2026-02-02', rate_1krw_to_target: 0.108, krw_per_1target: 9.26 },
    { date: '2026-02-09', rate_1krw_to_target: 0.109, krw_per_1target: 9.17 },
    { date: '2026-02-16', rate_1krw_to_target: 0.110, krw_per_1target: 9.09 },
    { date: '2026-02-23', rate_1krw_to_target: 0.111, krw_per_1target: 9.01 },
    { date: '2026-03-02', rate_1krw_to_target: 0.110, krw_per_1target: 9.09 },
  ],
};

export const DUMMY_EXCHANGE_RATE_HISTORY_M: ExchangeRateHistory = {
  base_currency: 'KRW',
  target_currency: 'JPY',
  type: 'm',
  latest: EXCHANGE_LATEST,
  trend: [
    { date: '2025-09-01', rate_1krw_to_target: 0.104, krw_per_1target: 9.62 },
    { date: '2025-10-01', rate_1krw_to_target: 0.105, krw_per_1target: 9.52 },
    { date: '2025-11-01', rate_1krw_to_target: 0.107, krw_per_1target: 9.35 },
    { date: '2025-12-01', rate_1krw_to_target: 0.108, krw_per_1target: 9.26 },
    { date: '2026-01-01', rate_1krw_to_target: 0.109, krw_per_1target: 9.17 },
    { date: '2026-02-01', rate_1krw_to_target: 0.111, krw_per_1target: 9.01 },
    { date: '2026-03-01', rate_1krw_to_target: 0.110, krw_per_1target: 9.09 },
  ],
};

// 타입별 더미 선택 헬퍼
export const DUMMY_EXCHANGE_RATE_HISTORY: ExchangeRateHistory = DUMMY_EXCHANGE_RATE_HISTORY_M;

// ── Seoul 기준 더미 (city_id=1) ───────────────────────────────────────────────
export const DUMMY_SEOUL_COST_DETAIL: CostDetail = {
  target_type: 'city',
  target: { id: 1, name: 'Seoul', continent: 'Asia', currency: 'USD' },
  living_cost: {
    id: 1,
    daily_budget: 55.0,
    without_rent: 780.0,
    food: 320.0,
    transport: 90.0,
    monthly_salary_after_tax: 2500.0,
    population: 9776000,
    eating_out: {
      lunch_menu: 8.0,
      dinner_in_a_resturant_for_2: 48.0,
      fast_food_meal: 6.5,
      beer_in_a_pub: 4.5,
      cappuccino: 4.2,
      coke_pepsi: 1.7,
    },
    transportation: {
      local_transport_ticket: 1.4,
      monthly_ticket_local_transport: 55.0,
      taxi_ride: 9.5,
      gas_pterol: 1.55,
    },
    groceries: {
      milk: 2.0, bread: 2.2, rice: 3.0, egg: 2.0,
      chicken: 5.5, steak: 12.0, apple: 3.5, banana: 1.8,
      orange: 3.0, tomato: 2.5, potato: 1.5, onion: 1.3,
      water: 0.7, coke: 1.5, wine: 10.0, beer: 2.0,
      cigarette: 4.5, cold_medicine: 7.0, shampoo: 5.0,
      toilet_paper: 2.8, toothpaste: 2.5,
    },
    other: {
      gym_month: 38.0,
      cinema_ticket: 10.0,
      haircut: 14.0,
      brand_jeans: 65.0,
      brand_sneakers: 85.0,
    },
    created_at: '2026-03-08T10:00:00',
    updated_at: '2026-03-08T10:00:00',
  },
};

// ── C. /api/cost/detail?target_type=city&target_id=120 ───────────────────────
export const DUMMY_COST_DETAIL: CostDetail = {
  target_type: 'city',
  target: {
    id: 120,
    name: 'Tokyo',
    continent: 'Asia',
    currency: 'USD',
    img_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
  },
  living_cost: {
    id: 15,
    daily_budget: 73.4,
    without_rent: 980.0,
    food: 420.0,
    transport: 130.0,
    monthly_salary_after_tax: 2200.0,
    population: 13960000,
    eating_out: {
      lunch_menu: 10.0,
      dinner_in_a_resturant_for_2: 55.0,
      fast_food_meal: 7.5,
      beer_in_a_pub: 5.2,
      cappuccino: 4.0,
      coke_pepsi: 2.0,
    },
    transportation: {
      local_transport_ticket: 2.3,
      monthly_ticket_local_transport: 80.0,
      taxi_ride: 14.0,
      gas_pterol: 1.6,
    },
    groceries: {
      milk: 1.8,
      bread: 2.4,
      rice: 3.5,
      egg: 2.2,
      chicken: 7.8,
      steak: 18.0,
      apple: 3.2,
      banana: 1.5,
      orange: 2.8,
      tomato: 2.4,
      potato: 1.6,
      onion: 1.3,
      water: 0.9,
      coke: 1.8,
      wine: 14.0,
      beer: 2.8,
      cigarette: 5.5,
      cold_medicine: 8.0,
      shampoo: 6.0,
      toilet_paper: 3.5,
      toothpaste: 3.0,
    },
    other: {
      gym_month: 50.0,
      cinema_ticket: 13.0,
      haircut: 22.0,
      brand_jeans: 80.0,
      brand_sneakers: 105.0,
    },
    created_at: '2026-03-08T10:00:00',
    updated_at: '2026-03-08T10:00:00',
  },
};

// ── D. /api/cost/compare/{city_id} ──────────────────────────────────────────
export const DUMMY_COST_COMPARE: CostCompare = {
  base_city: {
    id: 1,
    name: 'Seoul',
    country: 'South Korea',
    currency: 'KRW',
  },
  target_city: {
    id: 120,
    name: 'Tokyo',
    country: 'Japan',
    currency: 'JPY',
  },
  cost_vs_seoul: {
    currency: 'KRW',
    seoul_daily_budget: 150000,
    target_daily_budget: 180000,
    daily_budget_gap_krw: 30000,
    daily_budget_gap_percent: 20.0,
    summary: 'Tokyo is more expensive than Seoul based on expected daily budget.',
  },
  expected_daily_budget: {
    currency: 'KRW',
    total: 180000,
    breakdown: {
      food: 50000,
      transport: 15000,
      accommodation: 115000,
    },
    calculation_notes: [
      'food = estimated breakfast + lunch + dinner',
      'transport = average daily local transport usage',
      'accommodation = average 1 night stay cost',
    ],
  },
  item_comparison: {
    currency: 'KRW',
    base_city: 'Seoul',
    target_city: 'Tokyo',
    items: [
      { item_key: 'lunch_menu', item_name: '점심 식사', seoul_price: 12000, target_price: 15000, difference_krw: 3000, difference_percent: 25.0 },
      { item_key: 'dinner_for_2', item_name: '저녁비 (2인)', seoul_price: 70000, target_price: 82000, difference_krw: 12000, difference_percent: 17.1 },
      { item_key: 'big_mac', item_name: '빅맥지수', seoul_price: 5500, target_price: 6200, difference_krw: 700, difference_percent: 12.7 },
      { item_key: 'cappuccino', item_name: '카푸치노', seoul_price: 4800, target_price: 5600, difference_krw: 800, difference_percent: 16.7 },
      { item_key: 'coke', item_name: '콜라', seoul_price: 2200, target_price: 2500, difference_krw: 300, difference_percent: 13.6 },
      { item_key: 'bus_ticket', item_name: '버스비', seoul_price: 1500, target_price: 2100, difference_krw: 600, difference_percent: 40.0 },
      { item_key: 'taxi_8km', item_name: '택시비 (8km)', seoul_price: 12000, target_price: 18500, difference_krw: 6500, difference_percent: 54.2 },
      { item_key: 'brand_jeans', item_name: '브랜드 청바지', seoul_price: 89000, target_price: 97000, difference_krw: 8000, difference_percent: 9.0 },
      { item_key: 'brand_sneakers', item_name: '브랜드 운동화', seoul_price: 110000, target_price: 128000, difference_krw: 18000, difference_percent: 16.4 },
    ],
  },
};
