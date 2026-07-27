import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig, Method } from "axios";
import { axiosInstance } from "./axios";

export type AxiosBaseQueryArgs = {
  url: string;
  method?: Method;
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
};

export type AxiosBaseQueryError = {
  status?: number;
  data: unknown;
};

// Lets every RTK Query API slice run over the shared `axiosInstance` (and its
// interceptors) instead of RTK Query's built-in `fetchBaseQuery` — one place
// to add new endpoints without re-deciding how requests are transported.
export function axiosBaseQuery(): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> {
  return async ({ url, method = "get", data, params, headers }) => {
    try {
      // axiosInstance defaults Content-Type to application/json. Left as-is,
      // axios's transformRequest sees that JSON content-type and flattens a
      // FormData body straight back into a JSON string instead of sending it
      // as multipart — so a FormData payload must clear it here and let the
      // browser set its own `multipart/form-data; boundary=...` header.
      const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: isFormData ? { ...headers, "Content-Type": null } : headers,
      });
      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data ?? axiosError.message,
        },
      };
    }
  };
}
