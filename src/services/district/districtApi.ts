import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type DistrictRecord = {
  _id: string;
  code: string;
  districtName: string;
};

export type DistrictListData = {
  records: DistrictRecord[];
  pagination: PaginationInfo;
};

export type ListDistrictsResponse = ApiEnvelope<DistrictListData>;

export const districtApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listDistricts: builder.query<ListDistrictsResponse, ListParams>({
      query: ({ pageNumber, pageSize, sort }) => ({
        url: "/api/v1/admin/master/district/list",
        method: "get",
        params: { pageNumber, pageSize, sort },
      }),
    }),
  }),
  // See src/services/supportticket/supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const { useListDistrictsQuery } = districtApi;
