import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type SupportTicketHeaderProps = {
  onAddCategory: () => void;
};

export function SupportTicketHeader({ onAddCategory }: SupportTicketHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-500">View and track support requests raised by partners.</p>
      </div>
      <Button onClick={onAddCategory}>
        <Plus className="h-4 w-4" />
        Add Category
      </Button>
    </div>
  );
}
