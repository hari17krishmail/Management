"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReadOnlyField } from "@/components/ui/form/read-only-field";
import type { PaymentRequestRecord } from "../types";
import { paymentApproveSchema, type PaymentApproveFormValues } from "@/lib/validation/payment-approve-schema";

type ApproveFullSettlementModalProps = {
  record: PaymentRequestRecord;
  onSave: (values: PaymentApproveFormValues) => void;
  onCancel: () => void;
};

function formatWholeCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ApproveFullSettlementModal({ record, onSave, onCancel }: ApproveFullSettlementModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentApproveFormValues>({
    resolver: zodResolver(paymentApproveSchema),
    defaultValues: { paymentDate: todayISODate() },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const initial = record.partnerName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="approve-settlement-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <h2 id="approve-settlement-title" className="text-base font-semibold">
              Approve Full Settlement
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {record.bankVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Bank Account
              </span>
            )}
            <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4 px-6 py-5">
          <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-gray-900">
                {record.partnerName}
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              </p>
              <p className="truncate text-xs text-gray-500">
                {record.partnerId} <span className="mx-1">•</span> {record.mobileNumber}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Transfer Amount</label>
              <div className="rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm font-semibold text-green-700">
                {formatWholeCurrency(record.requestedAmount)}
              </div>
            </div>
            <div>
              <label htmlFor="approve-payment-date" className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                id="approve-payment-date"
                type="date"
                aria-invalid={errors.paymentDate ? "true" : "false"}
                className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  errors.paymentDate ? "border-red-400" : "border-gray-300 focus:border-blue-500"
                }`}
                {...register("paymentDate")}
              />
              {errors.paymentDate && <p className="mt-1.5 text-sm text-red-600">{errors.paymentDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ReadOnlyField id="approve-account-number" label="Account Number" value={record.accountNumber} />
            <ReadOnlyField id="approve-ifsc-code" label="IFSC Code" value={record.ifscCode} />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <CheckCircle2 className="h-4 w-4" />
              Confirm Approval
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
