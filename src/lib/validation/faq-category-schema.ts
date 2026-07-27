import { z } from "zod";

export const faqCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().trim(),
});

export type FaqCategoryFormValues = z.infer<typeof faqCategorySchema>;
