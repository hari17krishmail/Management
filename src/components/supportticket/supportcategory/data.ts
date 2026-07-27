import type { SupportCategory } from "./types";

export const INITIAL_SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "account",
    name: "Account",
    description: "Login issues, account locks, and profile updates.",
    priority: "Medium",
  },
  {
    id: "payments",
    name: "Payments",
    description: "Withdrawals, commission payouts, and billing questions.",
    priority: "High",
  },
  {
    id: "technical",
    name: "Technical",
    description: "App bugs, upload failures, and other technical issues.",
    priority: "High",
  },
  {
    id: "general",
    name: "General",
    description: "General questions that don't fit other categories.",
    priority: "Low",
  },
];
