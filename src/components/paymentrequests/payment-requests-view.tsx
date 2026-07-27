"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { INITIAL_PAYMENT_REQUESTS } from "./data";
import { PaymentRequestSummaryCards } from "./payment-request-summary-cards";
import { PaymentRequestToolbar } from "./payment-request-toolbar";
import { PaymentRequestTable } from "./payment-request-table";
import { ApproveFullSettlementModal } from "./modal/approve-full-settlement-modal";
import { PartialPaymentApprovalModal } from "./modal/partial-payment-approval-modal";
import { HoldPaymentRequestModal } from "./modal/hold-payment-request-modal";
import { RejectPayoutRequestModal } from "./modal/reject-payout-request-modal";
import type { PaymentRequestAction, PaymentRequestRecord } from "./types";
import type { PaymentApproveFormValues } from "@/lib/validation/payment-approve-schema";
import type { PaymentPartialApprovalFormValues } from "@/lib/validation/payment-partial-approval-schema";
import type { PaymentHoldFormValues } from "@/lib/validation/payment-hold-schema";
import type { PaymentRejectFormValues } from "@/lib/validation/payment-reject-schema";

// This feature has no backend yet — these two aggregate stats are
// illustrative constants rather than derived from the mock request list,
// since "today"/"this month" totals aren't meaningfully computable from a
// small static mock dataset.
const APPROVED_TODAY_AMOUNT = 10000;
const TOTAL_PAYOUTS_MONTH_AMOUNT = 4000;

type ActionModalState =
  | { type: "approve"; record: PaymentRequestRecord }
  | { type: "partial"; record: PaymentRequestRecord }
  | { type: "hold"; record: PaymentRequestRecord }
  | { type: "reject"; record: PaymentRequestRecord }
  | null;

const ACTION_TO_MODAL_TYPE: Record<PaymentRequestAction, NonNullable<ActionModalState>["type"]> = {
  approve: "approve",
  partial: "partial",
  hold: "hold",
  reject: "reject",
};

export function PaymentRequestsView() {
  const [records, setRecords] = useState<PaymentRequestRecord[]>(INITIAL_PAYMENT_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState<ActionModalState>(null);

  // Summary cards reflect the full dataset regardless of the table's
  // search/status filters — matching how the ticket/college summary cards
  // elsewhere in this app stay independent of their list's active filters.
  const pendingCount = useMemo(() => records.filter((record) => record.status === "Pending").length, [records]);
  const rejectedCount = useMemo(() => records.filter((record) => record.status === "Rejected").length, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      if (statusFilter !== "All" && record.status !== statusFilter) return false;
      if (query) {
        const matches = [record.partnerName, record.partnerId].some((field) =>
          field.toLowerCase().includes(query),
        );
        if (!matches) return false;
      }
      return true;
    });
  }, [records, search, statusFilter]);

  const updateRecord = (id: string, changes: Partial<PaymentRequestRecord>) => {
    setRecords((prev) => prev.map((record) => (record.id === id ? { ...record, ...changes } : record)));
  };

  const handleMenuAction = (record: PaymentRequestRecord, action: PaymentRequestAction) => {
    setModal({ type: ACTION_TO_MODAL_TYPE[action], record });
  };

  const handleApprove = (values: PaymentApproveFormValues) => {
    if (modal?.type !== "approve") return;
    updateRecord(modal.record.id, { status: "Approved", paymentDate: values.paymentDate });
    toast.success(`${modal.record.partnerName}'s request (${modal.record.id}) was approved fully`);
    setModal(null);
  };

  const handlePartialApprove = (values: PaymentPartialApprovalFormValues) => {
    if (modal?.type !== "partial") return;
    updateRecord(modal.record.id, {
      status: "Partial",
      partialAmount: values.partialAmount,
      remainingBalance: modal.record.requestedAmount - values.partialAmount,
      partialReason: values.reason,
    });
    toast.success(`${modal.record.partnerName}'s request (${modal.record.id}) was partially approved`);
    setModal(null);
  };

  const handleHold = (values: PaymentHoldFormValues) => {
    if (modal?.type !== "hold") return;
    updateRecord(modal.record.id, {
      status: "Hold",
      holdReason: values.holdReason,
      holdUntilDate: values.holdUntilDate,
      internalNotes: values.internalNotes,
    });
    toast.success(`${modal.record.partnerName}'s request (${modal.record.id}) was put on hold`);
    setModal(null);
  };

  const handleReject = (values: PaymentRejectFormValues) => {
    if (modal?.type !== "reject") return;
    updateRecord(modal.record.id, {
      status: "Rejected",
      rejectionReason: values.rejectionReason,
      internalRemarks: values.internalRemarks,
    });
    toast.success(`${modal.record.partnerName}'s request (${modal.record.id}) was rejected`);
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Payment Requests</h1>
        <p className="text-sm text-gray-500">Review and process partner payment requests.</p>
      </div>

      <PaymentRequestSummaryCards
        pendingCount={pendingCount}
        approvedTodayAmount={APPROVED_TODAY_AMOUNT}
        totalPayoutsMonthAmount={TOTAL_PAYOUTS_MONTH_AMOUNT}
        rejectedCount={rejectedCount}
      />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-900">Recent Withdrawal Requests</h2>
        </div>

        <PaymentRequestToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <PaymentRequestTable
          key={`${search}::${statusFilter}`}
          records={filteredRecords}
          onAction={handleMenuAction}
        />
      </div>

      {modal?.type === "approve" && (
        <ApproveFullSettlementModal record={modal.record} onSave={handleApprove} onCancel={() => setModal(null)} />
      )}

      {modal?.type === "partial" && (
        <PartialPaymentApprovalModal
          record={modal.record}
          onSave={handlePartialApprove}
          onCancel={() => setModal(null)}
        />
      )}

      {modal?.type === "hold" && <HoldPaymentRequestModal onSave={handleHold} onCancel={() => setModal(null)} />}

      {modal?.type === "reject" && (
        <RejectPayoutRequestModal record={modal.record} onSave={handleReject} onCancel={() => setModal(null)} />
      )}
    </div>
  );
}
