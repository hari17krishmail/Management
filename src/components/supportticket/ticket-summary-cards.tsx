import { CheckCircle2, ClipboardList, ListCheckIcon } from "lucide-react";

type TicketSummaryCardsProps = {
  totalCount: number;
  openCount: number;
  resolvedCount: number;
};

export function TicketSummaryCards({ openCount, resolvedCount,totalCount }: TicketSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-orange-200 bg-orange-50/60 p-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Total Tickets</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalCount}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
          <ListCheckIcon className="h-5 w-5"/>
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Open Tickets</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{openCount}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ClipboardList className="h-5 w-5" />
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50/60 p-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Resolved Tickets</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{resolvedCount}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
