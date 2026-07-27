"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useListProgramStreamsQuery,
  useLazyGetProgramStreamQuery,
  useDeleteProgramStreamMutation,
  type ProgramStreamRecord,
} from "@/services/programstream/programStreamApi";
import { useListDistrictsQuery } from "@/services/district/districtApi";
import { useDeleteCollegeDetailsMutation, type CollegeDetailListRecord } from "@/services/college/collegeApi";
import type { District, ProgramStream } from "./types";
import { CollegeManagementHeader } from "./college-management-header";
import { CollegeToolbar } from "./college-toolbar";
import { CollegeTable } from "./college-table";
import { CollegeUploadExcelModal } from "./college-upload-excel-modal";
import { CollegeFormModal } from "./college-form-modal";
import { CollegePdfUploadModal } from "./college-pdf-upload-modal";
import { ProgramStreamListModal } from "./program-stream-list-modal";
import { ProgramStreamFormModal } from "./program-stream-form-modal";

// Large enough to cover the program/stream (or district) list in one request
// for the filter dropdowns and college form's selectors — see
// ticket-toolbar.tsx's CATEGORY_OPTIONS_PAGE_SIZE for the same pattern.
const PROGRAM_STREAM_OPTIONS_PAGE_SIZE = 100;
const DISTRICT_OPTIONS_PAGE_SIZE = 100;

type ProgramStreamFormModalState =
  | { mode: "add" }
  | { mode: "edit"; streamCode: string; streamName: string }
  | null;

