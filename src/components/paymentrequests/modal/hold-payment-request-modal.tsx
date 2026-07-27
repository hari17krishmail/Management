"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, PauseCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form/select-field";
import { TextareaField } from "@/components/ui/form/textarea-field";
import { HOLD_REASON_OPTIONS } from "../types";
import { paymentHoldSchema, type PaymentHoldFormValues } from "@/lib/validation/payment-hold-schema";

type HoldPaymentRequestModalProps = {
  onSave: (values: PaymentHoldFormValues) => void;
  onCancel: () => void;
};

export function HoldPaymentRequestModal({ onSave, onCancel }: HoldPaymentRequestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentHoldFormValues>({
    resolver: zodResolver(paymentHoldSchema),
    defaultValues: { holdReason: undefined, holdUntilDate: "", internalNotes: "" },
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
        aria-labelledby="hold-payment-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <PauseCircle className="h-4.5 w-4.5" />
            </span>
            <h2 id="hold-payment-title" className="text-base font-semibold">
              Hold Payment Request
            </h2>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4 px-6 py-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-semibold text-amber-800">Escalation Alert: Payment Held</p>
              <p className="mt-0.5 text-amber-700">
                Holding this payment will pause the settlement process and notify the partner.
              </p>
            </div>
          </div>

          <SelectField
            id="hold-reason"
            label="Hold Reason"
            required
            error={errors.holdReason?.message}
            {...register("holdReason")}
          >
            <option value="" disabled>
              Select a reason
            </option>
            {HOLD_REASON_OPTIONS.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </SelectField>

          <div>
            <label htmlFor="hold-until-date" className="mb-1.5 block text-sm font-medium text-gray-700">
              Hold Until Date <span className="text-red-500">*</span>
            </label>
            <input
              id="hold-until-date"
              type="date"
              aria-invalid={errors.holdUntilDate ? "true" : "false"}
              className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                errors.holdUntilDate ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
              {...register("holdUntilDate")}
            />
            {errors.holdUntilDate && <p className="mt-1.5 text-sm text-red-600">{errors.holdUntilDate.message}</p>}
          </div>

          <TextareaField
            id="hold-internal-notes"
            label="Internal Notes"
            rows={3}
            placeholder="Add remarks for internal reference..."
            error={errors.internalNotes?.message}
            {...register("internalNotes")}
          />

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <PauseCircle className="h-4 w-4" />
              Confirm Hold
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
