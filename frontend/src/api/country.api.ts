import { axiosInstance } from "./axiosInstance";
import { z } from "zod";
import { getMockCountryListRaw } from "@/mocks/countryMocks";

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 */
const USE_MOCK_COUNTRY_API = true;

const CountryListItemSchema = z.object({
  id: z.number(),
  countryName: z.string(),
  imgUrl: z.string().nullable(),
});

export interface CountryMaps {
  flagMap: Map<string, string>;
  idMap: Map<string, number>;
}

export const countryApi = {
  // GET /api/country/list → { flagMap, idMap }
  getCountryMaps: async (): Promise<CountryMaps> => {
    const data = USE_MOCK_COUNTRY_API
      ? getMockCountryListRaw()
      : (await axiosInstance.get("/api/country/list")).data;
    const parsed = z.array(CountryListItemSchema).parse(data);
    const flagMap = new Map(
      parsed
        .filter((c) => c.imgUrl)
        .map((c) => [c.countryName, c.imgUrl!]),
    );
    const idMap = new Map(parsed.map((c) => [c.countryName, c.id]));
    return { flagMap, idMap };
  },
};
