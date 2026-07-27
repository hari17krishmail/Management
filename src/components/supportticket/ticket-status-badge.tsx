import type { TicketStatus } from "./types";

// Single source of truth for status color so the table badge and the
// ticket detail modal's status pill can never drift out of sync.
export const TICKET_STATUS_TONE_CLASSES: Record<TicketStatus, string> = {
  Open: "bg-blue-50 text-blue-700",
  Resolved: "bg-green-50 text-green-700",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TICKET_STATUS_TONE_CLASSES[status]}`}
    >
      {status}
    </span>
  );
}
