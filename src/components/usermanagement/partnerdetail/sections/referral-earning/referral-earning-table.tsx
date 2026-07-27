"use client";

import { DataTable } from "@/components/ui/data-table";
import type { ReferralEarningRecord } from "./referral-earning-data";
import { referralEarningColumns } from "./referral-earning-columns";

const PAGE_SIZE = 10;

type ReferralEarningTableProps = {
  data: ReferralEarningRecord[];
};

export function ReferralEarningTable({ data }: ReferralEarningTableProps) {
  return (
    <DataTable
      data={data}
      columns={referralEarningColumns}
      pageSize={PAGE_SIZE}
      emptyMessage="No referral earnings match your filters."
      itemLabel="records"
    />
  );
}
