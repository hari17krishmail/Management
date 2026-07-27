"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { toast } from "sonner";
import type { PartnerStatus } from "../../types";
import { Button } from "@/components/ui/button";

export function LockToggleButton({ initialStatus }: { initialStatus: PartnerStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const isLocked = status === "Locked";

  const handleClick = () => {
    const next: PartnerStatus = isLocked ? "Active" : "Locked";
    setStatus(next);
    toast.success(next === "Locked" ? "Partner locked" : "Partner unlocked");
  };

  return (
    <Button variant="secondary" onClick={handleClick}>
      {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      {isLocked ? "Unlock" : "Lock"}
    </Button>
  );
}
