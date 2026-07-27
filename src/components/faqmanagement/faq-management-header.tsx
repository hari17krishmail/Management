import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type FaqManagementHeaderProps = {
  onAddCategory: () => void;
};

export function FaqManagementHeader({ onAddCategory }: FaqManagementHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">FAQ Management</h1>
        <p className="text-sm text-gray-500">Manage common questions and answers for the Help Center.</p>
      </div>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4" />
        Add FAQ Category
      </Button>
    </div>
  );
}
