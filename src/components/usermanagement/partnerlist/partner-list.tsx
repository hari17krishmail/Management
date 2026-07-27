"use client";

import { useState } from "react";
import { MOCK_PARTNERS } from "../data";
import { PartnerToolbar } from "./partner-toolbar";
import { PartnerTable } from "./partner-table";

const STATUS_OPTIONS = ["All Status", "Active", "Locked"] as const;

export function PartnerList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
        <h2 className="text-sm font-semibold text-gray-900">Partner List</h2>
      </div>

      <PartnerToolbar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        statusOptions={STATUS_OPTIONS}
      />

      <PartnerTable
        key={`${search}::${status}`}
        partners={MOCK_PARTNERS}
        search={search}
        status={status}
      />
    </div>
  );
}
