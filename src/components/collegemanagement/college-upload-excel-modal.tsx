"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import type { District, ProgramStream } from "./types";
import { useUploadCollegeDetailsMutation } from "@/services/college/collegeApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/form/select-field";
import { FileField } from "@/components/ui/form/file-field";
import {
  collegeUploadExcelSchema,
  type CollegeUploadExcelFormValues,
} from "@/lib/validation/college-upload-excel-schema";

type CollegeUploadExcelModalProps = {
  programStreams: ProgramStream[];
  districts: District[];
  onDone: () => void;
  onCancel: () => void;
};

export function CollegeUploadExcelModal({ programStreams, districts, onDone, onCancel }: CollegeUploadExcelModalProps) {
  const [uploadCollegeDetails, { isLoading: isUploading }] = useUploadCollegeDetailsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollegeUploadExcelFormValues>({
    resolver: zodResolver(collegeUploadExcelSchema),
    defaultValues: { programStreamId: "", district: "" },
  });

  const submit = async (values: CollegeUploadExcelFormValues) => {
    const file = values.excelFile[0];
    try {
      const response = await uploadCollegeDetails({
        streamCode: values.programStreamId,
        districtCode: values.district,
        file,
      }).unwrap();
      toast.success(response.responseObj.responseMessage);
      onDone();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not upload this file. Please try again."));
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-excel-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <UploadCloud className="h-5 w-5" />
            </span>
            <div>
              <h2 id="upload-excel-title" className="text-base font-semibold">
                Upload College Details
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Bulk import colleges from a CSV file</p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 border-t border-gray-100 px-6 py-5">
          <SelectField
            id="upload-excel-program-stream"
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
            id="upload-excel-district"
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

          <FileField
            id="upload-excel-file"
            label="Upload CSV"
            required
            accept=".csv"
            error={errors.excelFile?.message}
            {...register("excelFile")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
