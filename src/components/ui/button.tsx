import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "destructive"
  | "dark"
  | "success"
  | "ghost"
  | "header"
  | "header-filled"
  | "unstyled";

export type ButtonSize = "md" | "sm" | "icon" | "icon-sm" | "none";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const VARIANT_CLASSES: Record<Exclude<ButtonVariant, "unstyled">, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
  dark: "bg-gray-900 text-white hover:bg-gray-800",
  success: "bg-green-600 text-white hover:bg-green-700",
  ghost: "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
  header: "border border-white/20 text-white/80 hover:bg-white/10 hover:text-white",
  "header-filled": "bg-white/15 text-white hover:bg-white/25",
};

const SIZE_CLASSES: Record<Exclude<ButtonSize, "none">, string> = {
  md: "gap-1.5 rounded-lg px-4 py-2 text-sm font-medium",
  sm: "gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
  icon: "h-8 w-8 rounded-lg",
  "icon-sm": "h-7 w-7 rounded-md",
};

// Single source of truth for every `<button>` in the app. `variant="unstyled"`
// (or `size="none"`) opts out of the shared look entirely for one-off cases
// (pagination page numbers, table row-action pills, segmented tabs, …) while
// still centralizing the `type="button"` default and base interactive states.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", type = "button", className = "", ...props },
  ref,
) {
  if (variant === "unstyled" || size === "none") {
    return <button ref={ref} type={type} className={className} {...props} />;
  }

  const base =
    "inline-flex items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-60";

  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className} cursor-pointer`}
      {...props}
    />
  );
});
