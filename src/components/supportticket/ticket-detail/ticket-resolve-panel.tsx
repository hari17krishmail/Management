"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ticketResolutionSchema, type TicketResolutionFormValues } from "@/lib/validation/ticket-resolution-schema";

type TicketResolvePanelProps = {
  onResolve: (note: string) => void;
};

export function TicketResolvePanel({ onResolve }: TicketResolvePanelProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketResolutionFormValues>({
    resolver: zodResolver(ticketResolutionSchema),
    defaultValues: { note: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onResolve(values.note))}
      noValidate
      className="rounded-xl border border-amber-200 bg-amber-50 p-4"
    >
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
        <Clock className="h-4 w-4" />
        Resolve Open Support Queries (1)
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
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          Resolve Queries
        </Button>
      </div>
    </form>
  );
}
