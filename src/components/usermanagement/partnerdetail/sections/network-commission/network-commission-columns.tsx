import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/format";
import type { NetworkCommissionRecord } from "./network-commission-data";
import { CommissionStatusBadge, WalletReceivedBadge } from "./commission-badges";

const columnHelper = createColumnHelper<NetworkCommissionRecord>();

export const networkCommissionColumns = [
  columnHelper.display({
    id: "index",
    header: "#",
    cell: (info) => <span className="text-gray-500">{info.row.index + 1}</span>,
  }),
  columnHelper.accessor("partnerId", {
    header: "Partner ID",
    cell: (info) => <span className="font-medium text-blue-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("fileNumber", {
    header: "File Number",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
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
  columnHelper.accessor("commissionAmt", {
    header: "Commission Amt",
    cell: (info) => <span className="text-gray-900">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <CommissionStatusBadge status={info.getValue()} />,
  }),
  // columnHelper.accessor("walletReceived", {
  //   header: "Wallet Received",
  //   cell: (info) => <WalletReceivedBadge received={info.getValue()} />,
  // }),
  columnHelper.accessor("fileReceivedDate", {
    header: "File Received Date",
    cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
  }),
];
