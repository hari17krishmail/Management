"use client";

import { useEffect } from "react";
import { FolderOpen, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqCategoryTable } from "../faq-category-table";
import type { FaqCategoryRecord } from "@/services/faq/faqApi";

type FaqCategoryListModalProps = {
  onAddCategory: () => void;
  onEditCategory: (record: FaqCategoryRecord) => void;
  onDeleteCategory: (record: FaqCategoryRecord) => void;
  onClose: () => void;
  disableEscapeClose?: boolean;
};

export function FaqCategoryListModal({
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onClose,
  disableEscapeClose,
}: FaqCategoryListModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disableEscapeClose) return;
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, disableEscapeClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-category-list-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FolderOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 id="faq-category-list-title" className="text-base font-semibold">
                FAQ Categories
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Manage the categories used to organize FAQs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="header-filled" onClick={onAddCategory}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
            <Button variant="header" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <FaqCategoryTable onEdit={onEditCategory} onDelete={onDeleteCategory} />
        </div>
      </div>
    </div>
  );
}
