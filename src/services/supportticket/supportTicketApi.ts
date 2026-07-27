import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type SupportTicketRecord = {
  _id: string;
  code: string;
  reasonCode: string;
  reasonName: string;
  userCode: string;
  priority: string;
  status: string;
  fullName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketMessage = {
  sender: "partner" | "admin";
  message: string;
  attachments: string[];
  userCode?: string;
  createdAt: string;
};

export type SupportTicketDetail = {
  _id: string;
  code: string;
  reasonCode: string;
  reasonName: string;
  userCode: string;
  priority: string;
  status: string;
  fullName: string | null;
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
};

export type GetSupportTicketResponse = ApiEnvelope<{ record: SupportTicketDetail }>;

export type CreateSupportTicketMessageParams = {
  ticketCode: string;
  message: string;
  updateStatus: "open" | "resolved";
};

export type CreateSupportTicketMessageResponse = ApiEnvelope<{ record: SupportTicketDetail }>;

export type ListSupportTicketsParams = ListParams & {
  status?: string;
  priority?: string;
  reasonCode?: string;
};

export type SupportTicketListData = {
  records: SupportTicketRecord[];
  pagination: PaginationInfo;
  totalTicket: number;
  openTicket: number;
  resolvedTicket: number;
};

export type ListSupportTicketsResponse = ApiEnvelope<SupportTicketListData>;

export const supportTicketApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listSupportTickets: builder.query<ListSupportTicketsResponse, ListSupportTicketsParams>({
      // The backend rejects requests that omit status/priority/reasonCode
      // outright ("Status field is required", etc.) — it has no notion of
      // "unfiltered" other than the literal string "all" for each field.
      query: ({ pageNumber, pageSize, sort, status = "all", priority = "all", reasonCode = "all" }) => ({
        url: "/api/v1/admin/support/ticket/get/all",
        method: "get",
        params: { pageNumber, pageSize, sort, status, priority, reasonCode },
      }),
      providesTags: ["SupportTicket"],
    }),
    getSupportTicket: builder.query<GetSupportTicketResponse, string>({
      query: (ticketCode) => ({
        url: `/api/v1/admin/support/ticket/${ticketCode}`,
        method: "get",
      }),
      providesTags: ["SupportTicket"],
    }),
    createSupportTicketMessage: builder.mutation<CreateSupportTicketMessageResponse, CreateSupportTicketMessageParams>({
      query: ({ ticketCode, message, updateStatus }) => {
        const formData = new FormData();
        formData.append("ticketCode", ticketCode);
        formData.append("description", message);
        formData.append("updateStatus", updateStatus);
        return {
          url: "/api/v1/admin/support/ticket/create",
          method: "post",
          data: formData,
        };
      },
      invalidatesTags: ["SupportTicket"],
    }),
  }),
  // Next.js Fast Refresh re-evaluates this module on every edit, but the
  // `api` singleton (src/services/api.ts) survives the reload — so without
  // this, re-injecting the same endpoint name triggers RTK Query's
  // "already-existing endpointName" dev warning. Production builds only
  // evaluate this module once, so `overrideExisting` never actually matters
  // there.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useListSupportTicketsQuery,
  useGetSupportTicketQuery,
  useCreateSupportTicketMessageMutation,
} = supportTicketApi;
