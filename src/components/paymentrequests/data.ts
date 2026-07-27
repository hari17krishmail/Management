import type { PaymentRequestRecord } from "./types";

const PARTNER_NAMES = [
  "Hari Sudhan",
  "Arun Kumar",
  "Priya Singh",
  "Kavitha Rajan",
  "Suresh Babu",
  "Divya Nair",
  "Manoj Pillai",
  "Anjali Gupta",
];

const DATE_TIMES = [
  "15 Nov, 10:30 AM",
  "14 Nov, 18:45 PM",
  "14 Nov, 16:20 PM",
  "13 Nov, 11:05 AM",
  "13 Nov, 09:40 AM",
  "12 Nov, 17:15 PM",
];

const STATUS_CYCLE: PaymentRequestRecord["status"][] = ["Pending", "Hold", "Pending", "Pending", "Approved", "Rejected"];

function buildRecord(index: number): PaymentRequestRecord {
  const walletBalance = 5000 + (index % 6) * 4000;
  const requestedAmount = 6000 + (index % 5) * 3500;
  return {
    id: `REQ-${99120 + index}`,
    requestedAt: DATE_TIMES[index % DATE_TIMES.length],
    partnerName: PARTNER_NAMES[index % PARTNER_NAMES.length],
    partnerId: `BIZ-${4492 + index}`,
    mobileNumber: `+91 ${9800000000 + index * 137}`,
    walletBalance,
    minReqBalance: 1000,
    requestedAmount,
    availSettlement: walletBalance + Math.round(requestedAmount * 0.15),
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    accountNumber: `XXXX XXXX ${4589 + index}`,
    ifscCode: "HDFC0001234",
    bankVerified: index % 4 !== 0,
  };
}

export const INITIAL_PAYMENT_REQUESTS: PaymentRequestRecord[] = Array.from({ length: 26 }, (_, index) =>
  buildRecord(index),
);
