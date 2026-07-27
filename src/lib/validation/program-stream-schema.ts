import { z } from "zod";

export const programStreamSchema = z.object({
  name: z.string().trim().min(1, "Program / Stream Name is required"),
});

export type ProgramStreamFormValues = z.infer<typeof programStreamSchema>;
