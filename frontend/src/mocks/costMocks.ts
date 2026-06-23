import {
  MOCK_CITIES,
  RICH_COUNTRIES,
  findCity,
  findCountryByName,
  findRichCountry,
  getExchangeInfo,
  resolveImage,
  type MockCity,
  type RichCountry,
} from './sharedData';

function dailyTotal(city: MockCity) {
  return city.food + city.transportation + city.accommodation;
}

// 국가 단위 식료품/외식/기타 단가는 한국(서울)을 기준값(1.0)으로 스케일링
const BASE_GROCERIES = {
  milk: 2800, bread: 4500, rice: 56000, egg: 6500, chicken: 12000, steak: 18000,
  apple: 1000, banana: 600, orange: 1200, tomato: 800, potato: 700, onion: 500,
  water: 1000, coke: 1800, wine: 15000, beer: 2200, cigarette: 4500,
  coldMedicine: 6000, shampoo: 9000, toiletPaper: 5000, toothpaste: 3500,
};
const BASE_EATING_OUT = {
  lunchMenu: 10000, dinnerInAResturantFor2: 60000, fastFoodMeal: 8000,
  beerInAPub: 6000, cappuccino: 5000, cokePepsi: 2500,
};
const BASE_TRANSPORTATION = {
  localTransportTicket: 1500, monthlyTicketLocalTransport: 65000,
  taxiRide: 5000, gasPetrol: 1700,
};
const BASE_OTHER = {
  gymMonth: 60000, cinemaTicket: 14000, haircut: 20000,
  brandJeans: 90000, brandSneakers: 130000,
};

function scaleRecord<T extends Record<string, number>>(base: T, multiplier: number): T {
  return Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, Math.round((v * multiplier) / 10) * 10]),
  ) as T;
}

