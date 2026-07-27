import { Eye } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import type { FileRecord } from "./types";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "./payment-status-badge";
import { FileStatusBadge } from "./file-status-badge";

const columnHelper = createColumnHelper<FileRecord>();

type CreateFileColumnsArgs = {
  onView: (record: FileRecord) => void;
};

export function createFileColumns({ onView }: CreateFileColumnsArgs) {
  return [
    columnHelper.accessor("id", {
      header: "File ID",
      cell: (info) => <span className="font-medium text-blue-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("partnerId", {
      header: "Partner ID",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("studentName", {
      header: "Student Name",
      cell: (info) => <span className="text-gray-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor("studentMobile", {
      header: "Student Mobile",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("lookingFor", {
      header: "Looking For",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("submittedDate", {
      header: "Submitted Date",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("paymentStatus", {
      header: "Payment Status",
      cell: (info) => <PaymentStatusBadge status={info.getValue()} />,
    }),
    // columnHelper.accessor("status", {
    //   header: "Status",
    //   cell: (info) => <FileStatusBadge status={info.getValue()} />,
    // }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: (info) => (
        <Button
          variant="unstyled"
          onClick={() => onView(info.row.original)}
          aria-label={`View ${info.row.original.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    }),
  ];
}
