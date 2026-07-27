"use client";

import { DataTable } from "@/components/ui/data-table";
import type { NetworkCommissionRecord } from "./network-commission-data";
import { networkCommissionColumns } from "./network-commission-columns";

const PAGE_SIZE = 10;

type NetworkCommissionTableProps = {
  data: NetworkCommissionRecord[];
};

export function NetworkCommissionTable({ data }: NetworkCommissionTableProps) {
  return (
    <DataTable
      data={data}
      columns={networkCommissionColumns}
      pageSize={PAGE_SIZE}
      emptyMessage="No commission records match your filters."
      itemLabel="records"
    />
  );
}
