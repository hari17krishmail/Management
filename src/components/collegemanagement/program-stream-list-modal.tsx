"use client";

import { useEffect } from "react";
import { Layers, Plus, X } from "lucide-react";
import type { ProgramStreamRecord } from "@/services/programstream/programStreamApi";
import { Button } from "@/components/ui/button";
import { ProgramStreamTable } from "./program-stream-table";

type ProgramStreamListModalProps = {
  onAddProgramStream: () => void;
  onEditProgramStream: (programStream: ProgramStreamRecord) => void;
  onDeleteProgramStream: (programStream: ProgramStreamRecord) => void;
  onClose: () => void;
  disableEscapeClose?: boolean;
};

export function ProgramStreamListModal({
  onAddProgramStream,
  onEditProgramStream,
  onDeleteProgramStream,
  onClose,
  disableEscapeClose,
}: ProgramStreamListModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disableEscapeClose) return;
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, disableEscapeClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-stream-list-title"
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h2 id="program-stream-list-title" className="text-base font-semibold">
                Programs / Streams
              </h2>
              <p className="mt-0.5 text-sm text-blue-100">Manage the master list of college programs and streams</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="header-filled" onClick={onAddProgramStream}>
              <Plus className="h-4 w-4" />
              Add Program / Stream
            </Button>
            <Button variant="header" size="icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProgramStreamTable onEdit={onEditProgramStream} onDelete={onDeleteProgramStream} />
        </div>
      </div>
    </div>
  );
}
