import { MessageSquare, Paperclip } from "lucide-react";
import type { SupportTicket } from "../types";
import { TicketPriorityBadge } from "../ticket-priority-badge";

export function TicketDetailsCard({ ticket }: { ticket: SupportTicket }) {
  const attachmentsCount = ticket.messages.reduce((sum, message) => sum + (message.attachments?.length ?? 0), 0);
  const supportsCount = ticket.messages.length + (ticket.resolution ? 1 : 0);

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Details</h3>
      <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
        <div className="pb-3">
          <p className="text-sm text-gray-500">Issue Category</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.category}</p>
        </div>
        <div className="py-3">
          <p className="text-sm text-gray-500">Priority Level</p>
          <div className="mt-1">
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3">
          <div>
            <p className="text-sm text-gray-500">Supports Count</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              {supportsCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Attachments</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <Paperclip className="h-4 w-4 text-blue-600" />
              {attachmentsCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
