"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCreateProgramStreamMutation, useUpdateProgramStreamMutation } from "@/services/programstream/programStreamApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/text-field";
import { programStreamSchema, type ProgramStreamFormValues } from "@/lib/validation/program-stream-schema";

export type { ProgramStreamFormValues };

type ProgramStreamFormModalProps = {
  mode: "add" | "edit";
  initialValues?: ProgramStreamFormValues;
  // Required when mode === "edit" — the backend's `streamCode` for this
  // program/stream, sent in the update request.
  streamCode?: string;
  onSave: () => void;
  onCancel: () => void;
};

const EMPTY_VALUES: ProgramStreamFormValues = { name: "" };

// Mounted only while open (see CollegeManagementView), so the form naturally starts
// fresh from `initialValues` every time it opens — no reset effect needed.
export function ProgramStreamFormModal({
  mode,
  initialValues,
  streamCode,
  onSave,
  onCancel,
}: ProgramStreamFormModalProps) {
  const isEdit = mode === "edit";
  const [createProgramStream, { isLoading: isCreating }] = useCreateProgramStreamMutation();
  const [updateProgramStream, { isLoading: isUpdating }] = useUpdateProgramStreamMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProgramStreamFormValues>({
    resolver: zodResolver(programStreamSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: ProgramStreamFormValues) => {
    try {
      if (isEdit) {
        if (!streamCode) return;
        const response = await updateProgramStream({ streamCode, streamName: values.name }).unwrap();
        toast.success(response.responseObj.responseMessage);
        onSave();
        return;
      }

      const response = await createProgramStream({ streamName: values.name }).unwrap();
      toast.success(response.responseObj.responseMessage);
      onSave();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEdit
            ? "Could not update this program / stream. Please try again."
            : "Could not create this program / stream. Please try again.",
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
        aria-labelledby="program-stream-form-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div>
            <h2 id="program-stream-form-title" className="text-base font-semibold text-white">
              {isEdit ? "Edit Program / Stream" : "Add Program / Stream"}
            </h2>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 border-t border-gray-100 px-6 py-5">
          <TextField
            id="program-stream-name"
            label="Program / Stream Name"
            required
            placeholder="Enter Program / Stream Name"
            error={errors.name?.message}
            {...register("name")}
          />

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
