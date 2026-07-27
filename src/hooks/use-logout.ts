"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearSessionCookie, clearAccessToken, clearUserEmail } from "@/lib/auth";

// Single source of truth for the logout confirm-then-clear-session flow —
// used by both the sidebar's account row and the header's profile dropdown
// so neither has to duplicate the confirmation dialog or the clear/redirect logic.
export function useLogout() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const requestLogout = () => setConfirmOpen(true);
  const cancelLogout = () => setConfirmOpen(false);

  const confirmLogout = () => {
    setConfirmOpen(false);
    clearSessionCookie();
    clearAccessToken();
    clearUserEmail();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return { confirmOpen, requestLogout, cancelLogout, confirmLogout };
}
