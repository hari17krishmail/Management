"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SupportCategoryListModal } from "./supportcategory/support-category-list-modal";
import { SupportCategoryFormModal } from "./supportcategory/support-category-form-modal";
import { useDeleteReasonMutation, type ReasonRecord } from "@/services/reason/reasonApi";
import { useListSupportTicketsQuery } from "@/services/supportticket/supportTicketApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { SupportTicketHeader } from "./support-ticket-header";
import { TicketSummaryCards } from "./ticket-summary-cards";
import { TicketToolbar } from "./ticket-toolbar";
import { TicketTable } from "./ticket-table";

type CategoryFormModalState =
  | { mode: "add" }
  | { mode: "edit"; reasonCode: string; name: string; priority: string }
  | null;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function SupportTicketView() {
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [categoryCodeFilter, setCategoryCodeFilter] = useState("All Categories");

  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [categoryFormModal, setCategoryFormModal] = useState<CategoryFormModalState>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<ReasonRecord | null>(null);
  const [deleteReason, { isLoading: isDeletingCategory }] = useDeleteReasonMutation();

  // Global open/resolved counts come from the ticket list response itself
  // (independent of whatever filters/page the table currently has applied),
  // so a minimal unfiltered request is enough just to read them off.
  const { data: summaryData } = useListSupportTicketsQuery({ pageNumber: 1, pageSize: 1, sort: -1 });
  const summary = summaryData?.responseObj.responseDataParams.data;

  const handleSaveCategory = () => {
    // Success toast for both add and edit already shown by
    // SupportCategoryFormModal using the backend's `responseMessage`. The
    // category list and the ticket toolbar's filter both refetch on their
    // own via RTK Query's cache tag invalidation.
    setCategoryFormModal(null);
  };

  const handleEditCategory = (record: ReasonRecord) => {
    setCategoryFormModal({
      mode: "edit",
      reasonCode: record.code,
      name: record.reasonName,
      priority: capitalize(record.priority),
    });
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryPendingDelete) return;
    try {
      const response = await deleteReason(categoryPendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this category. Please try again."));
    } finally {
      setCategoryPendingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <SupportTicketHeader onAddCategory={() => setCategoryListOpen(true)} />

      <TicketSummaryCards openCount={summary?.openTicket ?? 0} resolvedCount={summary?.resolvedTicket ?? 0}  totalCount={summary?.totalTicket ?? 0}/>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <TicketToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categoryCodeFilter={categoryCodeFilter}
          onCategoryCodeFilterChange={setCategoryCodeFilter}
        />

        <TicketTable
          key={`${statusFilter}::${priorityFilter}::${categoryCodeFilter}`}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          categoryCodeFilter={categoryCodeFilter}
        />
      </div>

      {categoryListOpen && (
        <SupportCategoryListModal
          onAddCategory={() => setCategoryFormModal({ mode: "add" })}
          onEditCategory={handleEditCategory}
          onDeleteCategory={(record) => setCategoryPendingDelete(record)}
          onClose={() => setCategoryListOpen(false)}
          disableEscapeClose={categoryFormModal !== null || categoryPendingDelete !== null}
        />
      )}

      {categoryFormModal && (
        <SupportCategoryFormModal
          mode={categoryFormModal.mode}
          initialValues={
            categoryFormModal.mode === "edit"
              ? { name: categoryFormModal.name, description: "", priority: categoryFormModal.priority }
              : undefined
          }
          reasonCode={categoryFormModal.mode === "edit" ? categoryFormModal.reasonCode : undefined}
          onSave={handleSaveCategory}
          onCancel={() => setCategoryFormModal(null)}
        />
      )}

      <ConfirmDialog
        open={categoryPendingDelete !== null}
        title="Delete Support Category"
        description={
          categoryPendingDelete
            ? `Are you sure you want to delete "${categoryPendingDelete.reasonName}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingCategory ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setCategoryPendingDelete(null)}
      />
    </div>
  );
}
