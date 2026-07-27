import { z } from "zod";
import { isFileList } from "./file-list";

export const collegePdfUploadSchema = z.object({
  pdfFile: z.custom<FileList>((value) => isFileList(value) && value.length > 0, {
    message: "Please upload a college details PDF",
  }),
});

export type CollegePdfUploadFormValues = z.infer<typeof collegePdfUploadSchema>;
