"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Video, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form/text-field";
import { SelectField } from "@/components/ui/form/select-field";
import { TextareaField } from "@/components/ui/form/textarea-field";
import { videoSchema, type VideoFormValues } from "@/lib/validation/video-schema";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useListVideoCategoriesQuery,
} from "@/services/video/videoApi";

export type { VideoFormValues };

// Emitted to the parent once a video is ready to go into local state:
// `categoryName` is only present for the "add" path, resolved from the
// category dropdown so the video table can display it without a lookup.
export type VideoSaveValues = VideoFormValues & { categoryName?: string };

type VideoFormModalProps = {
  mode: "add" | "edit";
  initialValues?: VideoFormValues;
  // Required when mode === "edit" — the backend's `code` for this video,
  // sent as `tutorialCode` in the update request.
  videoCode?: string;
  onSave: (values: VideoSaveValues) => void;
  onCancel: () => void;
};

const EMPTY_VALUES: VideoFormValues = { title: "", categoryId: "", description: "", videoUrl: "" };

// Large enough to cover the category list in one request for a plain
// dropdown; if the category count grows well past this, switch to a
// searchable/paginated combobox instead of raising this further.
const CATEGORY_OPTIONS_PAGE_SIZE = 100;

// Mounted only while open (see VideoManagementView), so the form naturally starts
// fresh from `initialValues` every time it opens — no reset effect needed.
export function VideoFormModal({ mode, initialValues, videoCode, onSave, onCancel }: VideoFormModalProps) {
  const isEdit = mode === "edit";
  const [createVideo, { isLoading: isCreating }] = useCreateVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();
  const { data: categoryData, isLoading: isLoadingCategories } = useListVideoCategoriesQuery({
    pageNumber: 1,
    pageSize: CATEGORY_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const categoryOptions = categoryData?.responseObj.responseDataParams.data.records ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: initialValues ?? EMPTY_VALUES,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const submit = async (values: VideoFormValues) => {
    try {
      if (isEdit) {
        if (!videoCode) return;
        const response = await updateVideo({
          tutorialCode: videoCode,
          title: values.title,
          description: values.description,
          url: values.videoUrl,
        }).unwrap();
        toast.success(response.responseObj.responseMessage);
        onSave(values);
        return;
      }

      const response = await createVideo({
        categoryCode: values.categoryId,
        title: values.title,
        description: values.description,
        url: values.videoUrl,
      }).unwrap();
      toast.success(response.responseObj.responseMessage);
      const categoryName = categoryOptions.find((category) => category.code === values.categoryId)?.categoryName;
      onSave({ ...values, categoryName });
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          isEdit ? "Could not update the video. Please try again." : "Could not create the video. Please try again.",
        ),
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onCancel} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-form-title"
        className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <Video className="h-5 w-5" />
            </span>
            <h2 id="video-form-title" className="text-base font-semibold">
              {isEdit ? "Edit Video" : "Add New Video"}
            </h2>
          </div>
          <Button variant="header" size="icon" onClick={onCancel} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto border-t border-gray-100 px-6 py-5">
            <TextField
              id="video-title"
              label="Video Title"
              required
              placeholder="Enter video title"
              error={errors.title?.message}
              {...register("title")}
            />

            <SelectField
              id="video-category"
              label="Category"
              required
              disabled={isLoadingCategories || isEdit}
              error={errors.categoryId?.message}
              {...register("categoryId")}
            >
              <option value="" disabled>
                {isLoadingCategories ? "Loading categories..." : "Select a category"}
              </option>
              {categoryOptions.map((category) => (
                <option key={category._id} value={category.code}>
                  {category.categoryName}
                </option>
              ))}
            </SelectField>
            {isEdit && (
              <p className="-mt-2 text-xs text-gray-500">The category can&apos;t be changed after a video is created.</p>
            )}

            <TextareaField
              id="video-description"
              label="Description"
              required
              rows={4}
              placeholder="Enter video description..."
              error={errors.description?.message}
              {...register("description")}
            />

            <TextField
              id="video-url"
              label="Video URL"
              type="url"
              required
              placeholder="https://"
              error={errors.videoUrl?.message}
              {...register("videoUrl")}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
              {isEdit ? "Save Changes" : "Save Video"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
