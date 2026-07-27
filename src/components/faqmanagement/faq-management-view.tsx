"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FaqManagementHeader } from "./faq-management-header";
import { FaqToolbar } from "./faq-toolbar";
import { FaqTable } from "./faq-table";
import { FaqFormModal } from "./modal/faq-form-modal";
import { FaqCategoryListModal } from "./modal/faq-category-list-modal";
import { FaqCategoryFormModal } from "./modal/faq-category-form-modal";
import {
  useLazyGetFaqCategoryQuery,
  useDeleteFaqCategoryMutation,
  useLazyGetFaqQuery,
  useDeleteFaqMutation,
  type FaqCategoryRecord,
  type FaqRecord,
} from "@/services/faq/faqApi";
import { getApiErrorMessage } from "@/lib/api-error";

type FaqFormModalState =
  | { mode: "add" }
  | { mode: "edit"; faqCode: string; categoryId: string; question: string; answer: string }
  | null;
type CategoryFormModalState =
  | { mode: "add" }
  | { mode: "edit"; categoryCode: string; categoryName: string }
  | null;

export function FaqManagementView() {
  const [categoryCodeFilter, setCategoryCodeFilter] = useState("all");
  const [faqFormModal, setFaqFormModal] = useState<FaqFormModalState>(null);
  const [faqPendingDelete, setFaqPendingDelete] = useState<FaqRecord | null>(null);
  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [categoryFormModal, setCategoryFormModal] = useState<CategoryFormModalState>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<FaqCategoryRecord | null>(null);
  const [triggerGetFaqCategory] = useLazyGetFaqCategoryQuery();
  const [deleteFaqCategory, { isLoading: isDeletingCategory }] = useDeleteFaqCategoryMutation();
  const [triggerGetFaq] = useLazyGetFaqQuery();
  const [deleteFaq, { isLoading: isDeletingFaq }] = useDeleteFaqMutation();

  const handleEditFaq = async (record: FaqRecord) => {
    try {
      const response = await triggerGetFaq(record.code).unwrap();
      const faq = response.responseObj.responseDataParams.data.record;
      setFaqFormModal({
        mode: "edit",
        faqCode: faq.code,
        categoryId: faq.categoryCode,
        question: faq.question,
        answer: faq.answer,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this FAQ. Please try again."));
    }
  };

  const handleConfirmDeleteFaq = async () => {
    if (!faqPendingDelete) return;
    try {
      const response = await deleteFaq(faqPendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this FAQ. Please try again."));
    } finally {
      setFaqPendingDelete(null);
    }
  };

  const handleSaveCategory = () => {
    // Success toast for both add and edit already shown by
    // FaqCategoryFormModal using the backend's `responseMessage`. The FAQ
    // Category list and the FAQ form's category dropdown both refetch on
    // their own via RTK Query's cache tag invalidation.
    setCategoryFormModal(null);
  };

  const handleEditCategory = async (record: FaqCategoryRecord) => {
    try {
      const response = await triggerGetFaqCategory(record.code).unwrap();
      const category = response.responseObj.responseDataParams.data.record;
      setCategoryFormModal({ mode: "edit", categoryCode: category.code, categoryName: category.categoryName });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this category. Please try again."));
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryPendingDelete) return;
    try {
      const response = await deleteFaqCategory(categoryPendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this category. Please try again."));
    } finally {
      setCategoryPendingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <FaqManagementHeader onAddCategory={() => setCategoryListOpen(true)} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <FaqToolbar
          categoryCodeFilter={categoryCodeFilter}
          onCategoryCodeFilterChange={setCategoryCodeFilter}
          onAddFaq={() => setFaqFormModal({ mode: "add" })}
        />

        <FaqTable
          key={categoryCodeFilter}
          categoryCodeFilter={categoryCodeFilter}
          onEdit={handleEditFaq}
          onDelete={(record) => setFaqPendingDelete(record)}
        />
      </div>

      {faqFormModal && (
        <FaqFormModal
          mode={faqFormModal.mode}
          initialValues={
            faqFormModal.mode === "edit"
              ? {
                  categoryId: faqFormModal.categoryId,
                  question: faqFormModal.question,
                  answer: faqFormModal.answer,
                }
              : undefined
          }
          faqCode={faqFormModal.mode === "edit" ? faqFormModal.faqCode : undefined}
          onSave={() => setFaqFormModal(null)}
          onCancel={() => setFaqFormModal(null)}
        />
      )}

      {categoryListOpen && (
        <FaqCategoryListModal
          onAddCategory={() => setCategoryFormModal({ mode: "add" })}
          onEditCategory={handleEditCategory}
          onDeleteCategory={(record) => setCategoryPendingDelete(record)}
          onClose={() => setCategoryListOpen(false)}
          disableEscapeClose={categoryFormModal !== null || categoryPendingDelete !== null}
        />
      )}

      {categoryFormModal && (
        <FaqCategoryFormModal
          mode={categoryFormModal.mode}
          initialValues={
            categoryFormModal.mode === "edit"
              ? { name: categoryFormModal.categoryName, description: "" }
              : undefined
          }
          categoryCode={categoryFormModal.mode === "edit" ? categoryFormModal.categoryCode : undefined}
          onSave={handleSaveCategory}
          onCancel={() => setCategoryFormModal(null)}
        />
      )}

      <ConfirmDialog
        open={faqPendingDelete !== null}
        title="Delete FAQ"
        description={
          faqPendingDelete
            ? `Are you sure you want to delete "${faqPendingDelete.question}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingFaq ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteFaq}
        onCancel={() => setFaqPendingDelete(null)}
      />

      <ConfirmDialog
        open={categoryPendingDelete !== null}
        title="Delete FAQ Category"
        description={
          categoryPendingDelete
            ? `Are you sure you want to delete "${categoryPendingDelete.categoryName}"? This action cannot be undone.`
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
