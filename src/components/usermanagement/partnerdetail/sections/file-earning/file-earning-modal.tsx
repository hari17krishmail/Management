"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Search, X } from "lucide-react";
import type { PartnerDetail } from "../../../types";
import { Button } from "@/components/ui/button";
import { FILE_EARNING_RECORDS } from "./file-earning-data";
import { FileEarningTable } from "./file-earning-table";

const STATUS_OPTIONS = ["All", "Approved", "Pending", "Rejected"] as const;
const WALLET_OPTIONS = ["All", "Yes", "No"] as const;

type FileEarningModalProps = {
  open: boolean;
  onClose: () => void;
  partner: PartnerDetail;
};

export function FileEarningModal({ open, onClose, partner }: FileEarningModalProps) {
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);
  const [walletReceived, setWalletReceived] = useState<string>(WALLET_OPTIONS[0]);
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
  const filtered = FILE_EARNING_RECORDS.filter((record) => {
    if (status !== "All" && record.fileStatus !== status) return false;
    if (walletReceived !== "All" && record.walletReceived !== (walletReceived === "Yes")) return false;
    if (query) {
      const matches = [record.fileNumber, record.name, record.phoneNumber, record.emailId].some((field) =>
        field.toLowerCase().includes(query),
      );
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
        aria-labelledby="file-earning-modal-title"
        aria-describedby={`file-earning-modal-partner-${partner.id}`}
        className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <span id={`file-earning-modal-partner-${partner.id}`} className="sr-only">
          {partner.name} ({partner.id})
        </span>

        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <FileText className="h-4.5 w-4.5" />
            </span>
            <h2 id="file-earning-modal-title" className="text-base font-semibold">
              File Earning
            </h2>
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

        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 px-6 py-4">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Status"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Status: All" : option}
              </option>
            ))}
          </select>

          <select
            value={walletReceived}
            onChange={(event) => setWalletReceived(event.target.value)}
            aria-label="Wallet Received"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {WALLET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "All" ? "Wallet Received: All" : option}
              </option>
            ))}
          </select>

          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by File Number, Name, Phone or Email..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <FileEarningTable key={`${status}|${walletReceived}|${query}`} data={filtered} />
      </div>
    </div>
  );
}
