import * as React from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CustomSelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  [key: string]: unknown;
}

export interface CustomSelectProps<T = any> {
  id?: string;
  name?: string;
  ariaLabel?: string;
  value?: T | T[] | string | number | null;
  options: T[];
  onChange: (value: any) => void;
  onBlur?: () => void;
  getOptionValue?: (option: T) => string | number;
  getOptionLabel?: (option: T) => string;
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  isDisabled?: boolean;
  isOptionDisabled?: (option: T) => boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  invalid?: boolean;
  valueOnly?: boolean;
}

export function CustomSelect<T = any>({
  id,
  name,
  ariaLabel,
  value,
  options = [],
  onChange,
  onBlur,
  getOptionValue = (opt: any) => opt?.value ?? opt?.id ?? opt?.typeID ?? opt,
  getOptionLabel = (opt: any) => opt?.label ?? opt?.name ?? opt?.typeName ?? String(opt),
  placeholder = "Select an option...",
  isMulti = false,
  isClearable = false,
  isDisabled = false,
  isOptionDisabled,
  isLoading = false,
  isSearchable = true,
  className,
  triggerClassName,
  contentClassName,
  invalid = false,
  valueOnly = true,
}: CustomSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const resolveValue = React.useCallback(
    (opt: T) => String(getOptionValue(opt)),
    [getOptionValue]
  );

  const resolveLabel = React.useCallback(
    (opt: T) => String(getOptionLabel(opt)),
    [getOptionLabel]
  );

  // Selected values set for fast lookup
  const selectedValues = React.useMemo(() => {
    if (value === undefined || value === null || value === "") return new Set<string>();
    if (Array.isArray(value)) {
      return new Set(
        value.map((v) =>
          typeof v === "object" && v !== null ? resolveValue(v as T) : String(v)
        )
      );
    }
    const val =
      typeof value === "object" && value !== null
        ? resolveValue(value as T)
        : String(value);
    return new Set([val]);
  }, [value, resolveValue]);

  // Filtered options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter((opt) =>
      resolveLabel(opt).toLowerCase().includes(query)
    );
  }, [options, searchQuery, resolveLabel]);

  const isAllSelected = React.useMemo(() => {
    if (!isMulti || options.length === 0) return false;
    return options.every((opt) => selectedValues.has(resolveValue(opt)));
  }, [isMulti, options, selectedValues, resolveValue]);

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(options);
    }
  };

  const handleOptionClick = (option: T) => {
    const optVal = resolveValue(option);

    if (isMulti) {
      const currentArray = Array.isArray(value) ? [...value] : [];
      const existsIndex = currentArray.findIndex((item) => {
        const itemVal =
          typeof item === "object" && item !== null
            ? resolveValue(item as T)
            : String(item);
        return itemVal === optVal;
      });

      if (existsIndex > -1) {
        currentArray.splice(existsIndex, 1);
        onChange(currentArray);
      } else {
        onChange([...currentArray, option]);
      }
    } else {
      if (valueOnly) {
        const val = typeof option === "object" && option !== null && "value" in (option as any)
          ? (option as any).value
          : resolveValue(option);
        onChange(val);
      } else {
        onChange(option);
      }
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(isMulti ? [] : (valueOnly ? "" : null));
  };

  const handleRemoveBadge = (e: React.MouseEvent, option: T) => {
    e.stopPropagation();
    if (!isMulti) return;
    const optVal = resolveValue(option);
    const currentArray = Array.isArray(value) ? [...value] : [];
    const updated = currentArray.filter((item) => {
      const itemVal =
        typeof item === "object" && item !== null
          ? resolveValue(item as T)
          : String(item);
      return itemVal !== optVal;
    });
    onChange(updated);
  };

  // Selected labels to display in the trigger
  const displayContent = React.useMemo(() => {
    if (selectedValues.size === 0) {
      return <span className="text-[#9ca3af]">{placeholder}</span>;
    }

    if (isMulti) {
      const selectedItems = options.filter((opt) =>
        selectedValues.has(resolveValue(opt))
      );

      if (selectedItems.length === 0) {
        return <span className="text-[#9ca3af]">{placeholder}</span>;
      }

      return (
        <div className="flex flex-wrap gap-1 items-center max-w-full overflow-hidden">
          {selectedItems.slice(0, 3).map((item) => (
            <Badge
              key={resolveValue(item)}
              variant="secondary"
              className="text-xs px-1.5 py-0.5 max-w-[130px] truncate flex items-center gap-1"
            >
              <span className="truncate">{resolveLabel(item)}</span>
              {!isDisabled && (
                <X
                  className="size-3 cursor-pointer opacity-70 hover:opacity-100 shrink-0"
                  onClick={(e) => handleRemoveBadge(e, item)}
                />
              )}
            </Badge>
          ))}
          {selectedItems.length > 3 && (
            <Badge variant="outline" className="text-xs px-1 py-0.5">
              +{selectedItems.length - 3} more
            </Badge>
          )}
        </div>
      );
    }

    const singleOption = options.find((opt) =>
      selectedValues.has(resolveValue(opt))
    );
    const displayLabel = singleOption
      ? resolveLabel(singleOption)
      : typeof value === "object" && value !== null
      ? resolveLabel(value as T)
      : value !== undefined && value !== null && value !== "" && String(value) !== "[object Object]"
      ? String(value)
      : null;

    if (!displayLabel || displayLabel === "[object Object]") {
      return <span className="text-[#9ca3af]">{placeholder}</span>;
    }

    return (
      <span className="truncate">
        {displayLabel}
      </span>
    );
  }, [selectedValues, isMulti, options, placeholder, isDisabled, resolveValue, resolveLabel, value]);

  return (
    <div className={cn("relative w-full", className)}>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          if (!isDisabled) {
            setOpen(isOpen);
            if (!isOpen) {
              setSearchQuery("");
              onBlur?.();
            }
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel || name}
            aria-invalid={invalid}
            disabled={isDisabled}
            className={cn(
              "w-full flex justify-between items-center text-left font-normal min-h-9 px-3 py-1.5 rounded-md border border-[#cbd5d1] bg-white text-[#1c2826] text-[13.5px] transition-all duration-150 cursor-pointer outline-none focus:ring-1 focus:ring-[#9f5832]",
              "hover:brightness-95 hover:border-[#9ca3af]",
              invalid && "border-red-500 focus:ring-red-500",
              isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
              triggerClassName
            )}
          >
            <div className="flex-1 min-w-0 pr-2 overflow-hidden">{displayContent}</div>
            <div className="flex items-center gap-1 shrink-0 text-current opacity-70">
              {isLoading ? (
                <Loader2 className="size-4 animate-spin opacity-60" />
              ) : (
                <>
                  {isClearable && selectedValues.size > 0 && !isDisabled && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="p-0.5 hover:opacity-100 transition-opacity cursor-pointer rounded-sm"
                      onClick={handleClear}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleClear(e as any);
                        }
                      }}
                      title="Clear selection"
                    >
                      <X className="size-3.5" />
                    </span>
                  )}
                  <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
                </>
              )}
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-[200px] max-h-[var(--radix-popover-content-available-height,320px)] flex flex-col p-0 shadow-xl border border-[#e5e7eb] bg-white text-[#1c2826] z-50 overflow-hidden rounded-md",
            contentClassName
          )}
        >
          {isSearchable && (
            <div className="flex items-center shrink-0 border-b border-[#e5e7eb] px-3 py-2 bg-[#f9fafb]">
              <Search className="mr-2 size-4 shrink-0 text-[#6b7280]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca3af] text-[#1c2826]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-[#6b7280] hover:text-[#1c2826]"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {isMulti && options.length > 0 && !searchQuery && (
            <div
              className="flex items-center shrink-0 gap-2 px-3 py-2 border-b border-[#e5e7eb] hover:bg-[#edf3ef] cursor-pointer text-sm font-medium text-[#1c2826]"
              onClick={handleSelectAllToggle}
            >
              <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAllToggle} />
              <span>Select All ({options.length})</span>
            </div>
          )}

          <div className="flex-1 min-h-0 max-h-60 overflow-y-auto overscroll-contain p-1.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#6b7280]">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optVal = resolveValue(option);
                const optLabel = resolveLabel(option);
                const isSelected = selectedValues.has(optVal);
                const disabled =
                  (option as any)?.disabled || isOptionDisabled?.(option) || false;

                return (
                  <div
                    key={optVal}
                    onClick={() => !disabled && handleOptionClick(option)}
                    className={cn(
                      "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors select-none text-[#1c2826]",
                      isSelected
                        ? "bg-[#edf7f0] text-[#126b48] font-semibold hover:bg-[#dff0e4]"
                        : "hover:bg-[#edf3ef] hover:text-[#0d3829]",
                      disabled && "opacity-50 pointer-events-none cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {isMulti && (
                        <Checkbox
                          checked={isSelected}
                          disabled={disabled}
                          className="pointer-events-none"
                        />
                      )}
                      <span className="truncate">{optLabel}</span>
                    </div>
                    {!isMulti && isSelected && (
                      <Check className="size-4 shrink-0 text-[#166534]" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
      {name && (
        <input
          type="hidden"
          name={name}
          value={
            isMulti
              ? Array.from(selectedValues).join(",")
              : Array.from(selectedValues)[0] ?? ""
          }
        />
      )}
    </div>
  );
}

export default CustomSelect;
