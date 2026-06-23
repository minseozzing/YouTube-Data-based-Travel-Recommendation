import { findCity } from './sharedData';

/**
 * 백엔드 없는 mock 모드의 항공권 알림 구독 저장소 (localStorage 영속화).
 * 알림 발송(가격 매칭 알림)은 시뮬레이션하지 않고 항상 빈 목록을 반환한다.
 */
const STORAGE_KEY = 'dahaeng-mock-flight-alerts';

interface StoredSubscription {
  subscriptionId: number;
  cityId: number;
  thresholdPrice: number;
  enabled: boolean;
}

function load(): StoredSubscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list: StoredSubscription[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

let memory: StoredSubscription[] | null = null;
function store(): StoredSubscription[] {
  if (memory === null) memory = load();
  return memory;
}

function toFull(sub: StoredSubscription) {
  const city = findCity(sub.cityId);
  return {
    subscriptionId: sub.subscriptionId,
    cityId: sub.cityId,
    cityName: city?.nameEn ?? '',
    countryName: city?.countryNameEn ?? '',
    thresholdPrice: sub.thresholdPrice,
    enabled: sub.enabled,
    lastNotifiedPrice: null,
    lastNotifiedAt: null,
  };
}

export function mockGetSubscriptions() {
  return store().map(toFull);
}

export function mockUpsertSubscription(cityId: number, thresholdPrice: number) {
  const list = store();
  let sub = list.find((s) => s.cityId === cityId);
  if (!sub) {
    sub = { subscriptionId: list.length > 0 ? Math.max(...list.map((s) => s.subscriptionId)) + 1 : 1, cityId, thresholdPrice, enabled: true };
    list.push(sub);
  } else {
    sub.thresholdPrice = thresholdPrice;
    sub.enabled = true;
  }
  save(list);
  return toFull(sub);
}

export function mockDeleteSubscription(cityId: number) {
  const list = store();
  const idx = list.findIndex((s) => s.cityId === cityId);
  const id = idx !== -1 ? list[idx].subscriptionId : 0;
  if (idx !== -1) list.splice(idx, 1);
  save(list);
  return { message: '알림 구독이 삭제되었습니다.', id };
}
