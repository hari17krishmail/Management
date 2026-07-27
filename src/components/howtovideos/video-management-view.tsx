"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { VideoManagementHeader } from "./video-management-header";
import { VideoToolbar } from "./video-toolbar";
import { VideoTable } from "./video-table";
import { VideoFormModal } from "./modal/video-form-modal";
import { VideoCategoryListModal } from "./modal/video-category-list-modal";
import { VideoCategoryFormModal } from "./modal/video-category-form-modal";
import {
  useLazyGetVideoCategoryQuery,
  useDeleteVideoCategoryMutation,
  useLazyGetVideoQuery,
  useDeleteVideoMutation,
  type VideoCategoryRecord,
  type VideoRecord,
} from "@/services/video/videoApi";
import { getApiErrorMessage } from "@/lib/api-error";

type VideoFormModalState =
  | { mode: "add" }
  | { mode: "edit"; videoCode: string; title: string; categoryId: string; description: string; videoUrl: string }
  | null;
type CategoryFormModalState =
  | { mode: "add" }
  | { mode: "edit"; categoryCode: string; categoryName: string }
  | null;

export function VideoManagementView() {
  const [categoryCodeFilter, setCategoryCodeFilter] = useState("all");
  const [videoFormModal, setVideoFormModal] = useState<VideoFormModalState>(null);
  const [videoPendingDelete, setVideoPendingDelete] = useState<VideoRecord | null>(null);
  const [categoryListOpen, setCategoryListOpen] = useState(false);
  const [categoryFormModal, setCategoryFormModal] = useState<CategoryFormModalState>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] = useState<VideoCategoryRecord | null>(null);
  const [triggerGetVideo] = useLazyGetVideoQuery();
  const [deleteVideo, { isLoading: isDeletingVideo }] = useDeleteVideoMutation();
  const [triggerGetVideoCategory] = useLazyGetVideoCategoryQuery();
  const [deleteVideoCategory, { isLoading: isDeletingCategory }] = useDeleteVideoCategoryMutation();

  const handleEditVideo = async (record: VideoRecord) => {
    try {
      const response = await triggerGetVideo(record.code).unwrap();
      const video = response.responseObj.responseDataParams.data.record;
      setVideoFormModal({
        mode: "edit",
        videoCode: video.code,
        title: video.title,
        categoryId: video.categoryCode,
        description: video.description,
        videoUrl: video.url,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this video. Please try again."));
    }
  };

  const handleConfirmDeleteVideo = async () => {
    if (!videoPendingDelete) return;
    try {
      const response = await deleteVideo(videoPendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this video. Please try again."));
    } finally {
      setVideoPendingDelete(null);
    }
  };

  const handleEditCategory = async (record: VideoCategoryRecord) => {
    try {
      const response = await triggerGetVideoCategory(record.code).unwrap();
      const category = response.responseObj.responseDataParams.data.record;
      setCategoryFormModal({ mode: "edit", categoryCode: category.code, categoryName: category.categoryName });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load this category. Please try again."));
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryPendingDelete) return;
    try {
      const response = await deleteVideoCategory(categoryPendingDelete.code).unwrap();
      toast.success(response.responseObj.responseMessage);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete this category. Please try again."));
    } finally {
      setCategoryPendingDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <VideoManagementHeader onOpenCategories={() => setCategoryListOpen(true)} />

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <VideoToolbar
          categoryCodeFilter={categoryCodeFilter}
          onCategoryCodeFilterChange={setCategoryCodeFilter}
          onAddVideo={() => setVideoFormModal({ mode: "add" })}
        />

        <VideoTable
          key={categoryCodeFilter}
          categoryCodeFilter={categoryCodeFilter}
          onEdit={handleEditVideo}
          onDelete={(record) => setVideoPendingDelete(record)}
        />
      </div>

      {videoFormModal && (
        <VideoFormModal
          mode={videoFormModal.mode}
          initialValues={
            videoFormModal.mode === "edit"
              ? {
                  title: videoFormModal.title,
                  categoryId: videoFormModal.categoryId,
                  description: videoFormModal.description,
                  videoUrl: videoFormModal.videoUrl,
                }
              : undefined
          }
          videoCode={videoFormModal.mode === "edit" ? videoFormModal.videoCode : undefined}
          onSave={() => setVideoFormModal(null)}
          onCancel={() => setVideoFormModal(null)}
        />
      )}

      {categoryListOpen && (
        <VideoCategoryListModal
          onAddCategory={() => setCategoryFormModal({ mode: "add" })}
          onEditCategory={handleEditCategory}
          onDeleteCategory={(record) => setCategoryPendingDelete(record)}
          onClose={() => setCategoryListOpen(false)}
          disableEscapeClose={categoryFormModal !== null || categoryPendingDelete !== null}
        />
      )}

      {categoryFormModal && (
        <VideoCategoryFormModal
          mode={categoryFormModal.mode}
          initialValues={
            categoryFormModal.mode === "edit"
              ? { name: categoryFormModal.categoryName, description: "" }
              : undefined
          }
          categoryCode={categoryFormModal.mode === "edit" ? categoryFormModal.categoryCode : undefined}
          onSave={() => setCategoryFormModal(null)}
          onCancel={() => setCategoryFormModal(null)}
        />
      )}

      <ConfirmDialog
        open={videoPendingDelete !== null}
        title="Delete Video"
        description={
          videoPendingDelete
            ? `Are you sure you want to delete "${videoPendingDelete.title}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingVideo ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteVideo}
        onCancel={() => setVideoPendingDelete(null)}
      />

      <ConfirmDialog
        open={categoryPendingDelete !== null}
        title="Delete Video Category"
        description={
          categoryPendingDelete
            ? `Are you sure you want to delete "${categoryPendingDelete.categoryName}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel={isDeletingCategory ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => setCategoryPendingDelete(null)}
      />
    </div>
  );
}
