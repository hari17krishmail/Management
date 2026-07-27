import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export type FileFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

// Shared styled file input for react-hook-form: spread `register("field")` onto it
// directly (ref-forwarding makes this a drop-in replacement for `<input type="file">`).
export const FileField = forwardRef<HTMLInputElement, FileFieldProps>(function FileField(
  { label, error, required, id, className = "", ...props },
  ref,
) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        ref={ref}
        id={id}
        type="file"
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={`block w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
          error ? "border-red-400" : "border-gray-300 focus:border-blue-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
});
