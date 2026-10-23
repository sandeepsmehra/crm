import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  id?: string;
  name?: string;
  ariaLabel?: string;
  value?: string | Date | null;
  onChange?: (dateString: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  isClearable?: boolean;
}

/** Formats a Date object to YYYY-MM-DD without UTC timezone offset issues */
export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a YYYY-MM-DD string or Date into a local Date object */
export function parseIsoDate(val: string | Date | null | undefined): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? undefined : val;
  }
  const str = String(val).trim();
  if (!str) return undefined;
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return isNaN(date.getTime()) ? undefined : date;
  }
  const date = new Date(str);
  return isNaN(date.getTime()) ? undefined : date;
}

export function DatePicker({
  id,
  name,
  ariaLabel,
  value,
  onChange,
  onBlur,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  invalid = false,
  required = false,
  minDate,
  maxDate,
  className,
  isClearable = true,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Derive string representation
  const stringValue = React.useMemo(() => {
    if (!value) return "";
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? "" : formatDateToIso(value);
    }
    return String(value);
  }, [value]);

  // Selected date object for the Calendar
  const selectedDate = React.useMemo(() => {
    return parseIsoDate(stringValue);
  }, [stringValue]);

  // Month currently displayed in Calendar
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    selectedDate || new Date()
  );

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = formatDateToIso(date);
      onChange?.(formatted);
    } else {
      onChange?.("");
    }
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange?.(val);

    const parsed = parseIsoDate(val);
    if (parsed) {
      setCurrentMonth(parsed);
    }
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange?.("");
  };

  const handleSelectToday = () => {
    const today = new Date();
    handleDateSelect(today);
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Input
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        value={stringValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-invalid={invalid}
        className={cn(
          "pr-16 bg-background font-normal shadow-xs transition-colors",
          invalid && "border-destructive focus-visible:ring-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        {isClearable && stringValue && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleClear}
            title="Clear date"
            aria-label="Clear date"
            className="size-7 text-muted-foreground hover:text-foreground p-0"
          >
            <X className="size-3.5" />
          </Button>
        )}
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            if (!disabled) {
              setOpen(isOpen);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              title="Open calendar"
              aria-label="Open calendar"
              className="size-7 text-muted-foreground hover:text-foreground hover:bg-accent/50 p-0"
            >
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            className="w-auto p-0 shadow-xl border border-border bg-popover z-[100]"
          >
            <div className="p-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                onSelect={handleDateSelect}
                disabled={(date: Date) => {
                  if (minDate && date < minDate) return true;
                  if (maxDate && date > maxDate) return true;
                  return false;
                }}
              />
            </div>
            <div className="flex items-center justify-between p-2.5 border-t border-border bg-muted/20">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 font-medium hover:bg-accent"
                onClick={handleSelectToday}
              >
                Today
              </Button>
              {isClearable && stringValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive font-medium"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default DatePicker;
