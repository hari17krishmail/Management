import { z } from "zod";

export const paymentRejectSchema = z.object({
  rejectionReason: z.string().trim().min(1, "Rejection reason is required"),
  internalRemarks: z.string().trim().max(500, "Remarks must be 500 characters or fewer").optional(),
});

export type PaymentRejectFormValues = z.infer<typeof paymentRejectSchema>;
