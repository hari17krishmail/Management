export type ReferralEarningRecord = {
  id: string;
  partnerId: string;
  name: string;
  dateOfOnboarding: string;
  fileApprovedCount: number;
  commission: number;
  walletReceived: boolean;
};

export const REFERRAL_EARNING_RECORDS: ReferralEarningRecord[] = [
  {
    id: "1",
    partnerId: "PRT-1001",
    name: "Sarah Johnson",
    dateOfOnboarding: "2024-01-15",
    fileApprovedCount: 12,
    commission: 1200,
    walletReceived: true,
  },
  {
    id: "2",
    partnerId: "PRT-1002",
    name: "Michael Chen",
    dateOfOnboarding: "2024-02-03",
    fileApprovedCount: 8,
    commission: 800,
    walletReceived: false,
  },
  {
    id: "3",
    partnerId: "PRT-1003",
    name: "Priya Sharma",
    dateOfOnboarding: "2024-02-20",
    fileApprovedCount: 5,
    commission: 500,
    walletReceived: false,
  },
  {
    id: "4",
    partnerId: "PRT-1004",
    name: "James Williams",
    dateOfOnboarding: "2024-03-10",
    fileApprovedCount: 20,
    commission: 2000,
    walletReceived: true,
  },
  {
    id: "5",
    partnerId: "PRT-1005",
    name: "Emily Davis",
    dateOfOnboarding: "2024-03-25",
    fileApprovedCount: 3,
    commission: 300,
    walletReceived: false,
  },
  {
    id: "6",
    partnerId: "PRT-1006",
    name: "David Kim",
    dateOfOnboarding: "2024-04-02",
    fileApprovedCount: 15,
    commission: 1500,
    walletReceived: true,
  },
  {
    id: "7",
    partnerId: "PRT-1007",
    name: "Olivia Brown",
    dateOfOnboarding: "2024-04-14",
    fileApprovedCount: 7,
    commission: 700,
    walletReceived: false,
  },
  {
    id: "8",
    partnerId: "PRT-1008",
    name: "Daniel Lee",
    dateOfOnboarding: "2024-04-28",
    fileApprovedCount: 10,
    commission: 1000,
    walletReceived: true,
  },
  {
    id: "9",
    partnerId: "PRT-1009",
    name: "Sophia Martinez",
    dateOfOnboarding: "2024-05-06",
    fileApprovedCount: 4,
    commission: 400,
    walletReceived: false,
  },
  {
    id: "10",
    partnerId: "PRT-1010",
    name: "Ethan Wilson",
    dateOfOnboarding: "2024-05-19",
    fileApprovedCount: 18,
    commission: 1800,
    walletReceived: true,
  },
  {
    id: "11",
    partnerId: "PRT-1011",
    name: "Ava Thompson",
    dateOfOnboarding: "2024-06-01",
    fileApprovedCount: 6,
    commission: 600,
    walletReceived: false,
  },
  {
    id: "12",
    partnerId: "PRT-1012",
    name: "Noah Anderson",
    dateOfOnboarding: "2024-06-12",
    fileApprovedCount: 9,
    commission: 900,
    walletReceived: true,
  },
];
