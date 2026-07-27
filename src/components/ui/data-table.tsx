"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "./pagination";

type DataTableProps<TData> = {
  data: TData[];
  // `any` is required here: ColumnDef is contravariant in its value type, so a
  // column array mixing per-field value types (string, number, custom unions, …)
  // can't be typed with a single concrete or `unknown` value type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  pageSize: number;
  emptyMessage: string;
  itemLabel: string;
  cellClassName?: string;
};

// Uncontrolled by design: no `state` prop and no effects reaching into `table`.
// Callers remount this component (via a `key` on filter inputs) whenever filters
// change, so TanStack's own internal pagination state resets to page 1 for free.
export function DataTable<TData>({
  data,
  columns,
  pageSize,
  emptyMessage,
  itemLabel,
  cellClassName = "whitespace-nowrap px-4 py-3",
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    initialState: { pagination: { pageSize, pageIndex: 0 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const rangeStart = data.length === 0 ? 0 : pageIndex * currentPageSize + 1;
  const rangeEnd = Math.min(data.length, pageIndex * currentPageSize + currentPageSize);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/60">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={cellClassName}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
        <p className="text-sm text-gray-500">
          Showing {rangeStart} to {rangeEnd} of {data.length} {itemLabel}
        </p>
        <Pagination
          currentPage={pageIndex + 1}
          totalPages={Math.max(1, table.getPageCount())}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </>
  );
}
