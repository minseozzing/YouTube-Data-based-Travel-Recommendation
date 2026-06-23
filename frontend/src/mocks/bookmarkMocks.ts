/**
 * 백엔드 없는 mock 모드의 북마크 저장소 — localStorage에 영속화하여
 * 새로고침 후에도 북마크가 유지되도록 한다 (세션 한정 in-memory 보완).
 */
const STORAGE_KEY = 'dahaeng-mock-bookmarks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface StoredBookmark {
  id: number;
  cityId: number;
  recommendId: string;
  json: any;
  title: string;
  savedAt: string;
}

function load(): StoredBookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(list: StoredBookmark[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage 사용 불가(프라이빗 모드 등) — 세션 내 메모리만 유지
  }
}

let memory: StoredBookmark[] | null = null;
function store(): StoredBookmark[] {
  if (memory === null) memory = load();
  return memory;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mockBookmarkCreate(body: { cityId: number; recommendId: string; json: any; title: string }) {
  const list = store();
  if (list.some((b) => b.cityId === body.cityId)) {
    const err = new Error('이미 북마크된 도시입니다.') as Error & { response?: { status: number } };
    err.response = { status: 400 };
    throw err;
  }
  const id = list.length > 0 ? Math.max(...list.map((b) => b.id)) + 1 : 1;
  const entry: StoredBookmark = { id, ...body, savedAt: new Date().toISOString() };
  list.unshift(entry);
  save(list);
  return { message: '북마크가 저장되었습니다.', id };
}

export function mockBookmarkList(params: { keyword?: string; page?: number; size?: number }) {
  const { keyword, page = 0, size = 10 } = params;
  let list = store();
  if (keyword) {
    const kw = keyword.toLowerCase();
    list = list.filter((b) =>
      b.title.toLowerCase().includes(kw) ||
      String(b.json?.cityName ?? '').toLowerCase().includes(kw) ||
      String(b.json?.countryName ?? '').toLowerCase().includes(kw),
    );
  }
  const totalElements = list.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const content = list.slice(page * size, page * size + size).map((b) => ({
    id: b.id,
    cityId: b.cityId,
    cityName: b.json?.cityName ?? '',
    countryName: b.json?.countryName || b.json?.danger?.countryName || '',
    imgUrl: b.json?.imgUrl || null,
    createdAt: b.savedAt,
    title: b.title,
  }));
  return { content, page, size, totalElements, totalPages, hasNext: page + 1 < totalPages };
}

// 북마크 상세 raw — bookmark.api.ts의 parseBookmarkDetail()이 기대하는 형태
export function mockBookmarkGetRaw(bookmarkId: number) {
  const entry = store().find((b) => b.id === bookmarkId);
  if (!entry) throw new Error(`Mock bookmark not found: ${bookmarkId}`);
  return {
    json: entry.json,
    savedAt: entry.savedAt,
    title: entry.title,
    currentExchange: { krwPerDisplayUnit: entry.json?.exchangeRate?.krwPerDisplayUnit ?? 0 },
  };
}

export function mockBookmarkUpdateTitle(bookmarkId: number, title: string) {
  const list = store();
  const entry = list.find((b) => b.id === bookmarkId);
  if (!entry) throw new Error(`Mock bookmark not found: ${bookmarkId}`);
  entry.title = title;
  save(list);
  return mockBookmarkGetRaw(bookmarkId);
}

export function mockBookmarkRemove(bookmarkId: number) {
  const list = store();
  const idx = list.findIndex((b) => b.id === bookmarkId);
  if (idx !== -1) list.splice(idx, 1);
  save(list);
  return { message: '북마크가 삭제되었습니다.', id: bookmarkId };
}
