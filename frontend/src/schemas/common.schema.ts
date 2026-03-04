import { z } from 'zod';

// 공통 API 응답 래퍼: { httpStatusCode, responseMessage, data }
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    httpStatusCode: z.number(),
    responseMessage: z.string(),
    data: dataSchema,
  });

export type ApiResponse<T> = {
  httpStatusCode: number;
  responseMessage: string;
  data: T;
};
