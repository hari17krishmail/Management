"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Ban, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaymentRequestRecord } from "../types";
import { paymentRejectSchema, type PaymentRejectFormValues } from "@/lib/validation/payment-reject-schema";

type RejectPayoutRequestModalProps = {
  record: PaymentRequestRecord;
  onSave: (values: PaymentRejectFormValues) => void;
  onCancel: () => void;
};

function formatWholeCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RejectPayoutRequestModal({ record, onSave, onCancel }: RejectPayoutRequestModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentRejectFormValues>({
    resolver: zodResolver(paymentRejectSchema),
    defaultValues: { rejectionReason: "", internalRemarks: "" },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-payout-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Ban className="h-4.5 w-4.5" />
            </span>
            <div>
              <h2 id="reject-payout-title" className="text-base font-semibold">
                Reject Payout Request
              </h2>
              <p className="mt-0.5 text-xs text-blue-100">
                Request ID: {record.id} <span className="text-blue-200">•</span> Partner: {record.partnerName}
              </p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p>
              <span className="font-semibold">Action Required:</span> You are about to reject a settlement request of{" "}
              {formatWholeCurrency(record.requestedAmount)}. This action cannot be undone. The funds will be returned
              to the partner&apos;s wallet balance.
            </p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="reject-reason" className="text-sm font-medium text-gray-700">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">Visible to partner</span>
            </div>
            <textarea
              id="reject-reason"
              rows={3}
              placeholder="E.g., Your bank details do not match the KYC documents provided. Please update your banking information and try again."
              aria-invalid={errors.rejectionReason ? "true" : "false"}
              className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                errors.rejectionReason ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
              {...register("rejectionReason")}
            />
            {errors.rejectionReason && (
              <p className="mt-1.5 text-sm text-red-600">{errors.rejectionReason.message}</p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="reject-internal-remarks" className="text-sm font-medium text-gray-700">
                Internal Remarks
              </label>
              <span className="text-xs text-gray-400">Admin only</span>
            </div>
            <textarea
              id="reject-internal-remarks"
              rows={3}
              placeholder="Add notes for other admins or finance team..."
              aria-invalid={errors.internalRemarks ? "true" : "false"}
              className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                errors.internalRemarks ? "border-red-400" : "border-gray-300 focus:border-blue-500"
              }`}
              {...register("internalRemarks")}
            />
            {errors.internalRemarks && (
              <p className="mt-1.5 text-sm text-red-600">{errors.internalRemarks.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              <Ban className="h-4 w-4" />
              Confirm Rejection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
