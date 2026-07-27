import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type VideoManagementHeaderProps = {
  onOpenCategories: () => void;
};

export function VideoManagementHeader({ onOpenCategories }: VideoManagementHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">How-To Videos</h1>
        <p className="text-sm text-gray-500">Manage instructional videos for your users.</p>
      </div>
      <Button onClick={onOpenCategories}>
        <Plus className="h-4 w-4" />
        Add Video Category
      </Button>
    </div>
  );
}
