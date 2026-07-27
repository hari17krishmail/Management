import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileManagementHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">File Management</h1>
        <p className="text-sm text-gray-500">Manage and track all files across workflow stages.</p>
      </div>
      <Button variant="dark">
        <Download className="h-4 w-4" />
        Export All
      </Button>
    </div>
  );
}
