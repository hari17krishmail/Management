import { z } from "zod";

// Factory rather than a static schema: the upper bound depends on the
// specific request's total amount, which isn't known until the modal opens.
export function createPaymentPartialApprovalSchema(totalRequested: number) {
  return z.object({
    partialAmount: z
      .number({ error: "Enter the partial amount" })
      .positive("Partial amount must be greater than 0")
      .lt(totalRequested, "Partial amount must be less than the total requested amount"),
    reason: z.string().trim().max(500, "Reason must be 500 characters or fewer").optional(),
  });
}

export type PaymentPartialApprovalFormValues = z.infer<ReturnType<typeof createPaymentPartialApprovalSchema>>;
