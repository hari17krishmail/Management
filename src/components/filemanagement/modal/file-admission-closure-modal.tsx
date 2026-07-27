"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Landmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form/select-field";
import { TextareaField } from "@/components/ui/form/textarea-field";
import { FINAL_STATUS_OPTIONS } from "../types";
import {
  fileAdmissionClosureSchema,
  type FileAdmissionClosureFormValues,
} from "@/lib/validation/file-admission-closure-schema";

type FileAdmissionClosureModalProps = {
  onSave: (values: FileAdmissionClosureFormValues) => void;
  onCancel: () => void;
};

const REMARKS_MAX_LENGTH = 500;

export function FileAdmissionClosureModal({ onSave, onCancel }: FileAdmissionClosureModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FileAdmissionClosureFormValues>({
    resolver: zodResolver(fileAdmissionClosureSchema),
    defaultValues: { finalStatus: undefined, admissionValue: 0, remarks: "" },
  });

  const remarksLength = watch("remarks")?.length ?? 0;

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
        aria-labelledby="file-admission-closure-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Landmark className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="file-admission-closure-title" className="text-base font-semibold">
                Admission Closure
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Update the final admission status and value.</p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4 px-6 py-5">
          <SelectField
            id="closure-final-status"
            label="Final Status"
            required
            error={errors.finalStatus?.message}
            {...register("finalStatus")}
          >
            <option value="" disabled>
              Select a status
            </option>
            {FINAL_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </SelectField>

          <div>
            <label htmlFor="closure-admission-value" className="mb-1.5 block text-sm font-medium text-gray-700">
              Admission Value <span className="text-red-500">*</span>
            </label>
            <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/40">
              <span className="flex items-center border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
                ₹
              </span>
              <input
                id="closure-admission-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                aria-invalid={errors.admissionValue ? "true" : "false"}
                className="block w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                {...register("admissionValue", { valueAsNumber: true })}
              />
              <span className="flex items-center border-l border-gray-300 bg-gray-50 px-3 text-xs font-medium text-gray-500">
                INR
              </span>
            </div>
            {errors.admissionValue ? (
              <p className="mt-1.5 text-sm text-red-600">{errors.admissionValue.message}</p>
            ) : (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-400">
                <Info className="h-3.5 w-3.5" />
                Enter the final monetary value for this admission.
              </p>
            )}
          </div>

          <div>
            <TextareaField
              id="closure-remarks"
              label="Remarks"
              rows={4}
              maxLength={REMARKS_MAX_LENGTH}
              placeholder="Add any relevant notes or remarks about this admission closure..."
              error={errors.remarks?.message}
              {...register("remarks")}
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {remarksLength} / {REMARKS_MAX_LENGTH} characters
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
