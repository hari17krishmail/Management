import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartnerById } from "@/components/usermanagement/data";
import { PartnerDetailView } from "@/components/usermanagement/partnerdetail/partner-detail-view";

export async function generateMetadata(
  props: PageProps<"/user-management/[partnerId]">,
): Promise<Metadata> {
  const { partnerId } = await props.params;
  const partner = getPartnerById(partnerId);

  return {
    title: partner ? `${partner.name} | Educon` : "Partner Not Found | Educon",
  };
}

export default async function PartnerDetailPage(props: PageProps<"/user-management/[partnerId]">) {
  const { partnerId } = await props.params;
  const partner = getPartnerById(partnerId);

  if (!partner) {
    notFound();
  }

  return <PartnerDetailView partner={partner} />;
}
