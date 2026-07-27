type ReadOnlyFieldProps = {
  label: string;
  value: string;
  id?: string;
};

// Disabled display-only field, styled to match TextField/SelectField/TextareaField
// for form data that is shown but not editable (e.g. system-managed values).
export function ReadOnlyField({ label, value, id }: ReadOnlyFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled
        readOnly
        className="block w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500"
      />
    </div>
  );
}
