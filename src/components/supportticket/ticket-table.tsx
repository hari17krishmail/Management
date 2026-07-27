"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { useListSupportTicketsQuery } from "@/services/supportticket/supportTicketApi";
import { TicketStatusBadge } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import { TicketViewModal } from "./ticket-view-modal";
import type { TicketPriority, TicketStatus } from "./types";

const PAGE_SIZE = 10;
const SORT_DESCENDING = -1;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

type TicketTableProps = {
  statusFilter: string;
  priorityFilter: string;
  categoryCodeFilter: string;
};

export function TicketTable({ statusFilter, priorityFilter, categoryCodeFilter }: TicketTableProps) {
  const [pageNumber, setPageNumber] = useState(1);
  const [viewingTicketCode, setViewingTicketCode] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, error } = useListSupportTicketsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sort: SORT_DESCENDING,
    status: statusFilter === "All Statuses" ? undefined : statusFilter.toLowerCase(),
    priority: priorityFilter === "All Priorities" ? undefined : priorityFilter.toLowerCase(),
    reasonCode: categoryCodeFilter === "All Categories" ? undefined : categoryCodeFilter,
  });

  const records = data?.responseObj.responseDataParams.data.records ?? [];
  const pagination = data?.responseObj.responseDataParams.data.pagination;
  const totalPages = pagination ? Math.max(1, pagination.pages) : 1;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ticket Code
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                User Info
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading tickets...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-red-600">
                  {getApiErrorMessage(error, "Could not load tickets.")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No support tickets match your filter.
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const initial = record.fullName ? record.fullName.charAt(0).toUpperCase() : "?";
                return (
                  <tr key={record._id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{record.code}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                          {initial}
                        </span>
                        <div>
                          <div className="text-gray-900">{record.fullName || "—"}</div>
                          <div className="text-xs text-gray-500">Code: {record.userCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{record.reasonName}</td>
                    <td className="px-4 py-3">
                      <TicketPriorityBadge priority={capitalize(record.priority) as TicketPriority} />
                    </td>
                    <td className="px-4 py-3">
                      <TicketStatusBadge status={capitalize(record.status) as TicketStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="unstyled"
                        onClick={() => setViewingTicketCode(record.code)}
                        aria-label={`View ${record.code}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {viewingTicketCode && (
        <TicketViewModal ticketCode={viewingTicketCode} onClose={() => setViewingTicketCode(null)} />
      )}

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <p className="text-sm text-gray-500">
            {pagination.total} ticket{pagination.total === 1 ? "" : "s"} total
            {isFetching && !isLoading ? " — refreshing…" : ""}
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
