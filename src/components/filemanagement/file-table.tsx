"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import type { FileRecord } from "./types";
import { createFileColumns } from "./file-columns";

const PAGE_SIZE = 10;

type FileTableProps = {
  data: FileRecord[];
  onView: (record: FileRecord) => void;
};

export function FileTable({ data, onView }: FileTableProps) {
  const columns = useMemo(() => createFileColumns({ onView }), [onView]);

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={PAGE_SIZE}
      emptyMessage="No files match your filters."
      itemLabel="records"
    />
  );
}
