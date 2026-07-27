import { z } from "zod";
import { isFileList } from "./file-list";

export const collegeUploadExcelSchema = z.object({
  programStreamId: z.string().min(1, "Program / Stream is required"),
  district: z.string().min(1, "District is required"),
  excelFile: z.custom<FileList>((value) => isFileList(value) && value.length > 0, {
    message: "Please upload an Excel file containing college names",
  }),
});

export type CollegeUploadExcelFormValues = z.infer<typeof collegeUploadExcelSchema>;
