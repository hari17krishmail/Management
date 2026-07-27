import { z } from "zod";
import { REJECTION_REASONS } from "@/components/filemanagement/types";

export const fileRejectSchema = z.object({
  reason: z.enum(REJECTION_REASONS, "Select a rejection reason"),
  remarks: z.string().trim().max(300, "Remarks must be 300 characters or fewer").optional(),
});

export type FileRejectFormValues = z.infer<typeof fileRejectSchema>;
