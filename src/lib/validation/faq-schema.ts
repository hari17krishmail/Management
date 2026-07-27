import { z } from "zod";

export const faqSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
