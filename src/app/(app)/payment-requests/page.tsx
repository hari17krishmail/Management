import type { Metadata } from "next";
import { PaymentRequestsView } from "@/components/paymentrequests/payment-requests-view";

export const metadata: Metadata = {
  title: "Payment Requests | Educon",
};

export default function PaymentRequestsPage() {
  return <PaymentRequestsView />;
}
