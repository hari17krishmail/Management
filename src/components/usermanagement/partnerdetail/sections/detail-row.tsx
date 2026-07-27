import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DetailRowProps = {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
};

export function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <span className="flex items-center gap-2 text-gray-500">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {label}
      </span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
