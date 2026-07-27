import type { TicketPriority } from "./types";

const PRIORITY_CLASSES: Record<TicketPriority, string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${PRIORITY_CLASSES[priority]}`}
    >
      {priority}
    </span>
  );
}
