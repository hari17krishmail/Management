"use client";

import { useMemo, useState } from "react";
import { HelpCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { useListFaqCategoriesQuery, useListFaqsQuery, type FaqRecord } from "@/services/faq/faqApi";

const PAGE_SIZE = 10;
const CATEGORY_OPTIONS_PAGE_SIZE = 100;
const SORT_DESCENDING = -1;

type FaqTableProps = {
  categoryCodeFilter: string;
  onEdit: (record: FaqRecord) => void;
  onDelete: (record: FaqRecord) => void;
};

export function FaqTable({ categoryCodeFilter, onEdit, onDelete }: FaqTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useListFaqsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sort: SORT_DESCENDING,
    categoryCode: categoryCodeFilter,
  });

  const { data: categoryData } = useListFaqCategoriesQuery({
    pageNumber: 1,
    pageSize: CATEGORY_OPTIONS_PAGE_SIZE,
    sort: SORT_DESCENDING,
  });

  const categoryNameByCode = useMemo(() => {
    const records = categoryData?.responseObj.responseDataParams.data.records ?? [];
    return new Map(records.map((category) => [category.code, category.categoryName]));
  }, [categoryData]);

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
                Question
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Answer</th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading FAQs...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-600">
                  {getApiErrorMessage(error, "Could not load FAQs.")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No FAQs match your filter.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record._id ?? record.code} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600">
                        <HelpCircle className="h-3.5 w-3.5 text-white" />
                      </span>
                      <span className="text-gray-900">{record.question}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {categoryNameByCode.get(record.categoryCode) ?? record.categoryCode}
                    </span>
                  </td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-500" title={record.answer}>
                    {record.answer}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="unstyled"
                        onClick={() => onEdit(record)}
                        aria-label={`Edit ${record.question}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="unstyled"
                        onClick={() => onDelete(record)}
                        aria-label={`Delete ${record.question}`}
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
            {pagination.total} FAQ{pagination.total === 1 ? "" : "s"} total
            {isFetching && !isLoading ? " — refreshing…" : ""}
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
