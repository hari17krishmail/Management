"use client";

import { useSyncExternalStore } from "react";
import { getUserEmail } from "@/lib/auth";

const noopSubscribe = () => () => {};

// localStorage is unavailable during SSR, so reading it directly during
// render would mismatch the client's real value on first paint and trigger
// a hydration error. useSyncExternalStore's getServerSnapshot lets the
// server (and the client's pre-hydration render) consistently return null;
// the real value only appears once the client re-reads it post-hydration.
export function useUserEmail(): string | null {
  return useSyncExternalStore(noopSubscribe, getUserEmail, () => null);
}
