import type { SupportTicket } from "../types";

export function TicketTimestampsCard({ ticket }: { ticket: SupportTicket }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Timestamps</h3>
      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
        <div className="pb-3">
          <p className="text-sm text-gray-500">Created At</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.createdAt}</p>
        </div>
        <div className="pt-3">
          <p className="text-sm text-gray-500">{ticket.resolution ? "Resolved At" : "Last Updated"}</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.updatedAt}</p>
        </div>
      </div>
    </div>
  );
}
