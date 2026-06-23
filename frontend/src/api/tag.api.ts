import { axiosInstance } from "./axiosInstance";
import { z } from "zod";
import { getMockTagListRaw } from "@/mocks/tagMocks";

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 */
const USE_MOCK_TAG_API = true;

export const TagItemSchema = z.object({
  tagId: z.number(),
  categoryId: z.number(),
  tagName: z.string(),
  categoryName: z.string(),
});
export type TagItem = z.infer<typeof TagItemSchema>;

export const tagApi = {
  // GET /api/tag — 인증 불필요 (PUBLIC_URLS)
  getList: async (): Promise<TagItem[]> => {
    const data = USE_MOCK_TAG_API
      ? getMockTagListRaw()
      : (await axiosInstance.get("/api/tag")).data;
    return z.array(TagItemSchema).parse(data);
  },
};
