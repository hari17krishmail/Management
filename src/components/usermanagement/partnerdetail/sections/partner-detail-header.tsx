import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PartnerDetail } from "../../types";
import { LockToggleButton } from "./lock-toggle-button";

export function PartnerDetailHeader({ partner }: { partner: PartnerDetail }) {
  return (
    <div className="space-y-4">
      <Link
        href="/user-management"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to User Management
      </Link>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{partner.name}</h1>
          <p className="text-sm text-gray-500">{partner.id}</p>
        </div>
        <LockToggleButton initialStatus={partner.status} />
      </div>
    </div>
  );
}
