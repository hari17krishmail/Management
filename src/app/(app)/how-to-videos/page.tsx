import type { Metadata } from "next";
import { VideoManagementView } from "@/components/howtovideos/video-management-view";

export const metadata: Metadata = {
  title: "How-To Videos | Educon",
};

export default function HowToVideosPage() {
  return <VideoManagementView />;
}
