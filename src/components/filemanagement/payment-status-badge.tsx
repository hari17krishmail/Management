import type { PaymentStatus } from "./types";

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  Advance: "bg-blue-50 text-blue-700",
  "Final Amount": "bg-green-50 text-green-700",
  "Balance Pending": "bg-red-50 text-red-700",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PAYMENT_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
