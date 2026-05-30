import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  label: string;
  id: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  id,
  registration,
  error,
  placeholder = "Enter password",
  required = false,
  className = "",
}) => {
  const [show, setShow] = useState(false);
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

      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={`
            border rounded-md p-2.5 pr-10 text-sm w-full
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
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

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

export default PasswordInput;
