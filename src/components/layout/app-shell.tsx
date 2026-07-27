"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useLogout } from "@/hooks/use-logout";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { confirmOpen, requestLogout, cancelLogout, confirmLogout } = useLogout();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={requestLogout} />

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} onLogout={requestLogout} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Log out"
        description="Are you sure you want to log out of your account?"
        confirmLabel="Yes"
        cancelLabel="No"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}