export function CollegeManagementView() {
  const { data: programStreamData } = useListProgramStreamsQuery({
    pageNumber: 1,
    pageSize: PROGRAM_STREAM_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const programStreams: ProgramStream[] = useMemo(
    () =>
      (programStreamData?.responseObj.responseDataParams.data.records ?? []).map((record) => ({
        id: record.code,
        name: record.streamName,
      })),
    [programStreamData],
  );

  const { data: districtData } = useListDistrictsQuery({
    pageNumber: 1,
    pageSize: DISTRICT_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const districts: District[] = useMemo(
    () =>
      (districtData?.responseObj.responseDataParams.data.records ?? []).map((record) => ({
        id: record.code,
        name: record.districtName,
      })),
    [districtData],
  );

  const [triggerGetProgramStream] = useLazyGetProgramStreamQuery();
  const [deleteProgramStream, { isLoading: isDeletingProgramStream }] = useDeleteProgramStreamMutation();

  const [search, setSearch] = useState("");
  const [programStreamFilter, setProgramStreamFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");

  const [listOpen, setListOpen] = useState(false);
  const [formModal, setFormModal] = useState<ProgramStreamFormModalState>(null);
  const [pendingDelete, setPendingDelete] = useState<ProgramStreamRecord | null>(null);

  const [uploadExcelOpen, setUploadExcelOpen] = useState(false);
  const [collegeFormOpen, setCollegeFormOpen] = useState(false);
  const [collegeRefreshKey, setCollegeRefreshKey] = useState(0);
  const [pdfUploadTarget, setPdfUploadTarget] = useState<CollegeDetailListRecord | null>(null);
  const [editTarget, setEditTarget] = useState<CollegeDetailListRecord | null>(null);
  const [pendingDeleteCollege, setPendingDeleteCollege] = useState<CollegeDetailListRecord | null>(null);
  const [deleteCollegeDetails, { isLoading: isDeletingCollege }] = useDeleteCollegeDetailsMutation();

  const handleSaveProgramStream = () => {
    // Success toast for both add and edit already shown by
    // ProgramStreamFormModal using the backend's `responseMessage`. The
    // Program / Stream list and the college toolbar/form's dropdowns all
    // refetch on their own via RTK Query's cache tag invalidation.
    setFormModal(null);
  };

  const handleEditProgramStream = async (record: ProgramStreamRecord) => {
    try {
      const response = await triggerGetProgramStream(record.code).unwrap();
      const programStream = response.responseObj.responseDataParams.data.record;
      setFormModal({ mode: "edit", streamCode: programStream.code, streamName: programStream.streamName });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this program / stream. Please try again."));
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      const response = await deleteProgramStream(pendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this program / stream. Please try again."));
    } finally {
      setPendingDelete(null);
    }
  };

  // A newly created/uploaded college can silently fall outside the currently
  // active search/filter/page — reset to an unfiltered page 1 so it's
  // guaranteed to be visible instead of looking like the action "didn't work."
  const resetCollegeView = () => {
    setSearch("");
    setProgramStreamFilter("all");
    setDistrictFilter("all");
    setCollegeRefreshKey((key) => key + 1);
  };

  const handleSaveCollege = () => {
    setCollegeFormOpen(false);
    resetCollegeView();
  };

  const handleUploadExcelDone = () => {
    setUploadExcelOpen(false);
    resetCollegeView();
  };

  const handleConfirmDeleteCollege = async () => {
    if (!pendingDeleteCollege) return;
    try {
      const response = await deleteCollegeDetails(pendingDeleteCollege.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this college. Please try again."));
    } finally {
      setPendingDeleteCollege(null);
    }
  };

  return (
    <div className="space-y-6">
      <CollegeManagementHeader onAddProgramStream={() => setListOpen(true)} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <CollegeToolbar
          search={search}
          onSearchChange={setSearch}
          programStreamFilter={programStreamFilter}
          onProgramStreamFilterChange={setProgramStreamFilter}
          programStreams={programStreams}
          districtFilter={districtFilter}
          onDistrictFilterChange={setDistrictFilter}
          districts={districts}
          onUploadExcel={() => setUploadExcelOpen(true)}
          onAddCollege={() => setCollegeFormOpen(true)}
        />

        <CollegeTable
          key={`${programStreamFilter}::${districtFilter}::${collegeRefreshKey}`}
          search={search}
          streamCode={programStreamFilter}
          districtCode={districtFilter}
          onUploadPdf={(record) => setPdfUploadTarget(record)}
          onEdit={(record) => setEditTarget(record)}
          onDelete={(record) => setPendingDeleteCollege(record)}
        />
      </div>

      {listOpen && (
        <ProgramStreamListModal
          onAddProgramStream={() => setFormModal({ mode: "add" })}
          onEditProgramStream={handleEditProgramStream}
          onDeleteProgramStream={(programStream) => setPendingDelete(programStream)}
          onClose={() => setListOpen(false)}
          disableEscapeClose={formModal !== null || pendingDelete !== null}
        />
      )}

      {formModal && (
        <ProgramStreamFormModal
          mode={formModal.mode}
          initialValues={formModal.mode === "edit" ? { name: formModal.streamName } : undefined}
          streamCode={formModal.mode === "edit" ? formModal.streamCode : undefined}
          onSave={handleSaveProgramStream}
          onCancel={() => setFormModal(null)}
        />
      )}

      {uploadExcelOpen && (
        <CollegeUploadExcelModal
          programStreams={programStreams}
          districts={districts}
          onDone={handleUploadExcelDone}
          onCancel={() => setUploadExcelOpen(false)}
        />
      )}

      {collegeFormOpen && (
        <CollegeFormModal
          programStreams={programStreams}
          districts={districts}
          onSave={handleSaveCollege}
          onCancel={() => setCollegeFormOpen(false)}
        />
      )}

      {editTarget && (
        <CollegeFormModal
          mode="edit"
          programStreams={programStreams}
          districts={districts}
          initialValues={{
            collegeDetailsCode: editTarget.code,
            programStreamId: editTarget.streamCode,
            district: editTarget.districtCode,
            name: editTarget.originalCollegeName,
          }}
          onSave={() => setEditTarget(null)}
          onCancel={() => setEditTarget(null)}
        />
      )}

      {pdfUploadTarget && (
        <CollegePdfUploadModal
          collegeDetailsCode={pdfUploadTarget.code}
          programStreamName={pdfUploadTarget.streamName}
          district={pdfUploadTarget.districtName}
          collegeName={pdfUploadTarget.originalCollegeName}
          onSave={() => setPdfUploadTarget(null)}
          onCancel={() => setPdfUploadTarget(null)}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete Program / Stream"
        description={
          pendingDelete
            ? `Are you sure you want to delete "${pendingDelete.streamName}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingProgramStream ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ConfirmDialog
        open={pendingDeleteCollege !== null}
        title="Delete College"
        description={
          pendingDeleteCollege
            ? `Are you sure you want to delete "${pendingDeleteCollege.originalCollegeName}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingCollege ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteCollege}
        onCancel={() => setPendingDeleteCollege(null)}
      />
    </div>
  );
}
