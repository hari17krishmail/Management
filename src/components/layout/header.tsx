"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { getActiveNavLabel } from "./nav-items";
import { Button } from "@/components/ui/button";
import { useUserEmail } from "@/hooks/use-user-email";
import { useClickOutside } from "@/hooks/use-click-outside";

type HeaderProps = {
  onMenuClick: () => void;
  onLogout: () => void;
};

export function Header({ onMenuClick, onLogout }: HeaderProps) {
  const pathname = usePathname();
  const activeLabel = getActiveNavLabel(pathname);
  const userEmail = useUserEmail();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notificationsRef, () => setNotificationsOpen(false), notificationsOpen);
  useClickOutside(profileRef, () => setProfileOpen(false), profileOpen);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden" aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="flex-1 text-lg font-semibold text-gray-900">{activeLabel ?? "Dashboard"}</h1>

      <div className="relative" ref={notificationsRef}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setNotificationsOpen((prev) => !prev);
            setProfileOpen(false);
          }}
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {notificationsOpen && (
          <div className="absolute right-0 z-30 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <p className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">Notifications</p>
            <p className="px-4 py-8 text-center text-sm text-gray-500">No new notifications</p>
          </div>
        )}
      </div>

      <div className="relative ml-1" ref={profileRef}>
        <Button
          variant="unstyled"
          onClick={() => {
            setProfileOpen((prev) => !prev);
            setNotificationsOpen(false);
          }}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-gray-50"
          aria-label="Account menu"
          aria-expanded={profileOpen}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
            A
          </span>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">Admin User</span>
          <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
        </Button>

        {profileOpen && (
          <div className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-3">
              <p className="truncate text-sm font-medium text-gray-900">Admin User</p>
              <p className="truncate text-xs text-gray-500">{userEmail ?? "—"}</p>
            </div>
            <div className="border-t border-gray-100" />
            <Button
              variant="unstyled"
              onClick={() => {
                setProfileOpen(false);
                onLogout();
              }}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
