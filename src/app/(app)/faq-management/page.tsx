import type { Metadata } from "next";
import { FaqManagementView } from "@/components/faqmanagement/faq-management-view";

export const metadata: Metadata = {
  title: "FAQ Management | Educon",
};

export default function FaqManagementPage() {
  return <FaqManagementView />;
}
