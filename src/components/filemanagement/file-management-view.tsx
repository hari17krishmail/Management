"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { INITIAL_FILE_RECORDS } from "./data";
import type { FileFilterField, FileFilters, FileRecord, FileStage } from "./types";
import { FileManagementHeader } from "./file-management-header";
import { FileStageTabs } from "./file-stage-tabs";
import { FileToolbar } from "./file-toolbar";
import { FileTable } from "./file-table";
import { FileDetailsModal } from "./modal/file-details-modal";
import { FileApproveModal } from "./modal/file-approve-modal";
import { FileAdmissionClosureModal } from "./modal/file-admission-closure-modal";
import { FileRejectModal } from "./modal/file-reject-modal";
import type { FileApproveFormValues } from "@/lib/validation/file-approve-schema";
import type { FileAdmissionClosureFormValues } from "@/lib/validation/file-admission-closure-schema";
import type { FileRejectFormValues } from "@/lib/validation/file-reject-schema";

const DEFAULT_FILTERS: FileFilters = { fileId: "All", mobile: "All", partnerId: "All" };
const EMPTY_STAGE_COUNTS: Record<FileStage, number> = { approve: 0, reject: 0, final: 0, closed: 0 };

type ModalState =
  | { type: "view"; record: FileRecord }
  | { type: "approve"; record: FileRecord }
  | { type: "finalClosure"; record: FileRecord }
  | { type: "reject"; record: FileRecord }
  | null;

function matchesSearch(record: FileRecord, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [record.id, record.studentName, record.partnerId, record.studentMobile].some((field) =>
    field.toLowerCase().includes(normalized),
  );
}

export function FileManagementView() {
  const [records, setRecords] = useState<FileRecord[]>(INITIAL_FILE_RECORDS);
  const [activeStage, setActiveStage] = useState<FileStage>("approve");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FileFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(null);

  const stageCounts = useMemo(
    () =>
      records.reduce(
        (acc, record) => {
          acc[record.stage] += 1;
          return acc;
        },
        { ...EMPTY_STAGE_COUNTS },
      ),
    [records],
  );

  const stageRecords = useMemo(() => records.filter((record) => record.stage === activeStage), [records, activeStage]);

  const filterOptions = useMemo(
    () => ({
      fileId: Array.from(new Set(stageRecords.map((record) => record.id))),
      mobile: Array.from(new Set(stageRecords.map((record) => record.studentMobile))),
      partnerId: Array.from(new Set(stageRecords.map((record) => record.partnerId))),
    }),
    [stageRecords],
  );

  const filtered = useMemo(
    () =>
      stageRecords.filter((record) => {
        if (filters.fileId !== "All" && record.id !== filters.fileId) return false;
        if (filters.mobile !== "All" && record.studentMobile !== filters.mobile) return false;
        if (filters.partnerId !== "All" && record.partnerId !== filters.partnerId) return false;
        return matchesSearch(record, search);
      }),
    [stageRecords, filters, search],
  );

  const handleStageChange = (stage: FileStage) => {
    setActiveStage(stage);
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const handleFilterChange = (field: FileFilterField, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const updateRecord = (id: string, changes: Partial<FileRecord>) => {
    setRecords((prev) => prev.map((record) => (record.id === id ? { ...record, ...changes } : record)));
  };

  const handleApprove = (values: FileApproveFormValues) => {
    if (modal?.type !== "approve") return;
    updateRecord(modal.record.id, {
      status: "Approved",
      stage: "final",
      approvedCollege: values.collegeName,
      paymentStatus: values.paymentStatus,
    });
    toast.success(`${modal.record.studentName}'s file was approved`);
    setModal(null);
  };

  const handleReject = (values: FileRejectFormValues) => {
    if (modal?.type !== "reject") return;
    updateRecord(modal.record.id, {
      status: "Rejected",
      stage: "reject",
      rejectionReason: values.reason,
      rejectionRemarks: values.remarks,
    });
    toast.success(`${modal.record.studentName}'s lead was rejected`);
    setModal(null);
  };

  const handleFinalClosure = (values: FileAdmissionClosureFormValues) => {
    if (modal?.type !== "finalClosure") return;
    updateRecord(modal.record.id, {
      paymentStatus: "Final Amount",
      stage: "closed",
      finalStatus: values.finalStatus,
      admissionValue: values.admissionValue,
      remarks: values.remarks,
    });
    toast.success(`${modal.record.studentName}'s admission was closed`);
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <FileManagementHeader />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <FileStageTabs activeStage={activeStage} onStageChange={handleStageChange} counts={stageCounts} />

        <FileToolbar
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          options={filterOptions}
        />

        <FileTable
          key={`${activeStage}::${search}::${filters.fileId}::${filters.mobile}::${filters.partnerId}`}
          data={filtered}
          onView={(record) => setModal({ type: "view", record })}
        />
      </div>

      {modal?.type === "view" && (
        <FileDetailsModal
          record={modal.record}
          onClose={() => setModal(null)}
          onApprove={() => setModal({ type: "approve", record: modal.record })}
          onReject={() => setModal({ type: "reject", record: modal.record })}
          onFinalClosure={() => setModal({ type: "finalClosure", record: modal.record })}
        />
      )}

      {modal?.type === "approve" && <FileApproveModal onSave={handleApprove} onCancel={() => setModal(null)} />}

      {modal?.type === "reject" && (
        <FileRejectModal record={modal.record} onSave={handleReject} onCancel={() => setModal(null)} />
      )}

      {modal?.type === "finalClosure" && (
        <FileAdmissionClosureModal onSave={handleFinalClosure} onCancel={() => setModal(null)} />
      )}
    </div>
  );
}
