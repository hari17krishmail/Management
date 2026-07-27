import { Plus, Search, UploadCloud } from "lucide-react";
import type { District, ProgramStream } from "./types";
import { Button } from "@/components/ui/button";

type CollegeToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  programStreamFilter: string;
  onProgramStreamFilterChange: (value: string) => void;
  programStreams: ProgramStream[];
  districtFilter: string;
  onDistrictFilterChange: (value: string) => void;
  districts: District[];
  onUploadExcel: () => void;
  onAddCollege: () => void;
};

export function CollegeToolbar({
  search,
  onSearchChange,
  programStreamFilter,
  onProgramStreamFilterChange,
  programStreams,
  districtFilter,
  onDistrictFilterChange,
  districts,
  onUploadExcel,
  onAddCollege,
}: CollegeToolbarProps) {
  return (
    <>
        <div>

    <div className="flex items-center gap-3 pt-3 pb-1 px-4 justify-end">
        <Button variant="secondary" onClick={onUploadExcel}>
          <UploadCloud className="h-4 w-4" />
          Upload Excel
        </Button>
        <Button onClick={onAddCollege}>
          <Plus className="h-4 w-4" />
          Add College
        </Button>
      </div>
      </div>
    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative flex-1 sm:min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by College Name..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <select
          value={programStreamFilter}
          onChange={(event) => onProgramStreamFilterChange(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-56"
        >
          <option value="all">All Programs / Streams</option>
          {programStreams.map((programStream) => (
            <option key={programStream.id} value={programStream.id}>
              {programStream.name}
            </option>
          ))}
        </select>

        <select
          value={districtFilter}
          onChange={(event) => onDistrictFilterChange(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-48"
        >
          <option value="all">All Districts</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      
    </div>
    </>
  );
}
