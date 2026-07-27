"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Ban, GraduationCap, User, X } from "lucide-react";
import type { FileRecord } from "../types";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TextareaField } from "@/components/ui/form/textarea-field";
import { REJECTION_REASONS } from "../types";
import { fileRejectSchema, type FileRejectFormValues } from "@/lib/validation/file-reject-schema";

type FileRejectModalProps = {
  record: FileRecord;
  onSave: (values: FileRejectFormValues) => void;
  onCancel: () => void;
};

const REMARKS_MAX_LENGTH = 300;

export function FileRejectModal({ record, onSave, onCancel }: FileRejectModalProps) {
  const [pendingValues, setPendingValues] = useState<FileRejectFormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FileRejectFormValues>({
    resolver: zodResolver(fileRejectSchema),
    defaultValues: { reason: undefined, remarks: "" },
  });

  const remarksLength = watch("remarks")?.length ?? 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // While the confirm dialog is open, let its own Escape handler close
      // just the confirm — not this whole modal underneath it.
      if (pendingValues) return;
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, pendingValues]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-reject-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Ban className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="file-reject-title" className="text-base font-semibold">
                Reject Lead
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Provide a reason to reject this lead.</p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form
          id="file-reject-form"
          onSubmit={handleSubmit(setPendingValues)}
          noValidate
          className="flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-500">
              <User className="h-4.5 w-4.5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {record.studentName} <span className="text-gray-400">#{record.id}</span>
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-500">
                <GraduationCap className="h-3.5 w-3.5" />
                {record.lookingFor}
                <span className="mx-1">•</span>
                Submitted {record.submittedDate}
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
                >
                  <input
                    type="radio"
                    value={reason}
                    className="h-3.5 w-3.5 accent-blue-600"
                    {...register("reason")}
                  />
                  {reason}
                </label>
              ))}
            </div>
            {errors.reason && <p className="mt-1.5 text-sm text-red-600">{errors.reason.message}</p>}
          </div>

          <div>
            <TextareaField
              id="reject-remarks"
              label="Remarks (Optional)"
              rows={3}
              maxLength={REMARKS_MAX_LENGTH}
              placeholder="Add any additional notes or context about the rejection..."
              error={errors.remarks?.message}
              {...register("remarks")}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {remarksLength} / {REMARKS_MAX_LENGTH}
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            This action will mark the lead as Rejected and cannot be undone easily. Make sure you have selected the
            correct reason before proceeding.
          </div>
        </form>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <p className="text-xs text-gray-400">Rejection will be logged with your account.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" form="file-reject-form" variant="destructive" disabled={isSubmitting}>
              Reject Lead
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingValues !== null}
        title="Reject this lead?"
        description={`This will mark ${record.studentName}'s lead as Rejected and cannot be undone easily. Are you sure you want to continue?`}
        confirmLabel="Reject Lead"
        cancelLabel="Cancel"
        onConfirm={() => {
          if (pendingValues) onSave(pendingValues);
          setPendingValues(null);
        }}
        onCancel={() => setPendingValues(null)}
      />
    </div>
  );
}
