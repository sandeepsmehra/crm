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
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    if (isMulti) {
      const selectedItems = options.filter((opt) =>
        selectedValues.has(resolveValue(opt))
      );

      if (selectedItems.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
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
      return <span className="text-muted-foreground">{placeholder}</span>;
    }

    return (
      <span className="truncate text-foreground">
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
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={ariaLabel || name}
            aria-invalid={invalid}
            disabled={isDisabled}
            className={cn(
              "w-full justify-between items-center bg-background text-left font-normal h-auto min-h-9 px-3 py-1.5 border border-input shadow-xs transition-colors hover:bg-background/80 focus-visible:ring-1 focus-visible:ring-ring",
              invalid && "border-destructive focus-visible:ring-destructive",
              isDisabled && "opacity-50 cursor-not-allowed",
              triggerClassName
            )}
          >
            <div className="flex-1 min-w-0 pr-2 overflow-hidden">{displayContent}</div>
            <div className="flex items-center gap-1 shrink-0 text-muted-foreground">
              {isLoading ? (
                <Loader2 className="size-4 animate-spin opacity-60" />
              ) : (
                <>
                  {isClearable && selectedValues.size > 0 && !isDisabled && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="p-0.5 hover:text-foreground transition-colors cursor-pointer rounded-sm"
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
                  <ChevronDown className="size-4 opacity-50 transition-transform duration-200" />
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-[200px] max-h-[var(--radix-popover-content-available-height,320px)] flex flex-col p-0 shadow-lg border border-border bg-popover text-popover-foreground z-50 overflow-hidden",
            contentClassName
          )}
        >
          {isSearchable && (
            <div className="flex items-center shrink-0 border-b border-border px-3 py-2">
              <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}

          {isMulti && options.length > 0 && !searchQuery && (
            <div
              className="flex items-center shrink-0 gap-2 px-3 py-2 border-b border-border/60 hover:bg-accent/50 cursor-pointer text-sm font-medium"
              onClick={handleSelectAllToggle}
            >
              <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAllToggle} />
              <span>Select All ({options.length})</span>
            </div>
          )}

          <div className="flex-1 min-h-0 max-h-60 overflow-y-auto overscroll-contain p-1 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
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
                      "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm text-sm cursor-pointer transition-colors select-none",
                      isSelected
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50 text-foreground",
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
                      <Check className="size-4 shrink-0 text-primary" />
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
