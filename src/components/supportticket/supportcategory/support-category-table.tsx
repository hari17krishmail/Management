"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { useListReasonsQuery, type ReasonRecord } from "@/services/reason/reasonApi";
import { SupportCategoryPriorityBadge } from "./support-category-priority-badge";

const PAGE_SIZE = 10;
const SORT_DESCENDING = -1;

type SupportCategoryTableProps = {
  onEdit: (record: ReasonRecord) => void;
  onDelete: (record: ReasonRecord) => void;
};

export function SupportCategoryTable({ onEdit, onDelete }: SupportCategoryTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useListReasonsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sort: SORT_DESCENDING,
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
                Category Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Priority
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-red-600">
                  {getApiErrorMessage(error, "Could not load categories.")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">
                  No support categories yet.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium capitalize text-gray-900">{record.reasonName}</td>
                  <td className="px-4 py-3">
                    <SupportCategoryPriorityBadge priority={record.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="unstyled"
                        onClick={() => onEdit(record)}
                        aria-label={`Edit ${record.reasonName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="unstyled"
                        onClick={() => onDelete(record)}
                        aria-label={`Delete ${record.reasonName}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <p className="text-sm text-gray-500">
            {pagination.total} categor{pagination.total === 1 ? "y" : "ies"} total
            {isFetching && !isLoading ? " — refreshing…" : ""}
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
