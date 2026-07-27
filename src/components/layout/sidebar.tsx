"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Users as BrandIcon, X } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { useUserEmail } from "@/hooks/use-user-email";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export function Sidebar({ open, onClose, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const userEmail = useUserEmail();

  const [expandedLabel, setExpandedLabel] = useState<string | null>(() => {
    const activeParent = NAV_ITEMS.find((item) => item.children?.some((child) => pathname.startsWith(child.href)));
    return activeParent?.label ?? null;
  });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <BrandIcon className="h-4.5 w-4.5" />
            </span>
            <span className="text-base font-semibold text-gray-900">Educon Admin</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2.5 pb-2 text-xs font-semibold tracking-wide text-gray-400">
            MAIN MENU
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              if (item.children) {
                const isChildActive = item.children.some((child) => pathname.startsWith(child.href));
                const isExpanded = expandedLabel === item.label;

                return (
                  <li key={item.label}>
                    <Button
                      variant="unstyled"
                      onClick={() => setExpandedLabel(isExpanded ? null : item.label)}
                      aria-expanded={isExpanded}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                        isChildActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </Button>

                    {isExpanded && (
                      <ul className="mt-1 space-y-1 pl-9">
                        {item.children.map((child) => {
                          const isActive = pathname.startsWith(child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onClose}
                                className={`block rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                                  isActive
                                    ? "bg-blue-50 font-medium text-blue-600"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              const isActive = !!item.href && pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href ?? "#"}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
              A
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">Admin User</p>
              <p className="truncate text-xs text-gray-500">{userEmail ?? "—"}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
