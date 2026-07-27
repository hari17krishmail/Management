"use client";

import { useState } from "react";
import { Eye, TrendingUp } from "lucide-react";
import type { PartnerDetail } from "../../types";
import { Button } from "@/components/ui/button";
import { DetailCard } from "./detail-card";
import { FileEarningModal } from "./file-earning/file-earning-modal";

const METRICS: {
  key: keyof PartnerDetail["filePerformance"];
  label: string;
  tone: string;
  hasModal?: boolean;
}[] = [
  { key: "totalFiles", label: "Total Files", tone: "text-gray-900" },
  { key: "approvedFiles", label: "Approved Files Count", tone: "text-green-600" },
  { key: "rejectedFiles", label: "Rejected Files Count", tone: "text-red-600" },
  { key: "fileEarnings", label: "File Earnings", tone: "text-blue-600", hasModal: true },
];

export function FilePerformance({ partner }: { partner: PartnerDetail }) {
  const { filePerformance } = partner;
  const [fileModalOpen, setFileModalOpen] = useState(false);

  return (
    <DetailCard
      title="File Performance"
      icon={TrendingUp}
      action={
        <select
          defaultValue="6m"
          aria-label="File performance range"
          className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="3m">Last 3 months</option>
          <option value="6m">Last 6 months</option>
          <option value="12m">Last 12 months</option>
        </select>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METRICS.map((metric) =>
          metric.hasModal ? (
            <Button
              key={metric.key}
              variant="unstyled"
              onClick={() => setFileModalOpen(true)}
              className="relative rounded-lg border border-gray-200 p-3 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40"
            >
              <Eye className="absolute right-2 top-2 h-3.5 w-3.5 text-gray-400 cursor-pointer" />
              <p className={`text-lg font-semibold ${metric.tone}`}>{filePerformance[metric.key]}</p>
              <p className="mt-0.5 text-xs text-gray-500">{metric.label}</p>
            </Button>
          ) : (
            <div key={metric.key} className="rounded-lg border border-gray-200 p-3 text-center">
              <p className={`text-lg font-semibold ${metric.tone}`}>{filePerformance[metric.key]}</p>
              <p className="mt-0.5 text-xs text-gray-500">{metric.label}</p>
            </div>
          ),
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Conversion Rate</span>
          <span className="font-medium text-gray-900">{filePerformance.conversionRate.toFixed(1)}%</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-gray-100">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{ width: `${filePerformance.conversionRate}%` }}
          />
        </div>
      </div>

      <FileEarningModal open={fileModalOpen} onClose={() => setFileModalOpen(false)} partner={partner} />
    </DetailCard>
  );
}
