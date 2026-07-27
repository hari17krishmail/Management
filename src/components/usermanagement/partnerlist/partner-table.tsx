"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import type { Partner } from "../types";
import { StatusBadge } from "../status-badge";
import { FraudScoreBar } from "../fraud-score-bar";

const PAGE_SIZE = 4;

function matchesSearch(partner: Partner, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [partner.id, partner.name, partner.mobile, partner.referralId].some((field) =>
    field.toLowerCase().includes(normalized),
  );
}

type PartnerTableProps = {
  partners: Partner[];
  search: string;
  status: string;
};

export function PartnerTable({ partners, search, status }: PartnerTableProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const filtered = partners.filter(
    (partner) => (status === "All Status" || partner.status === status) && matchesSearch(partner, search),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRecords = filtered.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (pageNumber - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filtered.length, pageNumber * PAGE_SIZE);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Partner ID
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Mobile
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Referral ID
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Registered
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Fraud Score
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                View
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                  No partners match your search.
                </td>
              </tr>
            ) : (
              pageRecords.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-50/60">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-600">{partner.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900">{partner.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{partner.mobile}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-400">{partner.referralId}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{partner.registeredDate}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusBadge status={partner.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <FraudScoreBar score={partner.fraudScore} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Link
                      href={`/user-management/${partner.id}`}
                      aria-label={`View ${partner.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:px-6">
          <p className="text-sm text-gray-500">
            Showing {rangeStart} to {rangeEnd} of {filtered.length} partners
          </p>
          <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />
        </div>
      )}
    </>
  );
}
