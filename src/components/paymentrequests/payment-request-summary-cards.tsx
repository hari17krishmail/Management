import type { LucideIcon } from "lucide-react";
import { Clock, CheckCircle2, Wallet, XCircle } from "lucide-react";

type PaymentRequestSummaryCardsProps = {
  pendingCount: number;
  approvedTodayAmount: number;
  totalPayoutsMonthAmount: number;
  rejectedCount: number;
};

function formatWholeCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type SummaryCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  value: string;
  label: string;
};

function SummaryCard({ icon: Icon, iconClassName, value, label }: SummaryCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function PaymentRequestSummaryCards({
  pendingCount,
  approvedTodayAmount,
  totalPayoutsMonthAmount,
  rejectedCount,
}: PaymentRequestSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        icon={Clock}
        iconClassName="bg-amber-50 text-amber-600"
        value={String(pendingCount)}
        label="Pending Requests"
      />
      <SummaryCard
        icon={CheckCircle2}
        iconClassName="bg-green-50 text-green-600"
        value={formatWholeCurrency(approvedTodayAmount)}
        label="Approved Today"
      />
      <SummaryCard
        icon={Wallet}
        iconClassName="bg-blue-50 text-blue-600"
        value={formatWholeCurrency(totalPayoutsMonthAmount)}
        label="Total Payouts (Month)"
      />
      <SummaryCard
        icon={XCircle}
        iconClassName="bg-red-50 text-red-600"
        value={String(rejectedCount)}
        label="Rejected Requests"
      />
    </div>
  );
}
