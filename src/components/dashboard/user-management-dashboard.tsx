import { Ban, UserCheck, UserCog, Users } from "lucide-react";
import { StatCard } from "./stat-card";

const STATS = [
  {
    label: "Total Partners",
    value: "112",
    icon: Users,
    iconClassName: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Users",
    value: "95",
    icon: UserCheck,
    iconClassName: "bg-green-50 text-green-600",
  },
  {
    label: "Locked Users",
    value: "17",
    icon: Ban,
    iconClassName: "bg-red-50 text-red-600",
  },
  {
    label: "Renewal Users",
    value: "0",
    icon: UserCog,
    iconClassName: "bg-amber-50 text-amber-600",
  },
];

export function UserManagementDashboard() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
