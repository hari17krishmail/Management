export type PartnerStatus = "Active" | "Locked";

export type Partner = {
  id: string;
  name: string;
  mobile: string;
  referralId: string;
  registeredDate: string;
  status: PartnerStatus;
  fraudScore: number;
};

export type PartnerDetail = Partner & {
  email: string;
  referralCode: string;
  totalReferrals: number;
  converted: number;
  referredBy: string;
  commission: {
    partnerCommission: number;
    fileCommission: number;
    totalEarned: number;
  };
  wallet: {
    availableBalance: number;
    totalEarned: number;
    withdrawn: number;
    pendingPayout: number;
  };
  filePerformance: {
    totalFiles: number;
    networkCommission: number;
    referralEarnings: number;
    fileEarnings: number;
    approvedFiles: number;
    rejectedFiles: number;
    conversionRate: number;
  };
};
