import { ALL_COUNTRIES, flagUrl } from './sharedData';

// GET /api/country/list — 백엔드 원시 응답 형태: { id, countryName, imgUrl }[]
export function getMockCountryListRaw() {
  return ALL_COUNTRIES.map((c) => ({
    id: c.id,
    countryName: c.nameEn,
    imgUrl: flagUrl(c.iso2),
  }));
}
