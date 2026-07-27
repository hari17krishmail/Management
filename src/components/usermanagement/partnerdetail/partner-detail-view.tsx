import type { PartnerDetail } from "../types";
import { PartnerDetailHeader } from "./sections/partner-detail-header";
import { PersonalInformation } from "./sections/personal-information";
import { ReferralDetails } from "./sections/referral-details";
import { NetworkCommission } from "./sections/network-commission/network-commission";
import { WalletInformation } from "./sections/wallet-information";
import { FilePerformance } from "./sections/file-performance";
import { DetailFooterActions } from "./sections/detail-footer-actions";

export function PartnerDetailView({ partner }: { partner: PartnerDetail }) {
  return (
    <div className="space-y-6">
      <PartnerDetailHeader partner={partner} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PersonalInformation partner={partner} />
        <ReferralDetails partner={partner} />
        <NetworkCommission partner={partner} />
        <WalletInformation partner={partner} />
      </div>

      <FilePerformance partner={partner} />

      <DetailFooterActions />
    </div>
  );
}
