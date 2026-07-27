import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type CreateFaqCategoryRequest = {
  categoryName: string;
};

export type FaqCategoryRecord = {
  _id: string;
  code: string;
  categoryName: string;
};

export type FaqCategorySingleData = {
  record: FaqCategoryRecord;
};

export type CreateFaqCategoryResponse = ApiEnvelope<FaqCategorySingleData>;

export type FaqCategoryListData = {
  records: FaqCategoryRecord[];
  pagination: PaginationInfo;
};

export type ListFaqCategoriesResponse = ApiEnvelope<FaqCategoryListData>;

export type GetFaqCategoryResponse = ApiEnvelope<FaqCategorySingleData>;

export type UpdateFaqCategoryRequest = {
  categoryCode: string;
  categoryName: string;
};

export type UpdateFaqCategoryResponse = ApiEnvelope<FaqCategorySingleData>;

export type DeleteFaqCategoryResponse = ApiEnvelope<FaqCategorySingleData>;

export type FaqRecord = {
  _id?: string;
  code: string;
  categoryCode: string;
  question: string;
  answer: string;
};

export type FaqSingleData = {
  record: FaqRecord;
};

export type CreateFaqRequest = {
  categoryCode: string;
  question: string;
  answer: string;
};

export type CreateFaqResponse = ApiEnvelope<FaqSingleData>;

export type ListFaqsParams = ListParams & {
  categoryCode?: string;
};

export type FaqListData = {
  records: FaqRecord[];
  pagination: PaginationInfo;
};

export type ListFaqsResponse = ApiEnvelope<FaqListData>;

export type GetFaqResponse = ApiEnvelope<FaqSingleData>;

export type UpdateFaqRequest = {
  faqCode: string;
  question: string;
  answer: string;
};

export type UpdateFaqResponse = ApiEnvelope<FaqSingleData>;

export type DeleteFaqResponse = ApiEnvelope<FaqSingleData>;

export const faqApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createFaqCategory: builder.mutation<CreateFaqCategoryResponse, CreateFaqCategoryRequest>({
      query: (body) => ({
        url: "/api/v1/common/category/faq/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["FaqCategory"],
    }),
    listFaqCategories: builder.query<ListFaqCategoriesResponse, ListParams>({
      query: ({ pageNumber, pageSize, sort }) => ({
        url: "/api/v1/common/category/faq/list",
        method: "get",
        params: { pageNumber, pageSize, sort },
      }),
      providesTags: ["FaqCategory"],
    }),
    getFaqCategory: builder.query<GetFaqCategoryResponse, string>({
      query: (categoryCode) => ({
        url: `/api/v1/common/category/faq/${categoryCode}`,
        method: "get",
      }),
    }),
    updateFaqCategory: builder.mutation<UpdateFaqCategoryResponse, UpdateFaqCategoryRequest>({
      query: (body) => ({
        url: "/api/v1/common/category/faq/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["FaqCategory"],
    }),
    deleteFaqCategory: builder.mutation<DeleteFaqCategoryResponse, string>({
      query: (categoryCode) => ({
        url: `/api/v1/common/category/faq/${categoryCode}`,
        method: "delete",
      }),
      invalidatesTags: ["FaqCategory"],
    }),
    createFaq: builder.mutation<CreateFaqResponse, CreateFaqRequest>({
      query: (body) => ({
        url: "/api/v1/common/faq/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["Faq"],
    }),
    listFaqs: builder.query<ListFaqsResponse, ListFaqsParams>({
      query: ({ pageNumber, pageSize, sort, categoryCode }) => ({
        url: "/api/v1/common/faq/list",
        method: "get",
        params: { pageNumber, pageSize, sort, categoryCode },
      }),
      providesTags: ["Faq"],
    }),
    getFaq: builder.query<GetFaqResponse, string>({
      query: (faqCode) => ({
        url: `/api/v1/common/faq/${faqCode}`,
        method: "get",
      }),
    }),
    updateFaq: builder.mutation<UpdateFaqResponse, UpdateFaqRequest>({
      query: (body) => ({
        url: "/api/v1/common/faq/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["Faq"],
    }),
    deleteFaq: builder.mutation<DeleteFaqResponse, string>({
      query: (faqCode) => ({
        url: `/api/v1/common/faq/${faqCode}`,
        method: "delete",
      }),
      invalidatesTags: ["Faq"],
    }),
  }),
  // See supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useCreateFaqCategoryMutation,
  useListFaqCategoriesQuery,
  useLazyGetFaqCategoryQuery,
  useUpdateFaqCategoryMutation,
  useDeleteFaqCategoryMutation,
  useCreateFaqMutation,
  useListFaqsQuery,
  useLazyGetFaqQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
