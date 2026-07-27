"use client";

import { DataTable } from "@/components/ui/data-table";
import type { FileEarningRecord } from "./file-earning-data";
import { fileEarningColumns } from "./file-earning-columns";

const PAGE_SIZE = 10;

type FileEarningTableProps = {
  data: FileEarningRecord[];
};

export function FileEarningTable({ data }: FileEarningTableProps) {
  return (
    <DataTable
      data={data}
      columns={fileEarningColumns}
      pageSize={PAGE_SIZE}
      emptyMessage="No file earnings match your filters."
      itemLabel="records"
    />
  );
}
