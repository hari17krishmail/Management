import { CheckCircle2, Circle, Clock, SquareCheck, XCircle } from "lucide-react";
import type { CommissionStatus } from "./network-commission-data";

const STATUS_STYLES: Record<CommissionStatus, { className: string; icon: typeof CheckCircle2 }> = {
  Approved: { className: "bg-green-50 text-green-700", icon: CheckCircle2 },
  Pending: { className: "bg-amber-50 text-amber-700", icon: Clock },
  Rejected: { className: "bg-red-50 text-red-700", icon: XCircle },
};

export function CommissionStatusBadge({ status }: { status: CommissionStatus }) {
  const { className, icon: Icon } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function WalletReceivedBadge({ received }: { received: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        received ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {/* {received ? <SquareCheck className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />} */}
      {received ? "Yes" : "No"}
    </span>
  );
}
