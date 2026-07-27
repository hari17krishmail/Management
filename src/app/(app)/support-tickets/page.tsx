import type { Metadata } from "next";
import { SupportTicketView } from "@/components/supportticket/support-ticket-view";

export const metadata: Metadata = {
  title: "Support Tickets | Educon",
};

export default function SupportTicketsPage() {
  return <SupportTicketView />;
}
