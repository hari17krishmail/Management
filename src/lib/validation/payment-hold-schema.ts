import { z } from "zod";
import { HOLD_REASON_OPTIONS } from "@/components/paymentrequests/types";

export const paymentHoldSchema = z.object({
  holdReason: z.enum(HOLD_REASON_OPTIONS, "Select a hold reason"),
  holdUntilDate: z.string().trim().min(1, "Select a hold-until date"),
  internalNotes: z.string().trim().max(500, "Notes must be 500 characters or fewer").optional(),
});

export type PaymentHoldFormValues = z.infer<typeof paymentHoldSchema>;
