const PRIORITY_CLASSES: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
};

// Case-insensitive: the API returns lowercase priority values ("low",
// "medium", "high") while the Add/Edit form's <select> uses capitalized
// labels ("Low", "Medium", "High").
export function SupportCategoryPriorityBadge({ priority }: { priority: string }) {
  const normalized = priority.toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
        PRIORITY_CLASSES[normalized] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {priority}
    </span>
  );
}
