import type { LucideIcon } from "lucide-react";
import { FileText, GraduationCap, HelpCircle, LifeBuoy, PlayCircle, Users, Wallet } from "lucide-react";

export type NavSubItem = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  icon: LucideIcon;
  // Leaf items navigate directly via `href`. Items with `children` instead
  // expand/collapse a submenu in the sidebar and have no page of their own.
  href?: string;
  children?: NavSubItem[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "User Management", href: "/user-management", icon: Users },
  { label: "File Management", href: "/file-management", icon: FileText },
  { label: "FAQ Management", href: "/faq-management", icon: HelpCircle },
  { label: "How-To Videos", href: "/how-to-videos", icon: PlayCircle },
  { label: "Support Tickets", href: "/support-tickets", icon: LifeBuoy },
  { label: "Master Management", href: "/college-management", icon: GraduationCap },
  { label: "Payment Requests", href: "/payment-requests", icon: Wallet },
];

// Shared by Header (page title) and anywhere else that needs to resolve the
// current route to a nav label — checks top-level items and, for expandable
// items, their children too.
export function getActiveNavLabel(pathname: string): string | undefined {
  for (const item of NAV_ITEMS) {
    if (item.children) {
      const activeChild = item.children.find((child) => pathname.startsWith(child.href));
      if (activeChild) return activeChild.label;
      continue;
    }
    if (item.href && pathname.startsWith(item.href)) return item.label;
  }
  return undefined;
}
