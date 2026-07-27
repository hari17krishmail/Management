import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";


export type ApiEnvelope<TData> = {
  result: string;
  responseObj: {
    responseCode?: number;
    responseMessage: string;
    responseDataParams: {
      data: TData;
    };
  };
};
export type PaginationInfo = {
  pageNumber: string;
  pageSize: string;
  total: number;
  pages: number;
  nextPage: boolean;
  previousPage: boolean;
};

export type ListParams = {
  pageNumber: number;
  pageSize: number;
  sort?: number;
};


export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["FaqCategory", "Faq", "VideoCategory", "Video", "Reason", "SupportTicket", "ProgramStream", "College"],
  endpoints: () => ({}),
});
