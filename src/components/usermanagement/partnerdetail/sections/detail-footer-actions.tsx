"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DetailFooterActions() {
  const router = useRouter();

  const handleCancel = () => router.push("/user-management");

  const handleSave = () => {
    toast.success("Changes saved");
    router.push("/user-management");
  };

  return (
    <div className="flex justify-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Button variant="secondary" onClick={handleCancel}>
        Cancel
      </Button>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
