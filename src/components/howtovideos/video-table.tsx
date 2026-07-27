"use client";

import { useMemo, useState } from "react";
import { Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { getApiErrorMessage } from "@/lib/api-error";
import { getVideoThumbnailUrl } from "@/lib/video-thumbnail";
import { useListVideoCategoriesQuery, useListVideosQuery, type VideoRecord } from "@/services/video/videoApi";

const PAGE_SIZE = 10;
const CATEGORY_OPTIONS_PAGE_SIZE = 100;
const SORT_DESCENDING = -1;

function VideoThumbnailPlaceholder() {
  return (
    <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-gray-600">
        <Play className="h-3.5 w-3.5 fill-current" />
      </span>
    </span>
  );
}

function VideoThumbnail({ url, title }: { url: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const thumbnailUrl = getVideoThumbnailUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open "${title}" in a new tab`}
      title={`Open "${title}" in a new tab`}
      className="block shrink-0 rounded-lg transition-opacity hover:opacity-80"
    >
      {!thumbnailUrl || failed ? (
        <VideoThumbnailPlaceholder />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external host (img.youtube.com), not a local asset
        <img
          src={thumbnailUrl}
          alt={`${title} thumbnail`}
          className="h-14 w-20 rounded-lg bg-gray-100 object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </a>
  );
}

type VideoTableProps = {
  categoryCodeFilter: string;
  onEdit: (record: VideoRecord) => void;
  onDelete: (record: VideoRecord) => void;
};

export function VideoTable({ categoryCodeFilter, onEdit, onDelete }: VideoTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading, isFetching, isError, error } = useListVideosQuery({
    pageNumber,
    pageSize: PAGE_SIZE,
    sort: SORT_DESCENDING,
    categoryCode: categoryCodeFilter,
  });

  const { data: categoryData } = useListVideoCategoriesQuery({
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
                Thumbnail
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Video Title &amp; Description
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Category
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading videos...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-red-600">
                  {getApiErrorMessage(error, "Could not load videos.")}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No videos match your filter.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record._id ?? record.code} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3 align-top">
                    <VideoThumbnail url={record.url} title={record.title} />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-gray-900">{record.title}</p>
                    <p className="mt-0.5 max-w-md text-sm text-gray-500">{record.description}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {categoryNameByCode.get(record.categoryCode) ?? record.categoryCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="unstyled"
                        onClick={() => onEdit(record)}
                        aria-label={`Edit ${record.title}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="unstyled"
                        onClick={() => onDelete(record)}
                        aria-label={`Delete ${record.title}`}
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
            {pagination.total} video{pagination.total === 1 ? "" : "s"} total
            {isFetching && !isLoading ? " — refreshing…" : ""}
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
