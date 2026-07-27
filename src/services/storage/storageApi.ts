import { api, type ApiEnvelope } from "../api";

export type GeneratePresignedUrlResponse = ApiEnvelope<{ url: string }>;

export const storageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    generatePresignedUrl: builder.query<GeneratePresignedUrlResponse, string>({
      query: (fileId) => ({
        url: "/api/v1/common/storage/aws/generate/presigned-url",
        method: "get",
        params: { fileId },
      }),
    }),
  }),
  overrideExisting: process.env.NODE_ENV === "development",
});

export const { useLazyGeneratePresignedUrlQuery } = storageApi;
