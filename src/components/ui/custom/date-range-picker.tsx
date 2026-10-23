import * as React from "react";
import {
  endOfMonth,
  endOfYear,
  format,
  isSameDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  showPresets?: boolean;
  numberOfMonths?: number;
  /** Legacy compatibility props from legacy DateRangePicker */
  range?: any;
  setRange?: (range: any) => void;
  openDatePicker?: boolean;
  setOpenDatePicker?: (open: boolean) => void;
  handleDateRangeFilter?: () => void;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
  disabled = false,
  align = "start",
  showPresets = true,
  numberOfMonths = 2,
  range,
  setRange,
  openDatePicker,
  setOpenDatePicker,
  handleDateRangeFilter,
}: DateRangePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = openDatePicker !== undefined ? openDatePicker : internalOpen;
  const onOpenChange = setOpenDatePicker || setInternalOpen;

  // Adapt legacy range shape if provided: [{ startDate, endDate, key: 'selection' }]
  const legacySelected: DateRange | undefined = React.useMemo(() => {
    if (range && Array.isArray(range) && range[0]) {
      return {
        from: range[0].startDate ? new Date(range[0].startDate) : undefined,
        to: range[0].endDate ? new Date(range[0].endDate) : undefined,
      };
    }
    return undefined;
  }, [range]);

  const selectedRange = value || legacySelected;

  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    selectedRange
  );

  React.useEffect(() => {
    setTempRange(selectedRange);
  }, [selectedRange]);

  const handleSelect = (newRange: DateRange | undefined) => {
    setTempRange(newRange);
  };

  const handleApply = () => {
    if (onChange) {
      onChange(tempRange);
    }
    if (setRange && tempRange) {
      setRange([
        {
          startDate: tempRange.from,
          endDate: tempRange.to,
          key: "selection",
        },
      ]);
    }
    handleDateRangeFilter?.();
    onOpenChange(false);
  };

  const handleClear = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTempRange(undefined);
    if (onChange) {
      onChange(undefined);
    }
    if (setRange) {
      setRange([]);
    }
    handleDateRangeFilter?.();
  };

  const presets = React.useMemo(() => {
    const today = new Date();
    return [
      {
        label: "Today",
        range: { from: today, to: today },
      },
      {
        label: "Yesterday",
        range: { from: subDays(today, 1), to: subDays(today, 1) },
      },
      {
        label: "Last 7 Days",
        range: { from: subDays(today, 6), to: today },
      },
      {
        label: "Last 30 Days",
        range: { from: subDays(today, 29), to: today },
      },
      {
        label: "This Month",
        range: { from: startOfMonth(today), to: endOfMonth(today) },
      },
      {
        label: "Last Month",
        range: {
          from: startOfMonth(subMonths(today, 1)),
          to: endOfMonth(subMonths(today, 1)),
        },
      },
      {
        label: "This Year",
        range: { from: startOfYear(today), to: endOfYear(today) },
      },
    ];
  }, []);

  const formatDisplay = () => {
    if (!selectedRange?.from) return placeholder;
    if (!selectedRange.to || isSameDay(selectedRange.from, selectedRange.to)) {
      return format(selectedRange.from, "LLL dd, yyyy");
    }
    return `${format(selectedRange.from, "LLL dd, yyyy")} - ${format(
      selectedRange.to,
      "LLL dd, yyyy"
    )}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-[280px] justify-start text-left font-normal h-9 bg-background px-3",
              !selectedRange?.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4 opacity-70 shrink-0" />
            <span className="truncate flex-1">{formatDisplay()}</span>
            {selectedRange?.from && (
              <span
                role="button"
                tabIndex={0}
                className="ml-1 p-0.5 hover:text-foreground text-muted-foreground opacity-70 hover:opacity-100 transition-opacity"
                onClick={handleClear}
                title="Clear date range"
              >
                <X className="size-3.5" />
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0 shadow-xl border border-border bg-popover z-50"
          align={align}
        >
          <div className="flex flex-col sm:flex-row">
            {showPresets && (
              <div className="flex flex-col gap-1 p-3 border-b sm:border-b-0 sm:border-r border-border min-w-[140px] bg-muted/20">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Presets
                </span>
                {presets.map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="justify-start text-xs h-7 px-2 font-normal hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setTempRange(preset.range);
                      if (onChange) onChange(preset.range);
                      if (setRange) {
                        setRange([
                          {
                            startDate: preset.range.from,
                            endDate: preset.range.to,
                            key: "selection",
                          },
                        ]);
                      }
                      handleDateRangeFilter?.();
                      onOpenChange(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="p-3">
              <Calendar
                mode="range"
                defaultMonth={tempRange?.from || new Date()}
                selected={tempRange}
                onSelect={handleSelect}
                numberOfMonths={numberOfMonths}
              />
              <div className="flex items-center justify-between pt-3 border-t border-border mt-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleClear()}
                >
                  Reset
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="text-xs h-8 px-4"
                    onClick={handleApply}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangePicker;
