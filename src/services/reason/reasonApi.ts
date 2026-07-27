import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

// Backend calls the Support Category resource "reason" internally, even
// though the app presents it as "Support Category" everywhere in the UI.
export type ReasonRecord = {
  _id: string;
  code: string;
  reasonName: string;
  priority: string;
};

export type ReasonSingleData = {
  record: ReasonRecord;
};

export type CreateReasonRequest = {
  reasonName: string;
  priority: string;
};

export type CreateReasonResponse = ApiEnvelope<ReasonSingleData>;

export type ReasonListData = {
  records: ReasonRecord[];
  pagination: PaginationInfo;
};

export type ListReasonsResponse = ApiEnvelope<ReasonListData>;

export type UpdateReasonRequest = {
  reasonCode: string;
  reasonName: string;
  priority: string;
};

export type UpdateReasonResponse = ApiEnvelope<ReasonSingleData>;

export type DeleteReasonResponse = ApiEnvelope<ReasonSingleData>;

export const reasonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createReason: builder.mutation<CreateReasonResponse, CreateReasonRequest>({
      query: (body) => ({
        url: "/api/v1/common/reason/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["Reason"],
    }),
    listReasons: builder.query<ListReasonsResponse, ListParams>({
      query: ({ pageNumber, pageSize, sort }) => ({
        url: "/api/v1/common/reason/list",
        method: "get",
        params: { pageNumber, pageSize, sort },
      }),
      providesTags: ["Reason"],
    }),
    updateReason: builder.mutation<UpdateReasonResponse, UpdateReasonRequest>({
      query: (body) => ({
        url: "/api/v1/common/reason/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["Reason"],
    }),
    deleteReason: builder.mutation<DeleteReasonResponse, string>({
      query: (reasonCode) => ({
        url: `/api/v1/common/reason/${reasonCode}`,
        method: "delete",
      }),
      invalidatesTags: ["Reason"],
    }),
  }),
  // See supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useCreateReasonMutation,
  useListReasonsQuery,
  useUpdateReasonMutation,
  useDeleteReasonMutation,
} = reasonApi;
