import { useListReasonsQuery } from "@/services/reason/reasonApi";
import type { TicketPriority, TicketStatus } from "./types";

const STATUSES: TicketStatus[] = ["Open", "Resolved"];
const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High"];

// Large enough to cover the category list in one request for a plain
// filter dropdown; if the category count grows well past this, switch to a
// searchable/paginated combobox instead of raising this further.
const CATEGORY_OPTIONS_PAGE_SIZE = 100;

type TicketToolbarProps = {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  categoryCodeFilter: string;
  onCategoryCodeFilterChange: (value: string) => void;
};

export function TicketToolbar({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryCodeFilter,
  onCategoryCodeFilterChange,
}: TicketToolbarProps) {
  const { data: categoryData } = useListReasonsQuery({
    pageNumber: 1,
    pageSize: CATEGORY_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const categoryOptions = categoryData?.responseObj.responseDataParams.data.records ?? [];

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-40"
      >
        <option value="All Statuses">All Statuses</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <select
        value={priorityFilter}
        onChange={(event) => onPriorityFilterChange(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-40"
      >
        <option value="All Priorities">All Priorities</option>
        {PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>

      <select
        value={categoryCodeFilter}
        onChange={(event) => onCategoryCodeFilterChange(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-40"
      >
        <option value="All Categories">All Categories</option>
        {categoryOptions.map((category) => (
          <option key={category._id} value={category.code} className="capitalize">
            {category.reasonName}
          </option>
        ))}
      </select>
    </div>
  );
}
