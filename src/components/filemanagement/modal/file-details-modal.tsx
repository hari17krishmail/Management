"use client";

import { useEffect } from "react";
import { X, User, Compass, Landmark, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FileRecord } from "../types";
import { Button } from "@/components/ui/button";
import { FileStatusBadge } from "../file-status-badge";

type FileDetailsModalProps = {
  record: FileRecord;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onFinalClosure: () => void;
};

function SectionHeading({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </h3>
  );
}

function Field({ label, value, first, last }: { label: string; value: string; first?: boolean; last?: boolean }) {
  return (
    <div className={first ? "pb-3" : last ? "pt-3" : "py-3"}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export function FileDetailsModal({ record, onClose, onApprove, onReject, onFinalClosure }: FileDetailsModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const initial = record.studentName.charAt(0).toUpperCase();
  const showPendingActions = record.stage === "approve" && record.status === "Pending";
  const showFinalActions = record.stage === "final";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-details-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {initial}
            </span>
            <div>
              <h2 id="file-details-title" className="text-base font-semibold">
                {record.studentName}
              </h2>
              <p className="mt-0.5 text-xs text-blue-100">
                Lead ID: {record.id} <span className="mx-1">•</span> Partner ID: {record.partnerId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileStatusBadge status={record.status} />
            <Button variant="header" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto px-6 py-5 sm:grid-cols-2">
          <div>
            <SectionHeading icon={User} label="Personal Information" />
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
              <Field label="Student Name" value={record.studentName} first />
              <Field label="12th Exam Reg. No." value={record.regNo} />
              <Field label="Student Mobile" value={record.studentMobile} />
              <Field label="Passed Out Year" value={record.passedOutYear} />
              <Field label="District" value={record.district} last />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <SectionHeading icon={Compass} label="Looking For" />
              <div className="rounded-xl border border-gray-200 p-4">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {record.lookingFor}
                </span>
              </div>
            </div>

            <div>
              <SectionHeading icon={Landmark} label="College Preferences" />
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
                {record.collegePreferences.map((preference) => (
                  <div key={preference.rank} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700">
                      {preference.rank}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{preference.name}</p>
                      <p className="text-xs text-gray-500">{preference.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading icon={ClipboardCheck} label="Submission Details" />
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 p-4">
                <Field label="Submitted Date & Time" value={record.submittedAt} first />
                <Field label="Submitted By (Partner)" value={record.submittedBy} />
                <Field label="Partner ID" value={record.partnerId} last />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {showPendingActions && (
            <>
              <Button variant="destructive" onClick={onReject}>
                Reject Lead
              </Button>
              <Button onClick={onApprove}>Approve Lead</Button>
            </>
          )}
          {showFinalActions && (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onFinalClosure}>Final Closure</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
