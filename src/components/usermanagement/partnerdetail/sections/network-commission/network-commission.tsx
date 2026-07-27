"use client";

import { useState } from "react";
import { Eye, Landmark } from "lucide-react";
import type { PartnerDetail } from "../../../types";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { DetailCard } from "../detail-card";
import { StatTile } from "../stat-tile";
import { NetworkCommissionModal } from "./network-commission-modal";

export function NetworkCommission({ partner }: { partner: PartnerDetail }) {
  const { commission } = partner;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DetailCard
      title="Network Commission"
      icon={Landmark}
      action={
        <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)} className="text-gray-600">
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Total Partners" value={formatCurrency(commission.partnerCommission)} tone="green" />
        <StatTile label="Total Files" value={formatCurrency(commission.fileCommission)} tone="blue" />
      </div>
      <StatTile
        label="Commission earned"
        value={formatCurrency(commission.totalEarned)}
        tone="green"
        className="mt-3"
      />

      <NetworkCommissionModal open={modalOpen} onClose={() => setModalOpen(false)} partner={partner} />
    </DetailCard>
  );
}
