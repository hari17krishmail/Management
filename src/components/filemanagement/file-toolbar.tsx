import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FileFilterField, FileFilters } from "./types";

type FileToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filters: FileFilters;
  onFilterChange: (field: FileFilterField, value: string) => void;
  options: Record<FileFilterField, string[]>;
};

const FIELD_LABELS: Record<FileFilterField, string> = {
  fileId: "File ID",
  mobile: "Mobile Number",
  partnerId: "Partner ID",
};

export function FileToolbar({ search, onSearchChange, filters, onFilterChange, options }: FileToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by File ID, Student Name..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </div>

      {(Object.keys(FIELD_LABELS) as FileFilterField[]).map((field) => (
        <select
          key={field}
          value={filters[field]}
          onChange={(event) => onFilterChange(field, event.target.value)}
          aria-label={FIELD_LABELS[field]}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:w-44"
        >
          <option value="All">{FIELD_LABELS[field]}</option>
          {options[field].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ))}

      <Button>
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
}
