import type { AxiosBaseQueryError } from "./axiosBaseQuery";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

function isAxiosBaseQueryError(error: unknown): error is AxiosBaseQueryError {
  return typeof error === "object" && error !== null && "data" in error;
}

function readStringField(data: unknown, field: string): string | undefined {
  if (!data || typeof data !== "object" || !(field in data)) return undefined;
  const value = (data as Record<string, unknown>)[field];
  return typeof value === "string" ? value : undefined;
}

// Single place to unwrap an error thrown by an RTK Query mutation/query built
// on `axiosBaseQuery` into a user-facing message — every new endpoint's error
// toast can reuse this instead of re-deriving the backend's error shape.
export function getApiErrorMessage(error: unknown, fallback: string = DEFAULT_MESSAGE): string {
  if (isAxiosBaseQueryError(error)) {
    const { status, data } = error;
    // 5xx bodies are unhandled server exceptions (stack traces / raw JS error
    // messages like "Cannot read properties of null..."), not messages meant
    // for end users — unlike 4xx bodies, which this backend uses for genuine
    // validation/business errors worth surfacing verbatim.
    if (status && status >= 500) return fallback;
    if (typeof data === "string" && data.trim()) return data;
    return readStringField(data, "responseMessage") ?? readStringField(data, "message") ?? fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
