import { CheckCircle2, Headset } from "lucide-react";
import type { TicketResolution } from "../types";

export function TicketResolvedByPanel({ resolution }: { resolution: TicketResolution }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%]">
        <p className="mb-1.5 flex items-center justify-end gap-1.5 text-sm font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          Resolved by: {resolution.respondedBy}
        </p>
        <div className="flex items-start justify-end gap-3">
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-gray-900">{resolution.note}</div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
            <Headset className="h-4.5 w-4.5" />
          </span>
        </div>
        <p className="mt-1.5 text-right text-xs text-gray-400">{resolution.timestamp}</p>
      </div>
    </div>
  );
}
