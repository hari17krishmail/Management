import { api, type ApiEnvelope } from "../api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = ApiEnvelope<{ token: string }>;

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/api/v1/admin/auth/verify-account",
        method: "post",
        data: body,
      }),
    }),
  }),
  // See src/services/supportticket/supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const { useLoginMutation } = authApi;
