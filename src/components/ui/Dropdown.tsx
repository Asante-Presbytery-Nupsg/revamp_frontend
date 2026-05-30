/* eslint-disable react-hooks/refs */
import React, { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check, Search, Loader2 } from "lucide-react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type Control,
  useController,
} from "react-hook-form";
import {
  useFloating,
  useClick,
  useDismiss,
  useRole,
  useListNavigation,
  useInteractions,
  flip,
  size,
  offset,
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
} from "@floating-ui/react";
import { useDebounce } from "@/hooks/useDebounce";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options?: DropdownOption[];
  placeholder?: string;
  error?: FieldError;
  searchable?: boolean;
  className?: string;
  required?: boolean;

  // ── server search (optional) ───────────────────────────────
  onServerSearch?: (query: string) => void;
  serverOptions?: DropdownOption[];
  isServerLoading?: boolean;
}

const DROPDOWN_MAX_HEIGHT = 250;

// ─── Component ────────────────────────────────────────────────────────────────

function Dropdown<T extends FieldValues>({
  label,
  name,
  control,
  options = [],
  placeholder = "Select an option",
  error,
  searchable = false,
  required = false,
  className = "",
  onServerSearch,
  serverOptions,
  isServerLoading = false,
}: DropdownProps<T>) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { field } = useController({ name, control });
  const hasError = Boolean(error);
  const isServer = Boolean(onServerSearch);

  const debouncedQuery = useDebounce(query, 400);

  // ── Detect soft keyboard via visualViewport ────────────────
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handler = () => {
      // keyboard is open when viewport shrinks by more than 150px
      setKeyboardOpen(window.innerHeight - vv.height > 150);
    };

    vv.addEventListener("resize", handler);
    return () => vv.removeEventListener("resize", handler);
  }, []);

  // ── Fire server search when debounced query changes ────────
  useEffect(() => {
    if (isServer) onServerSearch?.(debouncedQuery);
  }, [debouncedQuery, isServer, onServerSearch]);

  // ── Resolve which options to show ─────────────────────────
  const resolvedOptions: DropdownOption[] = isServer
    ? (serverOptions ?? [])
    : searchable
      ? options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        )
      : options;

  // Selected label — check both client options and server options
  const allOptions = [...options, ...(serverOptions ?? [])];
  const selected = allOptions.find((o) => o.value === field.value) ?? null;

  // ── Floating UI setup ──────────────────────────────────────
  const { refs, floatingStyles, context } = useFloating<HTMLButtonElement>({
    placement: keyboardOpen ? "top-start" : "bottom-start",
    open,
    onOpenChange: (nextOpen) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        setQuery("");
        setActiveIndex(null);
      }
    },
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(availableHeight - 8, DROPDOWN_MAX_HEIGHT)}px`,
          });
        },
        padding: 8,
      }),
    ],
  });

  useEffect(() => {
    if (keyboardOpen && open) {
      const element = refs.reference.current;

      if (element instanceof HTMLElement) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [keyboardOpen, open, refs.reference]);

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "listbox" });
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: searchable || isServer,
    loop: true,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role, listNav],
  );

  // Focus search input when panel opens
  useEffect(() => {
    if (open && (searchable || isServer)) {
      const t = setTimeout(() => searchRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open, searchable, isServer]);

  // ── Handlers ──────────────────────────────────────────────

  const handleSelect = (opt: DropdownOption) => {
    field.onChange(opt.value);
    setOpen(false);
    setQuery("");
    setActiveIndex(null);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Enter" &&
      activeIndex !== null &&
      resolvedOptions[activeIndex]
    ) {
      handleSelect(resolvedOptions[activeIndex]);
    }
  };

  return (
    <>
      <style>{`
        .dd-list::-webkit-scrollbar { width: 4px; }
        .dd-list::-webkit-scrollbar-track { background: transparent; }
        .dd-list::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 999px; }
        .dd-list::-webkit-scrollbar-thumb:hover { background: #93c5fd; }
        .dd-list { scrollbar-width: thin; scrollbar-color: #bfdbfe transparent; }
      `}</style>

      <div className={`relative ${className}`}>
        {/* Label */}
        <label
          htmlFor={uid}
          className="block mb-1.5 text-sm font-semibold text-gray-500"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>

        {/* Trigger */}
        <button
          ref={refs.setReference}
          id={uid}
          type="button"
          aria-controls={`${uid}-listbox`}
          aria-invalid={hasError}
          className={`
            px-2 py-2.5 w-full rounded-md border bg-white/20
            flex items-center justify-between gap-3 text-sm
            focus:ring-2 focus:ring-offset-2 focus:outline-none
            transition-colors duration-150
            ${
              hasError
                ? "border-red-400 focus:ring-red-400"
                : "border-blue-400 focus:ring-blue-400"
            }
          `}
          {...getReferenceProps()}
        >
          <span
            className={selected ? "text-gray-800 truncate" : "text-gray-400"}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Error */}
        {hasError && (
          <span
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

        {/* Panel */}
        {open && (
          <FloatingPortal>
            <FloatingFocusManager
              context={context}
              modal={false}
              initialFocus={searchable || isServer ? searchRef : 0}
            >
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                className="z-50 bg-white border border-gray-200 rounded-md shadow-sm flex flex-col overflow-hidden"
                {...getFloatingProps()}
              >
                {/* Search input — fixed height, never shrinks */}
                {(searchable || isServer) && (
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 shrink-0">
                    {isServerLoading ? (
                      <Loader2
                        size={13}
                        className="text-gray-400 shrink-0 animate-spin"
                      />
                    ) : (
                      <Search size={13} className="text-gray-400 shrink-0" />
                    )}
                    <input
                      ref={searchRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={isServer ? "Type to search..." : "Search..."}
                      className="text-sm flex-1 outline-none placeholder:text-gray-300 bg-transparent"
                      aria-autocomplete="list"
                    />
                    {isServer && query && isServerLoading && (
                      <span className="text-[10px] text-gray-300 shrink-0">
                        searching...
                      </span>
                    )}
                  </div>
                )}

                {/* Options list — fills remaining height and scrolls */}
                <ul
                  id={`${uid}-listbox`}
                  role="listbox"
                  aria-label={label}
                  className="dd-list overflow-y-auto flex-1 min-h-0"
                >
                  {isServerLoading && resolvedOptions.length === 0 ? (
                    <li className="px-3 py-4 text-sm text-gray-400 text-center">
                      Loading...
                    </li>
                  ) : resolvedOptions.length > 0 ? (
                    resolvedOptions.map((opt, i) => {
                      const isSelected = opt.value === field.value;
                      const isFocused = i === activeIndex;
                      return (
                        <li
                          key={opt.value}
                          ref={(node) => {
                            listRef.current[i] = node;
                          }}
                          role="option"
                          tabIndex={isFocused ? 0 : -1}
                          aria-selected={isSelected}
                          className={`
                            flex items-center justify-between px-3 py-2
                            text-sm cursor-pointer select-none
                           
                            transition-colors duration-100 outline-none
                            ${
                              isSelected
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : isFocused
                                  ? "bg-gray-50 text-gray-700"
                                  : "text-gray-700"
                            }
                          `}
                          {...getItemProps({
                            onClick: () => handleSelect(opt),
                            onKeyDown(e) {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSelect(opt);
                              }
                            },
                          })}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <Check
                              size={14}
                              className="text-blue-500 shrink-0"
                            />
                          )}
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-3 py-4 text-sm text-gray-400 text-center">
                      {isServer && !query
                        ? "Type to search"
                        : "No results found"}
                    </li>
                  )}
                </ul>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>
    </>
  );
}

export default Dropdown;
