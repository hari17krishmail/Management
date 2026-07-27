import { z } from "zod";

export const ticketResolutionSchema = z.object({
  note: z.string().trim().min(1, "Enter a response before resolving this ticket."),
});

export type TicketResolutionFormValues = z.infer<typeof ticketResolutionSchema>;
