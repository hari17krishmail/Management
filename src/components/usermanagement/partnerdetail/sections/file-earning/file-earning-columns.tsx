import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/format";
import { CommissionStatusBadge, WalletReceivedBadge } from "../network-commission/commission-badges";
import type { FileEarningRecord } from "./file-earning-data";

const columnHelper = createColumnHelper<FileEarningRecord>();

export const fileEarningColumns = [
  columnHelper.display({
    id: "index",
    header: "#",
    cell: (info) => <span className="text-gray-500">{info.row.index + 1}</span>,
  }),
  columnHelper.accessor("fileNumber", {
    header: "File Number",
    cell: (info) => <span className="font-medium text-blue-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Phone Number",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("emailId", {
    header: "Email ID",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("commissionAmount", {
    header: "Commission Amount",
    cell: (info) => <span className="font-medium text-gray-900">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor("fileStatus", {
    header: "File Status",
    cell: (info) => <CommissionStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("walletReceived", {
    header: "Wallet Received",
    cell: (info) => <WalletReceivedBadge received={info.getValue()} />,
  }),
  columnHelper.accessor("collegeName", {
    header: "College Name",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
];
