import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListFaqCategoriesQuery } from "@/services/faq/faqApi";

// Large enough to cover the category list in one request for a plain
// filter dropdown; if the category count grows well past this, switch to a
// searchable/paginated combobox instead of raising this further.
const CATEGORY_OPTIONS_PAGE_SIZE = 100;

type FaqToolbarProps = {
  categoryCodeFilter: string;
  onCategoryCodeFilterChange: (value: string) => void;
  onAddFaq: () => void;
};

export function FaqToolbar({ categoryCodeFilter, onCategoryCodeFilterChange, onAddFaq }: FaqToolbarProps) {
  const { data: categoryData } = useListFaqCategoriesQuery({
    pageNumber: 1,
    pageSize: CATEGORY_OPTIONS_PAGE_SIZE,
    sort: -1,
  });
  const categoryOptions = categoryData?.responseObj.responseDataParams.data.records ?? [];

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <select
        value={categoryCodeFilter}
        onChange={(event) => onCategoryCodeFilterChange(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:w-56"
      >
        <option value="all">All Categories</option>
        {categoryOptions.map((category) => (
          <option key={category._id} value={category.code}>
            {category.categoryName}
          </option>
        ))}
      </select>

      <Button onClick={onAddFaq}>
        <Plus className="h-4 w-4" />
        Add FAQ
      </Button>
    </div>
  );
}
