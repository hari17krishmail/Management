export type PaymentRequestStatus = "Pending" | "Hold" | "Approved" | "Partial" | "Rejected";

export type PaymentRequestRecord = {
  id: string;
  requestedAt: string;
  partnerName: string;
  partnerId: string;
  mobileNumber: string;
  walletBalance: number;
  minReqBalance: number;
  requestedAmount: number;
  availSettlement: number;
  status: PaymentRequestStatus;
  accountNumber: string;
  ifscCode: string;
  bankVerified: boolean;
  // Populated once the corresponding action modal has been submitted —
  // this feature has no backend yet, so these just record what the admin
  // entered for display/audit purposes in the local mock state.
  paymentDate?: string;
  partialAmount?: number;
  remainingBalance?: number;
  partialReason?: string;
  holdReason?: string;
  holdUntilDate?: string;
  internalNotes?: string;
  rejectionReason?: string;
  internalRemarks?: string;
};

export type PaymentRequestAction = "approve" | "partial" | "hold" | "reject";

export const HOLD_REASON_OPTIONS = [
  "Pending KYC Verification",
  "Suspicious Activity Detected",
  "Insufficient Wallet Balance",
  "Bank Details Mismatch",
  "Other",
] as const;
