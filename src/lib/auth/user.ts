const USER_EMAIL_STORAGE_KEY = "educon_user_email";

// The real login response only returns a token, no user profile — the
// header/sidebar's account display stores the submitted email locally on
// login so it can show who's actually signed in instead of a hardcoded value.
export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_EMAIL_STORAGE_KEY);
}

export function setUserEmail(email: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);
}

export function clearUserEmail(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
}
