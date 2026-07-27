"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, X } from "lucide-react";
import { toast } from "sonner";
import { useUploadCourseDetailsMutation } from "@/services/college/collegeApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/components/ui/button";
import { ReadOnlyField } from "@/components/ui/form/read-only-field";
import { FileField } from "@/components/ui/form/file-field";
import {
  collegePdfUploadSchema,
  type CollegePdfUploadFormValues,
} from "@/lib/validation/college-pdf-upload-schema";

type CollegePdfUploadModalProps = {
  collegeDetailsCode: string;
  programStreamName: string;
  district: string;
  collegeName: string;
  onSave: () => void;
  onCancel: () => void;
};

export function CollegePdfUploadModal({
  collegeDetailsCode,
  programStreamName,
  district,
  collegeName,
  onSave,
  onCancel,
}: CollegePdfUploadModalProps) {
  const [uploadCourseDetails, { isLoading: isUploading }] = useUploadCourseDetailsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CollegePdfUploadFormValues>({
    resolver: zodResolver(collegePdfUploadSchema),
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: CollegePdfUploadFormValues) => {
    try {
      const response = await uploadCourseDetails({
        collegeDetailsCode,
        file: values.pdfFile[0],
      }).unwrap();
      toast.success(response.responseObj.responseMessage);
      onSave();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not upload this PDF. Please try again."));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="college-pdf-upload-title"
        className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <FileUp className="h-5 w-5" />
            </span>
            <div>
              <h2 id="college-pdf-upload-title" className="text-base font-semibold">
                Upload PDF
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Attach the course details PDF for this college</p>
            </div>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 border-t border-gray-100 px-6 py-5">
          <ReadOnlyField id="college-pdf-program-stream" label="Program / Stream" value={programStreamName} />
          <ReadOnlyField id="college-pdf-district" label="District" value={district} />
          <ReadOnlyField id="college-pdf-name" label="College Name" value={collegeName} />

          <FileField
            id="college-pdf-file"
            label="PDF Upload"
            required
            accept="application/pdf"
            error={errors.pdfFile?.message}
            {...register("pdfFile")}
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
