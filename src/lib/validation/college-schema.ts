import { z } from "zod";
import { isFileList } from "./file-list";

// `pdfFile` is optional at the schema level — required-on-create is enforced
// imperatively in CollegeFormModal via `setError`, since edit mode allows
// keeping the existing PDF without re-selecting a file.
export const collegeSchema = z.object({
  programStreamId: z.string().min(1, "Program / Stream is required"),
  district: z.string().min(1, "District is required"),
  name: z.string().trim().min(1, "College Name is required"),
  pdfFile: z.custom<FileList>((value) => value === undefined || isFileList(value)).optional(),
});

export type CollegeFormValues = z.infer<typeof collegeSchema>;
