"use client";

import { useState } from "react";
import { CalendarDays, Mail, Pencil, Phone, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import type { PartnerDetail } from "../../types";
import { StatusBadge } from "../../status-badge";
import { Button } from "@/components/ui/button";
import { DetailCard } from "./detail-card";
import { DetailRow } from "./detail-row";
import {
  PersonalInformationEditModal,
  type PersonalInformationValues,
} from "./personal-information-edit-modal";

export function PersonalInformation({ partner }: { partner: PartnerDetail }) {
  const [info, setInfo] = useState<PersonalInformationValues>({
    name: partner.name,
    email: partner.email,
    mobile: partner.mobile,
    status: partner.status,
  });
  const [editOpen, setEditOpen] = useState(false);

  const handleSave = (values: PersonalInformationValues) => {
    setInfo(values);
    setEditOpen(false);
    toast.success("Personal information updated");
  };

  return (
    <DetailCard
      title="Personal Information"
      icon={UserRound}
      action={
        <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)} className="text-gray-600">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      }
    >
      <div className="divide-y divide-gray-100">
        <DetailRow icon={UserRound} label="Full Name" value={info.name} />
        <DetailRow icon={Mail} label="Email" value={info.email} />
        <DetailRow icon={Phone} label="Phone" value={info.mobile} />
        <DetailRow icon={ShieldCheck} label="Account Status" value={<StatusBadge status={info.status} />} />
        <DetailRow icon={CalendarDays} label="Registered Date" value={partner.registeredDate} />
      </div>

      {editOpen && (
        <PersonalInformationEditModal
          values={info}
          registeredDate={partner.registeredDate}
          onSave={handleSave}
          onCancel={() => setEditOpen(false)}
        />
      )}
    </DetailCard>
  );
}
