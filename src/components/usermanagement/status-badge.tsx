import type { PartnerStatus } from "./types";

export function StatusBadge({ status }: { status: PartnerStatus }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}
