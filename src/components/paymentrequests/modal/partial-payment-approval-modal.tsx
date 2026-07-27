"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, PieChart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/form/textarea-field";
import type { PaymentRequestRecord } from "../types";
import {
  createPaymentPartialApprovalSchema,
  type PaymentPartialApprovalFormValues,
} from "@/lib/validation/payment-partial-approval-schema";

type PartialPaymentApprovalModalProps = {
  record: PaymentRequestRecord;
  onSave: (values: PaymentPartialApprovalFormValues) => void;
  onCancel: () => void;
};

function formatWholeCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PartialPaymentApprovalModal({ record, onSave, onCancel }: PartialPaymentApprovalModalProps) {
  const schema = useMemo(() => createPaymentPartialApprovalSchema(record.requestedAmount), [record.requestedAmount]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaymentPartialApprovalFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { partialAmount: undefined, reason: "" },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const watchedPartialAmount = watch("partialAmount");
  const partialAmount =
    typeof watchedPartialAmount === "number" && !Number.isNaN(watchedPartialAmount) ? watchedPartialAmount : 0;
  const remainingBalance = Math.max(record.requestedAmount - partialAmount, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partial-approval-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <PieChart className="h-4.5 w-4.5" />
            </span>
            <h2 id="partial-approval-title" className="text-base font-semibold">
              Partial Payment Approval
            </h2>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{record.partnerName}</p>
              <p className="text-xs text-gray-500">
                {record.id} <span className="mx-1">•</span> {record.mobileNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total Requested</p>
              <p className="text-base font-bold text-gray-900">{formatWholeCurrency(record.requestedAmount)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="partial-amount" className="mb-1.5 block text-sm font-medium text-gray-700">
                Partial Amount
              </label>
              <div
                className={`flex items-stretch overflow-hidden rounded-lg border bg-green-50 ${
                  errors.partialAmount
                    ? "border-red-400"
                    : "border-green-300 focus-within:ring-2 focus-within:ring-blue-500/40"
                }`}
              >
                <span className="flex items-center px-3 text-sm text-green-700">₹</span>
                <input
                  id="partial-amount"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  aria-invalid={errors.partialAmount ? "true" : "false"}
                  className="block w-full bg-transparent py-2.5 pr-3 text-sm font-semibold text-green-700 placeholder:text-green-600/60 focus:outline-none"
                  {...register("partialAmount", { valueAsNumber: true })}
                />
              </div>
              {errors.partialAmount && <p className="mt-1.5 text-sm text-red-600">{errors.partialAmount.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Remaining Balance</label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-500">
                {formatWholeCurrency(remainingBalance)}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">Settlement Breakdown</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-gray-700">
                <span>Approved Amount</span>
                <span>{formatWholeCurrency(partialAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Platform Deductions (0%)</span>
                <span>{formatWholeCurrency(0)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-200 pt-1.5 font-semibold text-gray-900">
                <span>Amount to Transfer</span>
                <span>{formatWholeCurrency(partialAmount)}</span>
              </div>
            </div>
          </div>

          <TextareaField
            id="partial-reason"
            label="Reason for Partial Approval"
            rows={3}
            placeholder="Explain why only a partial amount is being approved..."
            error={errors.reason?.message}
            {...register("reason")}
          />

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <CheckCircle2 className="h-4 w-4" />
              Approve Partial Amount
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
