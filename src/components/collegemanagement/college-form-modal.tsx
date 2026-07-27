"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, X } from "lucide-react";
import { toast } from "sonner";
import type { District, ProgramStream } from "./types";
import { useCreateCollegeDetailsMutation, useUpdateCollegeDetailsMutation } from "@/services/college/collegeApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form/select-field";
import { TextField } from "@/components/ui/form/text-field";
import { FileField } from "@/components/ui/form/file-field";
import { collegeSchema, type CollegeFormValues } from "@/lib/validation/college-schema";

type CollegeFormModalProps = {
  programStreams: ProgramStream[];
  districts: District[];
  mode?: "add" | "edit";
  initialValues?: {
    collegeDetailsCode: string;
    programStreamId: string;
    district: string;
    name: string;
  };
  onSave: () => void;
  onCancel: () => void;
};

export function CollegeFormModal({
  programStreams,
  districts,
  mode = "add",
  initialValues,
  onSave,
  onCancel,
}: CollegeFormModalProps) {
  const [createCollegeDetails, { isLoading: isCreating }] = useCreateCollegeDetailsMutation();
  const [updateCollegeDetails, { isLoading: isUpdating }] = useUpdateCollegeDetailsMutation();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      programStreamId: initialValues?.programStreamId ?? "",
      district: initialValues?.district ?? "",
      name: initialValues?.name ?? "",
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: CollegeFormValues) => {
    try {
      const response = isEdit
        ? await updateCollegeDetails({
            collegeDetailsCode: initialValues!.collegeDetailsCode,
            streamCode: values.programStreamId,
            districtCode: values.district,
            collegeName: values.name,
            file: values.pdfFile?.[0],
          }).unwrap()
        : await createCollegeDetails({
            streamCode: values.programStreamId,
            districtCode: values.district,
            collegeName: values.name,
            file: values.pdfFile?.[0],
          }).unwrap();
      toast.success(response.responseObj.responseMessage);
      onSave();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, `Could not ${isEdit ? "update" : "create"} this college. Please try again.`),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="college-form-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FolderPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 id="college-form-title" className="text-base font-semibold">
                {isEdit ? "Edit College Details" : "Add College Details"}
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">
                {isEdit ? "Update this college master record" : "Create a new college master record"}
              </p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 border-t border-gray-100 px-6 py-5">
          <SelectField
            id="college-program-stream"
            label="Program / Stream"
            required
            error={errors.programStreamId?.message}
            {...register("programStreamId")}
          >
            <option value="" disabled>
              Select a Program / Stream
            </option>
            {programStreams.map((programStream) => (
              <option key={programStream.id} value={programStream.id}>
                {programStream.name}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="college-district"
            label="District"
            required
            error={errors.district?.message}
            {...register("district")}
          >
            <option value="" disabled>
              Select a District
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </SelectField>

          <TextField
            id="college-name"
            label="College Name"
            required
            placeholder="Enter College Name"
            error={errors.name?.message}
            {...register("name")}
          />

          <FileField
            id="college-pdf"
            label={isEdit ? "PDF Upload (optional — leave empty to keep the existing file)" : "PDF Upload (optional)"}
            accept="application/pdf"
            error={errors.pdfFile?.message}
            {...register("pdfFile")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
