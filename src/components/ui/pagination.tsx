import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | "ellipsis-start" | "ellipsis-end";

const SIBLING_COUNT = 1;
const BOUNDARY_COUNT = 1;

function range(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

// Standard condensed-pagination layout (boundary pages + a sibling window
// around the current page, with ellipses filling any gaps) — the same shape
// used by MUI/Bootstrap-style paginators, e.g. `1 … 4 5 6 … 18`.
function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  const totalVisibleNumbers = BOUNDARY_COUNT * 2 + SIBLING_COUNT * 2 + 3;

  if (totalPages <= totalVisibleNumbers) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - SIBLING_COUNT, BOUNDARY_COUNT + 2);
  const rightSibling = Math.min(currentPage + SIBLING_COUNT, totalPages - BOUNDARY_COUNT - 1);

  const showLeftEllipsis = leftSibling > BOUNDARY_COUNT + 2;
  const showRightEllipsis = rightSibling < totalPages - BOUNDARY_COUNT - 1;

  const items: PageItem[] = [...range(1, BOUNDARY_COUNT)];

  if (showLeftEllipsis) {
    items.push("ellipsis-start");
  } else {
    items.push(...range(BOUNDARY_COUNT + 1, leftSibling - 1));
  }

  items.push(...range(leftSibling, rightSibling));

  if (showRightEllipsis) {
    items.push("ellipsis-end");
  } else {
    items.push(...range(rightSibling + 1, totalPages - BOUNDARY_COUNT));
  }

  items.push(...range(totalPages - BOUNDARY_COUNT + 1, totalPages));

  return items;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const items = getPageItems(currentPage, totalPages);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {items.map((item) =>
        typeof item === "number" ? (
          <Button
            key={item}
            variant="unstyled"
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              item === currentPage ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item}
          </Button>
        ) : (
          <span key={item} aria-hidden="true" className="flex h-8 w-8 items-center justify-center text-sm text-gray-400">
            …
          </span>
        ),
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
