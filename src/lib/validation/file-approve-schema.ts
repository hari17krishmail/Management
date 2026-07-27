import { z } from "zod";
import { PAYMENT_STATUS_OPTIONS } from "@/components/filemanagement/types";

export const fileApproveSchema = z.object({
  collegeName: z.string().trim().min(1, "College Name is required"),
  paymentStatus: z.enum(PAYMENT_STATUS_OPTIONS, "Payment Status is required"),
});

export type FileApproveFormValues = z.infer<typeof fileApproveSchema>;
