"use client";

import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, MoreVertical, PauseCircle, PieChart, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-click-outside";
import type { PaymentRequestAction } from "./types";

type PaymentRequestActionMenuProps = {
  onAction: (action: PaymentRequestAction) => void;
};

const ACTIONS: { key: PaymentRequestAction; label: string; icon: LucideIcon; className: string }[] = [
  { key: "approve", label: "Approve Fully", icon: CheckCircle2, className: "text-green-600" },
  { key: "partial", label: "Partial Approval", icon: PieChart, className: "text-gray-700" },
  { key: "hold", label: "Hold Request", icon: PauseCircle, className: "text-amber-600" },
  { key: "reject", label: "Reject Request", icon: XCircle, className: "text-red-600" },
];

export function PaymentRequestActionMenu({ onAction }: PaymentRequestActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Actions"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
          {ACTIONS.map(({ key, label, icon: Icon, className }) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                onAction(key);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm font-medium transition-colors hover:bg-gray-50 ${className}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
