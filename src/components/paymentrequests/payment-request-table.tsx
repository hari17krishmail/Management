"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";
import { PaymentRequestActionMenu } from "./payment-request-action-menu";
import { PaymentRequestStatusBadge } from "./payment-request-status-badge";
import type { PaymentRequestAction, PaymentRequestRecord } from "./types";

const PAGE_SIZE = 5;

function formatWholeCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type PaymentRequestTableProps = {
  records: PaymentRequestRecord[];
  onAction: (record: PaymentRequestRecord, action: PaymentRequestAction) => void;
};

export function PaymentRequestTable({ records, onAction }: PaymentRequestTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const pageRecords = records.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);
  const rangeStart = records.length === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(records.length, pageNumber * PAGE_SIZE);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Request ID/Name
              </th>
              {/* <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Request Date
              </th> */}
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Partner ID/Name
              </th>
                {/* <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Partner Name
              </th> */}
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mobile Number
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Wallet Balance
              </th>
              {/* <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Min. Req. Balance
              </th> */}
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Requested Amount
              </th>
              {/* <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Avail. Settlement
              </th> */}
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-sm text-gray-500">
                  No withdrawal requests to show.
                </td>
              </tr>
            ) : (
              pageRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.id}</div>
                    <div className="text-xs text-gray-400">{record.requestedAt}</div>
                  </td>
                  {/* <td className="px-4 py-3 text-gray-500">{record.requestedAt}</td> */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.partnerId}</div>
                    <div className="text-xs text-gray-400">{record.partnerName}</div>
                  </td>
                  {/* <td className="px-4 py-3 text-gray-500">{record.partnerId}</td> */}
                  {/* <td className="px-4 py-3 text-gray-900">{record.partnerName}</td> */}
                  <td className="px-4 py-3 text-gray-500">{record.mobileNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatWholeCurrency(record.walletBalance)}</td>
                  {/* <td className="px-4 py-3 text-gray-500">{formatWholeCurrency(record.minReqBalance)}</td> */}
                  <td className="px-4 py-3 font-semibold text-blue-600">
                    {formatWholeCurrency(record.requestedAmount)}
                  </td>
                  {/* <td className="px-4 py-3 text-gray-500">{formatWholeCurrency(record.availSettlement)}</td> */}
                  <td className="px-4 py-3">
                    <PaymentRequestStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentRequestActionMenu onAction={(action) => onAction(record, action)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {records.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {rangeEnd} of {records.length} requests
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
