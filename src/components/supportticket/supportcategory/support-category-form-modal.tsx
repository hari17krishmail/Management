"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/text-field";
import { SelectField } from "@/components/ui/form/select-field";
import {
  supportCategorySchema,
  SUPPORT_CATEGORY_PRIORITIES,
  type SupportCategoryFormValues,
} from "@/lib/validation/support-category-schema";
import { getApiErrorMessage } from "@/lib/api-error";
import { useCreateReasonMutation, useUpdateReasonMutation } from "@/services/reason/reasonApi";

export type { SupportCategoryFormValues };

// Emitted to the parent once a category is ready to go into local state:
// `id` is only present once the backend has confirmed the create/update and
// handed back the real reason id.
export type SupportCategorySaveValues = SupportCategoryFormValues & { id?: string };

type SupportCategoryFormModalProps = {
  mode: "add" | "edit";
  initialValues?: SupportCategoryFormValues;
  // Required when mode === "edit" — the backend's `code` for this category,
  // sent as `reasonCode` in the update request.
  reasonCode?: string;
  onSave: (values: SupportCategorySaveValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: SupportCategoryFormValues = { name: "", description: "", priority: "" };

// Mounted only while open (see SupportTicketView), so the form naturally starts
// fresh from `initialValues` every time it opens — no reset effect needed.
export function SupportCategoryFormModal({
  mode,
  initialValues,
  reasonCode,
  onSave,
  onCancel,
}: SupportCategoryFormModalProps) {
  const isEdit = mode === "edit";
  const [createReason, { isLoading: isCreating }] = useCreateReasonMutation();
  const [updateReason, { isLoading: isUpdating }] = useUpdateReasonMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupportCategoryFormValues>({
    resolver: zodResolver(supportCategorySchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: SupportCategoryFormValues) => {
    try {
      if (isEdit) {
        if (!reasonCode) return;
        const response = await updateReason({
          reasonCode,
          reasonName: values.name,
          priority: values.priority.toLowerCase(),
        }).unwrap();
        toast.success(response.responseObj.responseMessage);
        onSave({ ...values, id: response.responseObj.responseDataParams.data.record._id });
        return;
      }

      const response = await createReason({
        reasonName: values.name,
        priority: values.priority.toLowerCase(),
      }).unwrap();
      toast.success(response.responseObj.responseMessage);
      onSave({ ...values, id: response.responseObj.responseDataParams.data.record._id });
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEdit ? "Could not update the category. Please try again." : "Could not create the category. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-category-form-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FolderPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 id="support-category-form-title" className="text-base font-semibold">
                {isEdit ? "Edit Support Category" : "Add Support Category"}
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">
                {isEdit ? "Update this support category" : "Create a new support category"}
              </p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 border-t border-gray-100 px-6 py-5">
          <TextField
            id="support-category-name"
            label="Category Name"
            required
            placeholder="e.g. Payments"
            error={errors.name?.message}
            {...register("name")}
          />

          <SelectField
            id="support-category-priority"
            label="Priority"
            required
            error={errors.priority?.message}
            {...register("priority")}
          >
            <option value="" disabled>
              Select a priority
            </option>
            {SUPPORT_CATEGORY_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </SelectField>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
              {isEdit ? "Save Changes" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
