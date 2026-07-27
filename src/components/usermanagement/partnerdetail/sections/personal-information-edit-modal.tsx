"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/text-field";
import { ReadOnlyField } from "@/components/ui/form/read-only-field";
import {
  personalInformationSchema,
  type PersonalInformationFormValues,
} from "@/lib/validation/personal-information-schema";

export type PersonalInformationValues = PersonalInformationFormValues;

type PersonalInformationEditModalProps = {
  values: PersonalInformationValues;
  registeredDate: string;
  onSave: (values: PersonalInformationValues) => void;
  onCancel: () => void;
};

// Mounted only while the modal is open (see PersonalInformation), so the form
// naturally starts fresh from `values` every time it opens — no reset effect needed.
export function PersonalInformationEditModal({
  values,
  registeredDate,
  onSave,
  onCancel,
}: PersonalInformationEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInformationValues>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: values,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="personal-information-edit-title"
        className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <h2 id="personal-information-edit-title" className="text-base font-semibold">
            Edit Personal Information
          </h2>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-4 p-6">
          <ReadOnlyField id="edit-name" label="Full Name" value={values.name} />

          <TextField
            id="edit-email"
            label="Email"
            type="email"
            required
            error={errors.email?.message}
            {...register("email")}
          />

          <TextField
            id="edit-phone"
            label="Phone"
            type="tel"
            required
            error={errors.mobile?.message}
            {...register("mobile")}
          />

          <ReadOnlyField id="edit-status" label="Account Status" value={values.status} />

          <ReadOnlyField id="edit-registered" label="Registered Date" value={registeredDate} />

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
