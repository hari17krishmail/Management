"use client";

import { useEffect, useState } from "react";
import { Download, Search, Users, X } from "lucide-react";
import type { PartnerDetail } from "../../../types";
import { Button } from "@/components/ui/button";
import { REFERRAL_EARNING_RECORDS } from "./referral-earning-data";
import { ReferralEarningTable } from "./referral-earning-table";

const WALLET_OPTIONS = ["All", "Yes", "No"] as const;

type ReferralEarningModalProps = {
  open: boolean;
  onClose: () => void;
  partner: PartnerDetail;
};

export function ReferralEarningModal({ open, onClose, partner }: ReferralEarningModalProps) {
  const [walletReceived, setWalletReceived] = useState<string>(WALLET_OPTIONS[0]);
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const query = search.trim().toLowerCase();
  const filtered = REFERRAL_EARNING_RECORDS.filter((record) => {
    if (walletReceived !== "All" && record.walletReceived !== (walletReceived === "Yes")) return false;
    if (dateFilter && record.dateOfOnboarding !== dateFilter) return false;
    if (query) {
      const matches = [record.partnerId, record.name].some((field) => field.toLowerCase().includes(query));
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="referral-earning-modal-title"
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <Users className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="referral-earning-modal-title" className="text-base font-semibold">
                Referral Earning
              </h2>
              <p className="text-sm text-blue-100">
                View and manage all referral partner earnings for {partner.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="success">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="header" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 border-b border-gray-200 px-6 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Wallet Received</label>
            <select
              value={walletReceived}
              onChange={(event) => setWalletReceived(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {WALLET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date of ONB</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="relative min-w-[220px] flex-1">
            <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
            <Search className="pointer-events-none absolute left-3 top-[calc(50%+7px)] h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Partner ID or Name..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <ReferralEarningTable key={`${walletReceived}|${dateFilter}|${query}`} data={filtered} />
      </div>
    </div>
  );
}
