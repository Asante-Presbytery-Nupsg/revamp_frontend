import React from "react";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  className?: string;
  readOnly?: boolean;
  value?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  registration,
  error,
  type = "text",
  value,
  placeholder,
  required = false,
  className = "",
  readOnly = false,
}) => {
  const hasError = Boolean(error);

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-1.5 font-semibold text-gray-500 text-sm"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly}
        aria-invalid={hasError}
        value={value}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={`
          border rounded-md p-2.5 text-sm w-full
          focus:ring-2 focus:ring-offset-2 focus:outline-none
          transition-colors duration-150
          ${
            hasError
              ? "border-red-400 focus:ring-red-400"
              : "border-blue-400 focus:ring-blue-400"
          }
        `}
        {...registration}
      />

      {hasError && (
        <span
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 mt-1 text-xs text-red-500 font-medium tracking-wide"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error?.message}
        </span>
      )}
    </div>
  );
};

export default FormField;
