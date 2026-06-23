import { findCity } from './sharedData';

// GET /api/{cityId}/places
export function getMockPlacesRaw(cityId: number) {
  const city = findCity(cityId);
  if (!city) return [];
  return city.touristSpots.map((spot, idx) => ({
    id: idx + 1,
    name: spot.name,
    koName: spot.koName,
    address: null,
    socialUrl: null,
    websiteUrl: null,
    lat: spot.lat,
    lon: spot.lon,
    tags: spot.tags.map((tagName) => ({ tagName, score: spot.score })),
  }));
}
