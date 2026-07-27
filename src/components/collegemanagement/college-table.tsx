"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Pencil, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { useListCollegeDetailsQuery, type CollegeDetailListRecord } from "@/services/college/collegeApi";
import { useLazyGeneratePresignedUrlQuery } from "@/services/storage/storageApi";

const PAGE_SIZE = 10;
const SORT_DESCENDING = -1;

function AttachmentButton({ fileId }: { fileId: string }) {
  const [fetchPresignedUrl, { isFetching }] = useLazyGeneratePresignedUrlQuery();

  const handleClick = async () => {
    try {
      const response = await fetchPresignedUrl(fileId).unwrap();
      const url = response.responseObj.responseDataParams.data.url;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not open this attachment."));
    }
  };

  return (
    <Button
      variant="unstyled"
      onClick={handleClick}
      disabled={isFetching}
      className="inline-flex max-w-[140px] items-center gap-1.5 truncate rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-60"
    >
      <FileText className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{isFetching ? "Opening..." : fileId}</span>
    </Button>
  );
}

type CollegeTableProps = {
  search: string;
  streamCode: string;
  districtCode: string;
  onUploadPdf: (record: CollegeDetailListRecord) => void;
  onEdit: (record: CollegeDetailListRecord) => void;
  onDelete: (record: CollegeDetailListRecord) => void;
};

export function CollegeTable({ search, streamCode, districtCode, onUploadPdf, onEdit, onDelete }: CollegeTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useListCollegeDetailsQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sort: SORT_DESCENDING,
    streamCode,
    districtCode,
  });

  const allRecords = data?.responseObj.responseDataParams.data.records ?? [];
  const query = search.trim().toLowerCase();
  const records = query
    ? allRecords.filter((record) => record.originalCollegeName.toLowerCase().includes(query))
    : allRecords;
  const pagination = data?.responseObj.responseDataParams.data.pagination;
  const totalPages = pagination ? Math.max(1, pagination.pages) : 1;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                S.No
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Program / Stream
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                College Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                District
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Course Details PDF
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
                  Loading colleges...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-red-600">
                  {getApiErrorMessage(error, "Could not load colleges.")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                  No colleges match your filter.
                </td>
              </tr>
            ) : (
              records.map((record, index) => {
                const attachments = record.attachments ?? [];
                return (
                <tr key={record.code} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 text-gray-500">{(pageNumber - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="px-4 py-3 text-gray-700">{record.streamName}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{record.originalCollegeName}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{record.districtName}</td>
                  <td className="px-4 py-3">
                    {attachments.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {attachments.map((fileId) => (
                          <AttachmentButton key={fileId} fileId={fileId} />
                        ))}
                      </div>
                    ) : (
                      <Button
                        variant="unstyled"
                        onClick={() => onUploadPdf(record)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload PDF
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="unstyled"
                        onClick={() => onEdit(record)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="unstyled"
                        onClick={() => onDelete(record)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <p className="text-sm text-gray-500">
            {pagination.total} college{pagination.total === 1 ? "" : "s"} total
            {isFetching && !isLoading ? " — refreshing…" : ""}
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
