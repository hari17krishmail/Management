"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form/select-field";
import { COLLEGE_NAME_OPTIONS, PAYMENT_STATUS_OPTIONS } from "../types";
import { fileApproveSchema, type FileApproveFormValues } from "@/lib/validation/file-approve-schema";

type FileApproveModalProps = {
  onSave: (values: FileApproveFormValues) => void;
  onCancel: () => void;
};

export function FileApproveModal({ onSave, onCancel }: FileApproveModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FileApproveFormValues>({
    resolver: zodResolver(fileApproveSchema),
    defaultValues: { collegeName: "", paymentStatus: undefined },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-approve-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FolderCheck className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="file-approve-title" className="text-base font-semibold">
                Approve File
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Fill in the details to approve this student file</p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4 px-6 py-5">
          <SelectField
            id="approve-college-name"
            label="College Name"
            required
            error={errors.collegeName?.message}
            {...register("collegeName")}
          >
            <option value="" disabled>
              Select College
            </option>
            {COLLEGE_NAME_OPTIONS.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="approve-payment-status"
            label="Payment Status"
            required
            error={errors.paymentStatus?.message}
            {...register("paymentStatus")}
          >
            <option value="" disabled>
              Select Payment Status
            </option>
            {PAYMENT_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
