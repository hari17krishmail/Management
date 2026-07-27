import { FILE_STAGE_TABS } from "./types";
import type { FileStage } from "./types";
import { Button } from "@/components/ui/button";

type FileStageTabsProps = {
  activeStage: FileStage;
  onStageChange: (stage: FileStage) => void;
  counts: Record<FileStage, number>;
};

export function FileStageTabs({ activeStage, onStageChange, counts }: FileStageTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 p-4">
      {FILE_STAGE_TABS.map((tab) => {
        const isActive = tab.key === activeStage;
        return (
          <Button
            key={tab.key}
            variant="unstyled"
            onClick={() => onStageChange(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {counts[tab.key]}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
