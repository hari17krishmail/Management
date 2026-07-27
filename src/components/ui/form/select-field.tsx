import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";

export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

// Shared styled select for react-hook-form: spread `register("field")` onto it
// directly (ref-forwarding makes this a drop-in replacement for `<select>`).
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, required, id, className = "", children, ...props },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
          error ? "border-red-400" : "border-gray-300 focus:border-blue-500"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
});
