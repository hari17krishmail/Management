"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/text-field";
import { SelectField } from "@/components/ui/form/select-field";
import { TextareaField } from "@/components/ui/form/textarea-field";
import { faqSchema, type FaqFormValues } from "@/lib/validation/faq-schema";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useListFaqCategoriesQuery,
} from "@/services/faq/faqApi";

export type { FaqFormValues };

// Emitted to the parent once a FAQ is ready to go into local state:
// `categoryName` is only present for the "add" path, resolved from the
// category dropdown so the FAQ table can display it without a lookup.
export type FaqSaveValues = FaqFormValues & { categoryName?: string };

type FaqFormModalProps = {
  mode: "add" | "edit";
  initialValues?: FaqFormValues;
  // Required when mode === "edit" — the backend's `code` for this FAQ, sent
  // as `faqCode` in the update request.
  faqCode?: string;
  onSave: (values: FaqSaveValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: FaqFormValues = { categoryId: "", question: "", answer: "" };

// Large enough to cover the category list in one request for a plain
// dropdown; if the category count grows well past this, switch to a
// searchable/paginated combobox instead of raising this further.
const CATEGORY_OPTIONS_PAGE_SIZE = 100;

// Mounted only while open (see FaqManagementView), so the form naturally starts
// fresh from `initialValues` every time it opens — no reset effect needed.
export function FaqFormModal({ mode, initialValues, faqCode, onSave, onCancel }: FaqFormModalProps) {
  const isEdit = mode === "edit";
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const { data: categoryData, isLoading: isLoadingCategories } = useListFaqCategoriesQuery({
    pageNumber: 1,
    pageSize: CATEGORY_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const categoryOptions = categoryData?.responseObj.responseDataParams.data.records ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: FaqFormValues) => {
    try {
      if (isEdit) {
        if (!faqCode) return;
        const response = await updateFaq({
          faqCode,
          question: values.question,
          answer: values.answer,
        }).unwrap();
        toast.success(response.responseObj.responseMessage);
        onSave(values);
        return;
      }

      const response = await createFaq({
        categoryCode: values.categoryId,
        question: values.question,
        answer: values.answer,
      }).unwrap();
      toast.success(response.responseObj.responseMessage);
      const categoryName = categoryOptions.find((category) => category.code === values.categoryId)?.categoryName;
      onSave({ ...values, categoryName });
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEdit ? "Could not update the FAQ. Please try again." : "Could not create the FAQ. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-form-title"
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <HelpCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 id="faq-form-title" className="text-base font-semibold">
                {isEdit ? "Edit FAQ" : "Add New FAQ"}
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">
                {isEdit ? "Update the details for this FAQ entry" : "Fill in the details to create a new FAQ entry"}
              </p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto border-t border-gray-100 px-6 py-5">
            <SelectField
              id="faq-category"
              label="Category"
              required
              disabled={isLoadingCategories || isEdit}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            >
              <option value="" disabled>
                {isLoadingCategories ? "Loading categories..." : "Select a category"}
              </option>
              {categoryOptions.map((category) => (
                <option key={category._id} value={category.code}>
                  {category.categoryName}
                </option>
              ))}
            </SelectField>
            {isEdit && (
              <p className="-mt-2 text-xs text-gray-500">The category can&apos;t be changed after a FAQ is created.</p>
            )}

            <TextField
              id="faq-question"
              label="Question"
              required
              placeholder="e.g. How do I track my order status?"
              error={errors.question?.message}
              {...register("question")}
            />

            <TextareaField
              id="faq-answer"
              label="Answer"
              required
              rows={5}
              placeholder="Provide a detailed answer here..."
              error={errors.answer?.message}
              {...register("answer")}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
              <Plus className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Add FAQ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
