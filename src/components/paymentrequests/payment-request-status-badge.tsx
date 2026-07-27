import type { PaymentRequestStatus } from "./types";

const BADGE_STYLES: Partial<Record<PaymentRequestStatus, string>> = {
  Hold: "bg-amber-50 text-amber-700",
  Approved: "bg-green-50 text-green-700",
  Partial: "bg-blue-50 text-blue-700",
  Rejected: "bg-red-50 text-red-700",
};

// Pending renders as plain text (matching the reference UI) — every other
// outcome gets a colored pill so it stands out against the default state.
export function PaymentRequestStatusBadge({ status }: { status: PaymentRequestStatus }) {
  const badgeClassName = BADGE_STYLES[status];

  if (!badgeClassName) {
    return <span className="text-sm text-gray-700">{status}</span>;
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}>
      {status}
    </span>
  );
}
