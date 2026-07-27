import { z } from "zod";

export const paymentApproveSchema = z.object({
  paymentDate: z.string().trim().min(1, "Select a payment date"),
});

export type PaymentApproveFormValues = z.infer<typeof paymentApproveSchema>;
