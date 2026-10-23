import * as React from "react"
import { DayPicker, type DayPickerProps } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = DayPickerProps

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-sm font-medium",
        nav: "flex items-center gap-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal rounded-md inline-flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer",
        today: "bg-slate-100 font-semibold text-slate-900",
        selected: "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-700 focus:text-white font-medium",
        outside: "text-slate-400 opacity-50",
        disabled: "text-slate-300 opacity-50 pointer-events-none",
        range_start: "rounded-l-md bg-indigo-600 text-white",
        range_end: "rounded-r-md bg-indigo-600 text-white",
        range_middle: "bg-indigo-50 text-indigo-900 rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      {...(props as any)}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
