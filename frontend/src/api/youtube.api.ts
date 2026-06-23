import { axiosInstance } from "./axiosInstance";
import { z } from "zod";

export interface YoutubeSyncStatus {
  connected: boolean;
  syncEnabled: boolean | null;
  syncStatus: "PENDING" | "SYNCED" | "FAILED" | null;
  lastSyncedAt: string | null;
}

const EvidenceKeywordSchema = z.object({
  keyword: z.string(),
  sourceType: z.string(),
  score: z.number(),
});

const SourceBadgeSchema = z.object({
  sourceType: z.string(),
  percent: z.number(),
});

const TopKeywordSchema = z.object({
  keyword: z.string(),
  normalizedKeyword: z.string(),
  sourceType: z.string(),
  score: z.number(),
});

export const InterestTagSchema = z.object({
  tagId: z.number().nullish(),
  categoryName: z.string(),
  tagName: z.string(),
  score: z.number().optional(),
  confidence: z.number().optional(),
  reason: z.string().optional(),
  evidenceKeywords: z.array(EvidenceKeywordSchema).optional().default([]),
  sourceBadges: z.array(SourceBadgeSchema).optional().default([]),
});

export type InterestTag = z.infer<typeof InterestTagSchema>;
export type EvidenceKeyword = z.infer<typeof EvidenceKeywordSchema>;
export type SourceBadge = z.infer<typeof SourceBadgeSchema>;
export type TopKeyword = z.infer<typeof TopKeywordSchema>;

const InterestAnalyzeResponseSchema = z.object({
  tags: z.array(InterestTagSchema),
  topKeywords: z.array(TopKeywordSchema).optional().default([]),
});

export type InterestAnalyzeResponse = z.infer<typeof InterestAnalyzeResponseSchema>;

/**
 * 서버 구현 완료 시 false 로 변경하면 실제 API가 호출됩니다.
 * YouTube 연동은 백엔드 OAuth가 필요해 mock 모드에서는 항상 미연동 상태로 동작합니다.
 */
const USE_MOCK_YOUTUBE_API = true;

export const youtubeApi = {
  // POST /api/youtube/sync — YouTube 데이터 동기화 + 키워드 추출
  sync: async () => {
    if (USE_MOCK_YOUTUBE_API) return;
    await axiosInstance.post("/api/youtube/sync", null, { timeout: 120_000 });
  },

  // POST /api/interest/analyze — AI 태그 추론 + DB 저장
  analyze: async () => {
    if (USE_MOCK_YOUTUBE_API) return;
    await axiosInstance.post("/api/interest/analyze", null, {
      timeout: 120_000,
    });
  },

  // GET /api/youtube/sync-status — YouTube 연동 및 동기화 상태 조회
  getSyncStatus: async (): Promise<YoutubeSyncStatus> => {
    if (USE_MOCK_YOUTUBE_API) {
      return { connected: false, syncEnabled: null, syncStatus: null, lastSyncedAt: null };
    }
    const { data } = await axiosInstance.get("/api/youtube/sync-status");
    return data as YoutubeSyncStatus;
  },

  // PATCH /api/youtube/sync-preference — syncEnabled 변경
  updateSyncPreference: async (syncEnabled: boolean): Promise<void> => {
    if (USE_MOCK_YOUTUBE_API) return;
    await axiosInstance.patch("/api/youtube/sync-preference", { syncEnabled });
  },

  // GET /api/interest/analyze — 저장된 여행 태그 목록 + 풀 분석 데이터 조회
  getInterestTags: async (): Promise<{
    tagIds: number[];
    tagNames: string[];
  }> => {
    if (USE_MOCK_YOUTUBE_API) return { tagIds: [], tagNames: [] };
    const { data } = await axiosInstance.get("/api/interest/analyze");
    const parsed = InterestAnalyzeResponseSchema.safeParse(data);
    const tags = parsed.success ? parsed.data.tags : z.array(InterestTagSchema).parse(data);
    const validTags = tags.filter((t) => t.tagId != null);
    return {
      tagIds: validTags.map((t) => t.tagId!),
      tagNames: validTags.map((t) => t.tagName),
    };
  },

  // GET /api/interest/analyze — 풀 분석 데이터 (추천 이유 탭용)
  getInterestAnalysis: async (): Promise<InterestAnalyzeResponse> => {
    if (USE_MOCK_YOUTUBE_API) return { tags: [], topKeywords: [] };
    const { data } = await axiosInstance.get("/api/interest/analyze");
    const parsed = InterestAnalyzeResponseSchema.safeParse(data);
    if (parsed.success) return parsed.data;
    // 배열로 오는 경우 fallback
    const tags = z.array(InterestTagSchema).parse(data);
    return { tags, topKeywords: [] };
  },
};
