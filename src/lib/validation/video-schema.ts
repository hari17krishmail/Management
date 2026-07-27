import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().trim().min(1, "Video title is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().trim().min(1, "Description is required."),
  videoUrl: z.string().trim().min(1, "Video URL is required").url("Enter a valid URL"),
});

export type VideoFormValues = z.infer<typeof videoSchema>;
