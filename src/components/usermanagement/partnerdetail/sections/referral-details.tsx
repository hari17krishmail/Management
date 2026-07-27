"use client";

import { useState } from "react";
import { Eye, Link2, Share2, UserCheck, Users } from "lucide-react";
import type { PartnerDetail } from "../../types";
import { Button } from "@/components/ui/button";
import { DetailCard } from "./detail-card";
import { DetailRow } from "./detail-row";
import { ReferralEarningModal } from "./referral-earning/referral-earning-modal";

export function ReferralDetails({ partner }: { partner: PartnerDetail }) {
  const [viewOpen, setViewOpen] = useState(false);
  const conversionPct =
    partner.totalReferrals === 0 ? 0 : Math.round((partner.converted / partner.totalReferrals) * 100);

  return (
    <DetailCard
      title="Referral Details"
      icon={Share2}
      action={
        <Button variant="secondary" size="sm" onClick={() => setViewOpen(true)} className="text-gray-600">
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      }
    >
      <div className="divide-y divide-gray-100">
        <DetailRow
          icon={Link2}
          label="Referral Code"
          value={<span className="text-blue-600">{partner.referralCode}</span>}
        />
        <DetailRow icon={Users} label="Total Referrals" value={partner.totalReferrals} />
        <DetailRow
          icon={UserCheck}
          label="Converted"
          value={`${partner.converted} (${conversionPct}%)`}
        />
        <DetailRow icon={Users} label="Referred By" value={partner.referredBy} />
      </div>

      <ReferralEarningModal open={viewOpen} onClose={() => setViewOpen(false)} partner={partner} />
    </DetailCard>
  );
}
