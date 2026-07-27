import type { FileApprovalStatus } from "./types";

const FILE_STATUS_STYLES: Record<FileApprovalStatus, { badge: string; dot: string }> = {
  Pending: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Approved: { badge: "bg-green-50 text-green-700", dot: "bg-green-500" },
  Rejected: { badge: "bg-red-50 text-red-700", dot: "bg-red-500" },
};

export function FileStatusBadge({ status }: { status: FileApprovalStatus }) {
  const style = FILE_STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
