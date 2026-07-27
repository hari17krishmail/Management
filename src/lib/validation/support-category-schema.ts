import { z } from "zod";

export const SUPPORT_CATEGORY_PRIORITIES = ["Low", "Medium", "High"] as const;

export const supportCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().trim(),
  priority: z.string().min(1, "Priority is required"),
});

export type SupportCategoryFormValues = z.infer<typeof supportCategorySchema>;
