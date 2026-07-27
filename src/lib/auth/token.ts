const ACCESS_TOKEN_STORAGE_KEY = "educon_access_token";

// Single source of truth for the stored access token — read by axios's
// request interceptor, written on login, cleared on logout. Whatever writes
// here (mock today, real backend later) is the only thing that ever needs to
// change; every authenticated request picks up the new token automatically.
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
