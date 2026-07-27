import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/format";
import { WalletReceivedBadge } from "../network-commission/commission-badges";
import type { ReferralEarningRecord } from "./referral-earning-data";

const columnHelper = createColumnHelper<ReferralEarningRecord>();

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

export const referralEarningColumns = [
  columnHelper.accessor("partnerId", {
    header: "Partner ID",
    cell: (info) => <span className="font-medium text-blue-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor("dateOfOnboarding", {
    header: "Date of Onboarding",
    cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
  }),
  columnHelper.accessor("fileApprovedCount", {
    header: "File Approved Count",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor("commission", {
    header: "Commission",
    cell: (info) => <span className="font-medium text-gray-900">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor("walletReceived", {
    header: "Wallet Received",
    cell: (info) => <WalletReceivedBadge received={info.getValue()} />,
  }),
];