function buildLivingCost(food: number, transportation: number, accommodation: number, population: number, salaryAfterTaxMedian: number) {
  const multiplier = food / 24000; // 서울 평균 식비 기준
  const dailyBudget = food + transportation + accommodation;
  return {
    id: Math.round(dailyBudget),
    dailyBudget,
    withoutRent: food + transportation,
    food,
    transport: transportation,
    monthlySalaryAfterTax: salaryAfterTaxMedian,
    population,
    eatingOut: scaleRecord(BASE_EATING_OUT, multiplier),
    transportation: scaleRecord(BASE_TRANSPORTATION, multiplier),
    groceries: scaleRecord(BASE_GROCERIES, multiplier),
    other: scaleRecord(BASE_OTHER, multiplier),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function cityTarget(city: MockCity) {
  const country = findRichCountry(city.countryNameEn);
  return {
    id: city.id,
    name: city.nameEn,
    parentRegion: city.countryNameEn,
    currency: country?.currency ?? 'USD',
    imgUrl: resolveImage(city.imageKey),
    livingCost: buildLivingCost(
      city.food,
      city.transportation,
      city.accommodation,
      country?.population ?? 1000000,
      country?.salaryAfterTaxMedian ?? 1000000,
    ),
  };
}

function countryTarget(country: RichCountry) {
  const meta = findCountryByName(country.nameEn);
  const food = Math.round(country.dailyBudgetKRW * 0.4);
  const transportation = Math.round(country.dailyBudgetKRW * 0.15);
  const accommodation = country.dailyBudgetKRW - food - transportation;
  return {
    id: meta?.id ?? 0,
    name: country.nameEn,
    parentRegion: country.continent,
    currency: country.currency,
    imgUrl: resolveImage(country.imgUrl),
    livingCost: buildLivingCost(food, transportation, accommodation, country.population, country.salaryAfterTaxMedian),
  };
}

// GET /api/cost/detail?targetType=CITY|COUNTRY&targetId=XXX
export function getMockCostDetailRaw(targetType: 'CITY' | 'COUNTRY', targetId: number) {
  if (targetType === 'CITY') {
    const city = findCity(targetId);
    if (!city) throw new Error(`Mock city not found: ${targetId}`);
    const t = cityTarget(city);
    return { targetType: 'city', target: t, livingCost: t.livingCost };
  }
  const country = RICH_COUNTRIES.find((c) => findCountryByName(c.nameEn)?.id === targetId);
  if (!country) throw new Error(`Mock country not found: ${targetId}`);
  const t = countryTarget(country);
  return { targetType: 'country', target: t, livingCost: t.livingCost };
}

function buildItemComparison(baseLiving: ReturnType<typeof buildLivingCost>, targetLiving: ReturnType<typeof buildLivingCost>) {
  const items: { itemKey: string; itemName: string; basePrice: number; targetPrice: number }[] = [
    { itemKey: 'cappuccino', itemName: '카푸치노', basePrice: baseLiving.eatingOut.cappuccino, targetPrice: targetLiving.eatingOut.cappuccino },
    { itemKey: 'lunchMenu', itemName: '점심 식사', basePrice: baseLiving.eatingOut.lunchMenu, targetPrice: targetLiving.eatingOut.lunchMenu },
    { itemKey: 'localTransportTicket', itemName: '대중교통 1회권', basePrice: baseLiving.transportation.localTransportTicket, targetPrice: targetLiving.transportation.localTransportTicket },
    { itemKey: 'beer', itemName: '맥주(편의점)', basePrice: baseLiving.groceries.beer, targetPrice: targetLiving.groceries.beer },
    { itemKey: 'taxiRide', itemName: '택시 기본요금', basePrice: baseLiving.transportation.taxiRide, targetPrice: targetLiving.transportation.taxiRide },
    { itemKey: 'water', itemName: '생수 500ml', basePrice: baseLiving.groceries.water, targetPrice: targetLiving.groceries.water },
  ];
  return items.map((item) => ({
    ...item,
    difference: item.targetPrice - item.basePrice,
    differencePercent: item.basePrice === 0 ? 0 : Math.round(((item.targetPrice - item.basePrice) / item.basePrice) * 1000) / 10,
  }));
}

// GET /api/cost/compare?targetType=CITY|COUNTRY&baseId=&targetId=
export function getMockCostCompareRaw(targetType: 'CITY' | 'COUNTRY', baseId: number, targetId: number) {
  const base = targetType === 'CITY' ? cityTarget(findCity(baseId)!) : countryTarget(RICH_COUNTRIES.find((c) => findCountryByName(c.nameEn)?.id === baseId)!);
  const target = targetType === 'CITY' ? cityTarget(findCity(targetId)!) : countryTarget(RICH_COUNTRIES.find((c) => findCountryByName(c.nameEn)?.id === targetId)!);

  const currency = target.currency;
  const baseDailyBudget = base.livingCost.dailyBudget;
  const targetDailyBudget = target.livingCost.dailyBudget;
  const dailyBudgetGap = targetDailyBudget - baseDailyBudget;
  const dailyBudgetGapPercent = baseDailyBudget === 0 ? 0 : Math.round((dailyBudgetGap / baseDailyBudget) * 1000) / 10;

  const baseDailyIncome = Math.round(base.livingCost.monthlySalaryAfterTax / 30);
  const targetDailyIncome = Math.round(target.livingCost.monthlySalaryAfterTax / 30);
  const baseLocalCostBurdenPercent = baseDailyIncome === 0 ? 0 : Math.round((base.livingCost.withoutRent / baseDailyIncome) * 1000) / 10;
  const targetLocalCostBurdenPercent = targetDailyIncome === 0 ? 0 : Math.round((target.livingCost.withoutRent / targetDailyIncome) * 1000) / 10;

  return {
    base,
    target,
    costCompare: {
      currency,
      baseDailyBudget,
      targetDailyBudget,
      dailyBudgetGap,
      dailyBudgetGapPercent,
      summary: dailyBudgetGap >= 0
        ? `${target.name}의 하루 예산이 ${base.name}보다 ${Math.abs(dailyBudgetGapPercent)}% 더 높습니다.`
        : `${target.name}의 하루 예산이 ${base.name}보다 ${Math.abs(dailyBudgetGapPercent)}% 더 저렴합니다.`,
    },
    expectedTargetDailyBudget: {
      currency,
      total: targetDailyBudget,
      breakdown: {
        food: target.livingCost.food,
        transport: target.livingCost.transport,
        accommodation: targetDailyBudget - target.livingCost.withoutRent,
      },
      calculationNotes: [],
    },
    itemComparison: {
      currency,
      base: base.name,
      target: target.name,
      items: buildItemComparison(base.livingCost, target.livingCost),
    },
    localCostCompare: {
      currency,
      baseLocalDailyCost: base.livingCost.withoutRent,
      targetLocalDailyCost: target.livingCost.withoutRent,
      localDailyCostGap: target.livingCost.withoutRent - base.livingCost.withoutRent,
      localDailyCostGapPercent: base.livingCost.withoutRent === 0 ? 0 : Math.round(((target.livingCost.withoutRent - base.livingCost.withoutRent) / base.livingCost.withoutRent) * 1000) / 10,
    },
    affordabilityCompare: {
      currency,
      baseDailyIncome,
      targetDailyIncome,
      baseLocalCostBurdenPercent,
      targetLocalCostBurdenPercent,
      burdenGapPercentPoint: Math.round((targetLocalCostBurdenPercent - baseLocalCostBurdenPercent) * 10) / 10,
      targetMoreAffordable: targetLocalCostBurdenPercent <= baseLocalCostBurdenPercent,
    },
  };
}

// GET /api/cost/card?mode=TOP — 한국인이 많이 찾는 인기 여행지 TOP5 (국가 단위)
const TOP_COUNTRY_NAMES = ['Japan', 'Vietnam', 'Thailand', 'Singapore', 'France'];
export function getMockCostCardRaw() {
  return {
    cards: TOP_COUNTRY_NAMES.map((nameEn, idx) => {
      const country = findRichCountry(nameEn)!;
      const meta = findCountryByName(nameEn)!;
      return {
        rank: idx + 1,
        id: meta.id,
        name: nameEn,
        imgUrl: resolveImage(country.imgUrl),
        dailyBudget: country.dailyBudgetKRW,
      };
    }),
  };
}

// GET /api/cost/card?mode=SEARCH&type=CONTINENT|COUNTRY&keyword=&sort=
export function getMockCostSearchRaw(type: 'CONTINENT' | 'COUNTRY', keyword: string, sort: 'ASC' | 'DESC') {
  let cards: { rank: number; id: number; name: string; danger?: { countryName: string }; imgUrl: string; dailyBudget: number }[];

  if (type === 'CONTINENT') {
    const normalized = keyword.trim().toLowerCase();
    cards = RICH_COUNTRIES
      .filter((c) => c.continent.toLowerCase() === normalized)
      .map((c) => {
        const meta = findCountryByName(c.nameEn)!;
        return { rank: 0, id: meta.id, name: c.nameEn, imgUrl: resolveImage(c.imgUrl), dailyBudget: c.dailyBudgetKRW };
      });
  } else {
    const cities = keyword === '' ? MOCK_CITIES : MOCK_CITIES.filter((c) => c.countryNameEn === keyword);
    cards = cities.map((city) => ({
      rank: 0,
      id: city.id,
      name: city.nameEn,
      danger: { countryName: city.countryNameEn },
      imgUrl: resolveImage(city.imageKey),
      dailyBudget: dailyTotal(city),
    }));
  }

  cards.sort((a, b) => (sort === 'ASC' ? a.dailyBudget - b.dailyBudget : b.dailyBudget - a.dailyBudget));
  cards.forEach((c, i) => { c.rank = i + 1; });
  return { cards };
}

// GET /api/exchange-rate?currency=XXX
export function getMockExchangeRateNewRaw(currency: string) {
  const info = getExchangeInfo(currency);
  return {
    target: info.currency,
    eventDate: new Date().toISOString().slice(0, 10),
    rate1krwToTarget: info.rate1KrwToTarget,
    krwPer1target: info.krwPer1Target,
    displayUnit: info.displayUnit,
    displaySymbol: info.displaySymbol,
    krwPerDisplayUnit: info.krwPerDisplayUnit,
    updatedAt: new Date().toISOString(),
  };
}

// GET /api/exchange-rate/history?targetCurrency=XXX&type=D|W|M
export function getMockExchangeRateHistoryRaw(targetCurrency: string, type: 'D' | 'W' | 'M') {
  const info = getExchangeInfo(targetCurrency);
  const points = type === 'D' ? 14 : type === 'W' ? 12 : 12;
  const stepDays = type === 'D' ? 1 : type === 'W' ? 7 : 30;
  const history = Array.from({ length: points }, (_, i) => {
    const daysAgo = (points - 1 - i) * stepDays;
    const wiggle = 1 + Math.sin(i / 2) * 0.01;
    const rate1krwToTarget = info.rate1KrwToTarget * wiggle;
    return {
      date: new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10),
      rate1krwToTarget,
      krwPer1target: 1 / rate1krwToTarget,
    };
  });
  return {
    baseCurrency: 'KRW',
    targetCurrency: info.currency,
    type,
    latest: {
      eventDate: history[history.length - 1].date,
      rate1krwToTarget: history[history.length - 1].rate1krwToTarget,
      krwPer1target: history[history.length - 1].krwPer1target,
      displayUnit: info.displayUnit,
      displaySymbol: info.displaySymbol,
      krwPerDisplayUnit: history[history.length - 1].krwPer1target * info.displayUnit,
    },
    history,
  };
}
