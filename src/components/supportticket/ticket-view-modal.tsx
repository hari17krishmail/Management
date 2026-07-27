"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { X, MessageSquare, Paperclip, User, Headset, Clock } from "lucide-react";
import {
  useGetSupportTicketQuery,
  useCreateSupportTicketMessageMutation,
  type SupportTicketMessage,
} from "@/services/supportticket/supportTicketApi";
import { useLazyGeneratePresignedUrlQuery } from "@/services/storage/storageApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { ticketResolutionSchema, type TicketResolutionFormValues } from "@/lib/validation/ticket-resolution-schema";
import { Button } from "@/components/ui/button";
import { TICKET_STATUS_TONE_CLASSES } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import type { TicketPriority, TicketStatus } from "./types";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

// Handles ISO timestamps (e.g. "2026-07-24T09:49:05.855Z") as well as the
// backend's "DD-MM-YYYY hh:mm:ss AM/PM" format, which the native Date
// constructor can't parse and silently turns into an Invalid Date.
function parseMessageTimestamp(value: string): Date | null {
  let date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    const match = value.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      const [, day, month, year, hour, minute, second, meridiem] = match;
      let hour24 = Number(hour) % 12;
      if (meridiem.toUpperCase() === "PM") hour24 += 12;
      date = new Date(Number(year), Number(month) - 1, Number(day), hour24, Number(minute), Number(second));
    }
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatMessageTime(value: string) {
  const date = parseMessageTimestamp(value);
  if (!date) return "—";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMessageDate(value: string) {
  const date = parseMessageTimestamp(value);
  if (!date) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

type TicketViewModalProps = {
  ticketCode: string;
  onClose: () => void;
};

const STATUS_BORDER_CLASSES: Record<TicketStatus, string> = {
  Open: "border-blue-200",
  Resolved: "border-green-200",
};

function AttachmentButton({ fileId }: { fileId: string }) {
  const [fetchPresignedUrl, { isFetching }] = useLazyGeneratePresignedUrlQuery();

  const handleClick = async () => {
    try {
      const response = await fetchPresignedUrl(fileId).unwrap();
      const url = response.responseObj.responseDataParams.data.url;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not open this attachment."));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isFetching}
      className="mt-3 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60"
    >
      <Paperclip className="h-3.5 w-3.5" />
      {isFetching ? "Opening..." : fileId}
    </button>
  );
}

function ConversationMessage({ message, isLast, showAwaitingBadge }: {
  message: SupportTicketMessage;
  isLast: boolean;
  showAwaitingBadge: boolean;
}) {
  const isAdmin = message.sender === "admin";
  const date = formatMessageDate(message.createdAt);
  const time = formatMessageTime(message.createdAt);

  const bubble = (
    <div className="min-w-0 flex-1">
      <div className={`rounded-xl px-4 py-3 text-sm text-gray-900 ${isAdmin ? "bg-green-50" : "bg-gray-100"}`}>
        <p>{message.message}</p>
        {message.attachments.map((attachment) => (
          <AttachmentButton key={attachment} fileId={attachment} />
        ))}
      </div>
      <div className={`mt-1.5 flex items-center gap-2 ${isAdmin ? "justify-end" : ""}`}>
        <span className="text-xs text-gray-400">
          {date} · {time}
        </span>
        {isLast && showAwaitingBadge && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            Awaiting Resolution
          </span>
        )}
      </div>
    </div>
  );

  const avatar = (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isAdmin ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}
    >
      {isAdmin ? <Headset className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
    </span>
  );

  return (
    <div className={`flex items-start gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
      {avatar}
      {bubble}
    </div>
  );
}

export function TicketViewModal({ ticketCode, onClose }: TicketViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const { data, isLoading, isError, error } = useGetSupportTicketQuery(ticketCode);
  const [createMessage, { isLoading: isReplying }] = useCreateSupportTicketMessageMutation();
  const ticket = data?.responseObj.responseDataParams.data.record;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketResolutionFormValues>({
    resolver: zodResolver(ticketResolutionSchema),
    defaultValues: { note: "" },
  });

  const status = ticket ? (capitalize(ticket.status) as TicketStatus) : undefined;
  const priority = ticket ? (capitalize(ticket.priority) as TicketPriority) : undefined;
  const initial = ticket?.fullName ? ticket.fullName.charAt(0).toUpperCase() : "?";
  const supportCount = ticket?.messages.length ?? 0;
  const attachmentCount = ticket?.messages.reduce((sum, message) => sum + message.attachments.length, 0) ?? 0;
  const isOpen = ticket?.status.toLowerCase() === "open";

  const submitReply = async (values: TicketResolutionFormValues, updateStatus: "open" | "resolved") => {
    try {
      const response = await createMessage({ ticketCode, message: values.note, updateStatus }).unwrap();
      toast.success(response.responseObj.responseMessage);
      reset();
    } catch (replyError) {
      toast.error(getApiErrorMessage(replyError, "Could not send your reply. Please try again."));
    }
  };

  const handleSend = handleSubmit((values) => submitReply(values, "open"));
  const handleResolve = handleSubmit((values) => submitReply(values, "resolved"));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-view-title"
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div>
            <h2 id="ticket-view-title" className="text-lg font-bold text-white">
              Ticket details — {ticketCode}
            </h2>
            <p className="mt-0.5 text-sm text-blue-100">Manage support queries and client communications</p>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${TICKET_STATUS_TONE_CLASSES[status]} ${STATUS_BORDER_CLASSES[status]}`}
              >
                {status}
              </span>
            )}
            <Button variant="header" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-gray-500">Loading ticket details...</p>
        ) : isError || !ticket ? (
          <p className="py-10 text-center text-sm text-red-600">
            {getApiErrorMessage(error, "Could not load ticket details.")}
          </p>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-full max-w-xs shrink-0 space-y-5 overflow-y-auto border-r border-gray-100 px-6 py-5">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Ticket Creator</h3>
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 bg-gray-200 text-sm font-semibold text-gray-600">
                    {initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ticket.fullName || "—"}</p>
                    <p className="text-sm text-gray-500">Code: {ticket.userCode || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Details</h3>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
                  <div className="pb-3">
                    <p className="text-sm text-gray-500">Issue Category</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.reasonName}</p>
                  </div>
                  <div className="py-3">
                    <p className="text-sm text-gray-500">Priority Level</p>
                    <div className="mt-1">{priority && <TicketPriorityBadge priority={priority} />}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <p className="text-sm text-gray-500">Support Count</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        {supportCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Attachment Count</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                        <Paperclip className="h-4 w-4 text-blue-600" />
                        {attachmentCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Timestamps</h3>
                <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
                  <div className="pb-3">
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.createdAt}</p>
                  </div>
                  <div className="pt-3">
                    <p className="text-sm text-gray-500">Updated At</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{ticket.updatedAt}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-5">
                {ticket.messages.map((message, index) => (
                  <ConversationMessage
                    key={`${message.sender}-${index}`}
                    message={message}
                    isLast={index === ticket.messages.length - 1}
                    showAwaitingBadge={isOpen}
                  />
                ))}
              </div>

              {isOpen && (
                <form
                  onSubmit={handleSend}
                  noValidate
                  className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4"
                >
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <Clock className="h-4 w-4" />
                    Respond to Support Query
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Type your response..."
                        aria-invalid={errors.note ? "true" : "false"}
                        className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                          errors.note ? "border-red-400" : "border-gray-300 focus:border-blue-500"
                        }`}
                        {...register("note")}
                      />
                      {errors.note && <p className="mt-1.5 text-sm text-red-600">{errors.note.message}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="submit" variant="secondary" disabled={isSubmitting || isReplying}>
                        Send
                      </Button>
                      <Button type="button" onClick={handleResolve} disabled={isSubmitting || isReplying}>
                        Resolve
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Close Details
          </Button>
        </div>
      </div>
    </div>
  );
}
