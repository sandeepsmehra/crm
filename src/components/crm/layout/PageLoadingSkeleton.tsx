import React from 'react'

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Top Header Placeholder */}
      <div className="flex items-center justify-between pb-2">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[#e3e8e5] rounded-md" />
          <div className="h-4 w-72 bg-[#ebf0ed] rounded" />
        </div>
        <div className="h-9 w-36 bg-[#e3e8e5] rounded-md" />
      </div>

      {/* KPI Cards Placeholder Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-[#e2e8e5] space-y-3">
            <div className="h-4 w-24 bg-[#e8ecea] rounded" />
            <div className="h-8 w-16 bg-[#dbe2de] rounded" />
            <div className="h-3 w-32 bg-[#edf1ef] rounded" />
          </div>
        ))}
      </div>

      {/* Main Table / Content Skeleton Box */}
      <div className="bg-white rounded-lg border border-[#e2e8e5] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#edf1ef]">
          <div className="h-5 w-40 bg-[#e3e8e5] rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-24 bg-[#ebf0ed] rounded" />
            <div className="h-8 w-20 bg-[#ebf0ed] rounded" />
          </div>
        </div>

        {/* Shimmering Table Rows */}
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#f4f7f5] last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ebf0ed]" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-[#e3e8e5] rounded" />
                  <div className="h-3 w-24 bg-[#edf1ef] rounded" />
                </div>
              </div>
              <div className="h-4 w-28 bg-[#ebf0ed] rounded hidden sm:block" />
              <div className="h-4 w-20 bg-[#ebf0ed] rounded hidden md:block" />
              <div className="h-6 w-16 bg-[#e3e8e5] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
