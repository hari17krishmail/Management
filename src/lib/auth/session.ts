export const SESSION_COOKIE = "usersync_session";

export function createSessionCookie() {
  const maxAgeSeconds = 60 * 60 * 8; // 8 hours
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
