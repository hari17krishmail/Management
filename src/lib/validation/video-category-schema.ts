import { z } from "zod";

export const videoCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
  description: z.string().trim(),
});

export type VideoCategoryFormValues = z.infer<typeof videoCategorySchema>;
