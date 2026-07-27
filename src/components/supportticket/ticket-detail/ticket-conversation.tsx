import { Paperclip, User } from "lucide-react";
import type { TicketMessage } from "../types";

type TicketConversationProps = {
  messages: TicketMessage[];
  showAwaitingBadge: boolean;
};

export function TicketConversation({ messages, showAwaitingBadge }: TicketConversationProps) {
  return (
    <div className="space-y-5">
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        return (
          <div key={message.id} className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
              <User className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-900">
                <p>{message.text}</p>
                {message.attachments?.map((attachment) => (
                  <div
                    key={attachment.name}
                    className="mt-3 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    {attachment.name}
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-gray-400">{message.timestamp}</span>
                {isLast && showAwaitingBadge && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    Awaiting Resolution
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
