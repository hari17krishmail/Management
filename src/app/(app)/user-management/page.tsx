import type { Metadata } from "next";
import { UserManagementDashboard } from "@/components/dashboard/user-management-dashboard";
import { PartnerList } from "@/components/usermanagement/partnerlist/partner-list";

export const metadata: Metadata = {
  title: "User Management | Educon",
};

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <UserManagementDashboard />
      <PartnerList />
    </div>
  );
}
