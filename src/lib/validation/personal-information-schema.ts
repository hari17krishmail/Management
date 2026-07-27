import { z } from "zod";
import type { PartnerStatus } from "@/components/usermanagement/types";

// `name` and `status` are shown as disabled/read-only fields in the edit modal —
// they pass through unchanged, so they're typed but not validated here.
export const personalInformationSchema = z.object({
  name: z.string(),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  mobile: z.string().trim().min(1, "Phone is required"),
  status: z.custom<PartnerStatus>(),
});

export type PersonalInformationFormValues = z.infer<typeof personalInformationSchema>;
