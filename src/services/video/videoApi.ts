import { api, type ApiEnvelope, type ListParams, type PaginationInfo } from "../api";

export type CreateVideoCategoryRequest = {
  categoryName: string;
};

export type VideoCategoryRecord = {
  _id: string;
  code: string;
  categoryName: string;
};

export type VideoCategorySingleData = {
  record: VideoCategoryRecord;
};

export type CreateVideoCategoryResponse = ApiEnvelope<VideoCategorySingleData>;

export type VideoCategoryListData = {
  records: VideoCategoryRecord[];
  pagination: PaginationInfo;
};

export type ListVideoCategoriesResponse = ApiEnvelope<VideoCategoryListData>;

export type GetVideoCategoryResponse = ApiEnvelope<VideoCategorySingleData>;

export type UpdateVideoCategoryRequest = {
  categoryCode: string;
  categoryName: string;
};

export type UpdateVideoCategoryResponse = ApiEnvelope<VideoCategorySingleData>;

export type DeleteVideoCategoryResponse = ApiEnvelope<VideoCategorySingleData>;

// The backend calls this resource "tutorial" internally even though the app
// presents it as "Video" everywhere in the UI.
export type VideoRecord = {
  _id?: string;
  code: string;
  categoryCode: string;
  title: string;
  description: string;
  url: string;
};

export type VideoSingleData = {
  record: VideoRecord;
};

export type CreateVideoRequest = {
  categoryCode: string;
  title: string;
  description: string;
  url: string;
};

export type CreateVideoResponse = ApiEnvelope<VideoSingleData>;

export type ListVideosParams = ListParams & {
  categoryCode?: string;
};

export type VideoListData = {
  records: VideoRecord[];
  pagination: PaginationInfo;
};

export type ListVideosResponse = ApiEnvelope<VideoListData>;

export type GetVideoResponse = ApiEnvelope<VideoSingleData>;

// Mirrors the FAQ update endpoint's contract: category is set at creation
// and isn't part of the update payload (unconfirmed for this endpoint —
// worth verifying against a real call).
export type UpdateVideoRequest = {
  tutorialCode: string;
  title: string;
  description: string;
  url: string;
};

export type UpdateVideoResponse = ApiEnvelope<VideoSingleData>;

export type DeleteVideoResponse = ApiEnvelope<VideoSingleData>;

export const videoCategoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createVideoCategory: builder.mutation<CreateVideoCategoryResponse, CreateVideoCategoryRequest>({
      query: (body) => ({
        url: "/api/v1/common/category/video/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["VideoCategory"],
    }),
    listVideoCategories: builder.query<ListVideoCategoriesResponse, ListParams>({
      query: ({ pageNumber, pageSize, sort }) => ({
        url: "/api/v1/common/category/video/list",
        method: "get",
        params: { pageNumber, pageSize, sort },
      }),
      providesTags: ["VideoCategory"],
    }),
    getVideoCategory: builder.query<GetVideoCategoryResponse, string>({
      query: (categoryCode) => ({
        url: `/api/v1/common/category/video/${categoryCode}`,
        method: "get",
      }),
    }),
    updateVideoCategory: builder.mutation<UpdateVideoCategoryResponse, UpdateVideoCategoryRequest>({
      query: (body) => ({
        url: "/api/v1/common/category/video/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["VideoCategory"],
    }),
    deleteVideoCategory: builder.mutation<DeleteVideoCategoryResponse, string>({
      query: (categoryCode) => ({
        url: `/api/v1/common/category/video/${categoryCode}`,
        method: "delete",
      }),
      invalidatesTags: ["VideoCategory"],
    }),
    createVideo: builder.mutation<CreateVideoResponse, CreateVideoRequest>({
      query: (body) => ({
        url: "/api/v1/common/tutorial/create",
        method: "post",
        data: body,
      }),
      invalidatesTags: ["Video"],
    }),
    listVideos: builder.query<ListVideosResponse, ListVideosParams>({
      query: ({ pageNumber, pageSize, sort, categoryCode }) => ({
        url: "/api/v1/common/tutorial/list",
        method: "get",
        params: { pageNumber, pageSize, sort, categoryCode },
      }),
      providesTags: ["Video"],
    }),
    getVideo: builder.query<GetVideoResponse, string>({
      query: (tutorialCode) => ({
        url: `/api/v1/common/tutorial/${tutorialCode}`,
        method: "get",
      }),
    }),
    updateVideo: builder.mutation<UpdateVideoResponse, UpdateVideoRequest>({
      query: (body) => ({
        url: "/api/v1/common/tutorial/update",
        method: "put",
        data: body,
      }),
      invalidatesTags: ["Video"],
    }),
    deleteVideo: builder.mutation<DeleteVideoResponse, string>({
      query: (tutorialCode) => ({
        url: `/api/v1/common/tutorial/${tutorialCode}`,
        method: "delete",
      }),
      invalidatesTags: ["Video"],
    }),
  }),
  // See supportTicketApi.ts for why this is dev-only.
  overrideExisting: process.env.NODE_ENV === "development",
});

export const {
  useCreateVideoCategoryMutation,
  useListVideoCategoriesQuery,
  useLazyGetVideoCategoryQuery,
  useUpdateVideoCategoryMutation,
  useDeleteVideoCategoryMutation,
  useCreateVideoMutation,
  useListVideosQuery,
  useLazyGetVideoQuery,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} = videoCategoryApi;
