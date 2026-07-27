import type { Metadata } from "next";
import { FileManagementView } from "@/components/filemanagement/file-management-view";

export const metadata: Metadata = {
  title: "File Management | Educon",
};

export default function FileManagementPage() {
  return <FileManagementView />;
}
