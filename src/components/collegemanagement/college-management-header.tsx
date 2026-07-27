import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type CollegeManagementHeaderProps = {
  onAddProgramStream: () => void;
};

export function CollegeManagementHeader({ onAddProgramStream }: CollegeManagementHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Master Management</h1>
        <p className="text-sm text-gray-500">Manage and maintain college records across all programs and streams.</p>
      </div>
      <Button onClick={onAddProgramStream}>
        <Plus className="h-4 w-4" />
        Add Program / Stream
      </Button>
    </div>
  );
}
