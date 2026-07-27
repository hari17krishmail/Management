export type FileStage = "approve" | "reject" | "final" | "closed";

export const PAYMENT_STATUS_OPTIONS = ["Advance", "Final Amount", "Balance Pending"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUS_OPTIONS)[number];

export type FileApprovalStatus = "Pending" | "Approved" | "Rejected";

export const FINAL_STATUS_OPTIONS = ["Admission Completed", "Admission Cancelled", "Waiting"] as const;
export type FinalAdmissionStatus = (typeof FINAL_STATUS_OPTIONS)[number];

export const REJECTION_REASONS = [
  "Invalid Details",
  "Duplicate Lead",
  "Fake Lead",
  "Student Not Interested",
  "Admission Cancelled",
  "Wrong Information",
  "Other",
] as const;
export type RejectionReason = (typeof REJECTION_REASONS)[number];

// Mock master list for the Approve File modal's College Name dropdown — this
// feature has no backend yet, so it isn't wired to the real Master
// Management college API.
export const COLLEGE_NAME_OPTIONS = [
  "Anna University",
  "SRM Institute of Science & Technology",
  "VIT University",
  "Madurai Medical College",
  "PSG College of Arts & Science",
  "Coimbatore Institute of Technology",
  "Loyola College",
  "Bharathiar University",
] as const;

export type CollegePreference = {
  rank: number;
  name: string;
  location: string;
};

export type FileRecord = {
  id: string;
  partnerId: string;
  studentName: string;
  studentMobile: string;
  regNo: string;
  passedOutYear: string;
  district: string;
  lookingFor: string;
  collegePreferences: CollegePreference[];
  submittedDate: string;
  submittedAt: string;
  submittedBy: string;
  paymentStatus: PaymentStatus;
  status: FileApprovalStatus;
  stage: FileStage;
  approvedCollege?: string;
  finalStatus?: FinalAdmissionStatus;
  admissionValue?: number;
  remarks?: string;
  rejectionReason?: RejectionReason;
  rejectionRemarks?: string;
};

export type FileStageTab = {
  key: FileStage;
  label: string;
};

export const FILE_STAGE_TABS: FileStageTab[] = [
  { key: "approve", label: "Approve File" },
  { key: "reject", label: "Reject File" },
  { key: "final", label: "Final File" },
  { key: "closed", label: "Admission Closed" },
];

export type FileFilterField = "fileId" | "mobile" | "partnerId";

export type FileFilters = Record<FileFilterField, string>;
