import { WalletMinimal } from "lucide-react";
import type { PartnerDetail } from "../../types";
import { formatCurrency } from "@/lib/format";
import { DetailCard } from "./detail-card";
import { DetailRow } from "./detail-row";
import { StatTile } from "./stat-tile";

export function WalletInformation({ partner }: { partner: PartnerDetail }) {
  const { wallet } = partner;

  return (
    <DetailCard title="Wallet Information" icon={WalletMinimal}>
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Available Balance" value={formatCurrency(wallet.availableBalance)} tone="green" />
        <StatTile label="Total Earned" value={formatCurrency(wallet.totalEarned)} tone="blue" />
      </div>
      <div className="mt-1 divide-y divide-gray-100">
        <DetailRow label="Withdrawn" value={formatCurrency(wallet.withdrawn)} />
        <DetailRow
          label="Pending Payout"
          value={<span className="text-amber-600">{formatCurrency(wallet.pendingPayout)}</span>}
        />
      </div>
    </DetailCard>
  );
}
