import type { Metadata } from "next";
import { CollegeManagementView } from "@/components/collegemanagement/college-management-view";

export const metadata: Metadata = {
  title: "Master Management | Educon",
};

export default function CollegeManagementPage() {
  return <CollegeManagementView />;
}
