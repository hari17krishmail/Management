import { z } from "zod";
import { FINAL_STATUS_OPTIONS } from "@/components/filemanagement/types";

export const fileAdmissionClosureSchema = z.object({
  finalStatus: z.enum(FINAL_STATUS_OPTIONS, "Final Status is required"),
  admissionValue: z.number({ error: "Enter the admission value" }).min(0, "Admission value can't be negative"),
  remarks: z.string().trim().max(500, "Remarks must be 500 characters or fewer").optional(),
});

export type FileAdmissionClosureFormValues = z.infer<typeof fileAdmissionClosureSchema>;
