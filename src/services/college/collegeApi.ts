import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type CollegeDetailRecord = {
  code: string;
  streamCode: string;
  districtCode: string;
  normalizedCollegeName: string;
  originalCollegeName: string;
  attachments: string[];
};

export type CollegeDetailSingleData = {
  record: CollegeDetailRecord;
};

export type CreateCollegeDetailsResponse = ApiEnvelope<CollegeDetailSingleData>;

export type CreateCollegeDetailsParams = {
  streamCode: string;
  districtCode: string;
  collegeName: string;
  file?: File;
};

export type UploadCollegeDetailsSummary = {
  totalRecords: number;
  uploadedCount: number;
  skippedCount: number;
};

export type UploadCollegeDetailsResponse = ApiEnvelope<UploadCollegeDetailsSummary>;

export type UploadCollegeDetailsParams = {
  streamCode: string;
  districtCode: string;
  file: File;
};

export type CollegeDetailListRecord = {
  code: string;
  streamCode: string;
  streamName: string;
  districtCode: string;
  districtName: string;
  originalCollegeName: string;
  attachments: string[];
};

export type ListCollegeDetailsParams = ListParams & {
  streamCode?: string;
  districtCode?: string;
};

export type CollegeDetailListData = {
  records: CollegeDetailListRecord[];
  pagination: PaginationInfo;
};

export type ListCollegeDetailsResponse = ApiEnvelope<CollegeDetailListData>;

export type UploadCourseDetailsResponse = ApiEnvelope<CollegeDetailSingleData>;

export type UploadCourseDetailsParams = {
  collegeDetailsCode: string;
  file: File;
};

export type UpdateCollegeDetailsResponse = ApiEnvelope<CollegeDetailSingleData>;

export type UpdateCollegeDetailsParams = {
  collegeDetailsCode: string;
  streamCode: string;
  districtCode: string;
  collegeName: string;
  file?: File;
};

export type DeleteCollegeDetailsResponse = ApiEnvelope<unknown>;

export const collegeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createCollegeDetails: builder.mutation<CreateCollegeDetailsResponse, CreateCollegeDetailsParams>({
      query: ({ streamCode, districtCode, collegeName, file }) => {
        const formData = new FormData();
        formData.append("streamCode", streamCode);
        formData.append("districtCode", districtCode);
        formData.append("collegeName", collegeName);
        if (file) formData.append("file", file);
        return {
          url: "/api/v1/admin/master/college/details/create",
          method: "post",
          data: formData,
        };
      },
      invalidatesTags: ["College"],
    }),
    uploadCollegeDetails: builder.mutation<UploadCollegeDetailsResponse, UploadCollegeDetailsParams>({
      query: ({ streamCode, districtCode, file }) => {
        const formData = new FormData();
        formData.append("streamCode", streamCode);
        formData.append("districtCode", districtCode);
        formData.append("file", file);
        return {
          url: "/api/v1/admin/master/college/details/upload",
          method: "post",
          data: formData,
        };
      },
      invalidatesTags: ["College"],
    }),
    listCollegeDetails: builder.query<ListCollegeDetailsResponse, ListCollegeDetailsParams>({
      // The backend rejects requests that omit streamCode/districtCode
      // outright — it has no notion of "unfiltered" other than the literal
      // string "all" for each field (see supportTicketApi.ts's list endpoint
      // for the same convention).
      query: ({ pageNumber, pageSize, sort, streamCode = "all", districtCode = "all" }) => ({
        url: "/api/v1/admin/master/college/details/list",
        method: "get",
        params: { pageNumber, pageSize, sort, streamCode, districtCode },
      }),
      providesTags: ["College"],
    }),
    uploadCourseDetails: builder.mutation<UploadCourseDetailsResponse, UploadCourseDetailsParams>({
      query: ({ collegeDetailsCode, file }) => {
        const formData = new FormData();
        formData.append("collegeDetailsCode", collegeDetailsCode);
        formData.append("file", file);
        return {
          url: "/api/v1/admin/master/college/course/details/upload",
          method: "post",
          data: formData,
        };
      },
      invalidatesTags: ["College"],
    }),
    updateCollegeDetails: builder.mutation<UpdateCollegeDetailsResponse, UpdateCollegeDetailsParams>({
      query: ({ collegeDetailsCode, streamCode, districtCode, collegeName, file }) => {
        const formData = new FormData();
        formData.append("collegeDetailsCode", collegeDetailsCode);
        formData.append("streamCode", streamCode);
        formData.append("districtCode", districtCode);
        formData.append("collegeName", collegeName);
        if (file) formData.append("file", file);
        return {
          url: "/api/v1/admin/master/college/details/update",
          method: "put",
          data: formData,
        };
      },
      invalidatesTags: ["College"],
    }),
    deleteCollegeDetails: builder.mutation<DeleteCollegeDetailsResponse, string>({
      query: (collegeDetailsCode) => ({
        url: `/api/v1/admin/master/college/details/${collegeDetailsCode}`,
        method: "delete",
      }),
      invalidatesTags: ["College"],
    }),
  }),
  // See src/services/supportticket/supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useCreateCollegeDetailsMutation,
  useUploadCollegeDetailsMutation,
  useListCollegeDetailsQuery,
  useUploadCourseDetailsMutation,
  useUpdateCollegeDetailsMutation,
  useDeleteCollegeDetailsMutation,
} = collegeApi;
