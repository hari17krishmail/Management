import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type ProgramStreamRecord = {
  _id: string;
  code: string;
  streamName: string;
};

export type ProgramStreamSingleData = {
  record: ProgramStreamRecord;
};

export type CreateProgramStreamRequest = {
  streamName: string;
};

export type CreateProgramStreamResponse = ApiEnvelope<ProgramStreamSingleData>;

export type ProgramStreamListData = {
  records: ProgramStreamRecord[];
  pagination: PaginationInfo;
};

export type ListProgramStreamsResponse = ApiEnvelope<ProgramStreamListData>;

export type GetProgramStreamResponse = ApiEnvelope<ProgramStreamSingleData>;

export type UpdateProgramStreamRequest = {
  streamCode: string;
  streamName: string;
};

export type UpdateProgramStreamResponse = ApiEnvelope<ProgramStreamSingleData>;

export type DeleteProgramStreamResponse = ApiEnvelope<ProgramStreamSingleData>;

export const programStreamApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createProgramStream: builder.mutation<CreateProgramStreamResponse, CreateProgramStreamRequest>({
      query: (body) => ({
        url: "/api/v1/admin/master/stream/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["ProgramStream"],
    }),
    listProgramStreams: builder.query<ListProgramStreamsResponse, ListParams>({
      query: ({ pageNumber, pageSize, sort }) => ({
        url: "/api/v1/admin/master/stream/list",
        method: "get",
        params: { pageNumber, pageSize, sort },
      }),
      providesTags: ["ProgramStream"],
    }),
    getProgramStream: builder.query<GetProgramStreamResponse, string>({
      query: (streamCode) => ({
        url: `/api/v1/admin/master/stream/${streamCode}`,
        method: "get",
      }),
    }),
    updateProgramStream: builder.mutation<UpdateProgramStreamResponse, UpdateProgramStreamRequest>({
      query: (body) => ({
        url: "/api/v1/admin/master/stream/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["ProgramStream"],
    }),
    deleteProgramStream: builder.mutation<DeleteProgramStreamResponse, string>({
      query: (streamCode) => ({
        url: `/api/v1/admin/master/stream/${streamCode}`,
        method: "delete",
      }),
      invalidatesTags: ["ProgramStream"],
    }),
  }),
  // See src/services/supportticket/supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useCreateProgramStreamMutation,
  useListProgramStreamsQuery,
  useLazyGetProgramStreamQuery,
  useUpdateProgramStreamMutation,
  useDeleteProgramStreamMutation,
} = programStreamApi;
