import React from 'react'

export function LmiaDeadlinesTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#1c2826]">
          LMIA advertisement & submission reminders
        </h2>
        <p className="text-[13px] text-[#6b7280] mt-1 max-w-4xl">
          Ad expiry prompts preparation; it does not automatically mark an LMIA ready. Advertisement expiry, submission and on-hold review reminders use separate 3-, 5- and 10-day groups. Click a company to open its profile.
        </p>
      </div>

      {/* Card 1: Overdue (0) */}
      <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
            !
          </span>
          <h3 className="text-base font-bold text-[#dc2626]">Overdue <span className="font-normal">(0)</span></h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">COMPANY NAME</th>
                <th className="py-2.5 px-4">POSITION</th>
                <th className="py-2.5 px-4">REMINDER</th>
                <th className="py-2.5 px-4">DEADLINE</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
                <th className="py-2.5 px-4">STATUS / REMINDER</th>
              </tr>
            </thead>
          </table>
          <div className="py-10 text-center text-sm text-[#6b7280]">
            No reminders in this section.
          </div>
        </div>
      </div>

      {/* Card 2: Within 3 Days (0) */}
      <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
            !
          </span>
          <h3 className="text-base font-bold text-[#dc2626]">Within 3 Days <span className="font-normal">(0)</span></h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">COMPANY NAME</th>
                <th className="py-2.5 px-4">POSITION</th>
                <th className="py-2.5 px-4">REMINDER</th>
                <th className="py-2.5 px-4">DEADLINE</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
                <th className="py-2.5 px-4">STATUS / REMINDER</th>
              </tr>
            </thead>
          </table>
          <div className="py-10 text-center text-sm text-[#6b7280]">
            No reminders in this section.
          </div>
        </div>
      </div>

      {/* Card 3: Within 5 Days (Week) (0) */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#d97706] p-6 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base font-bold text-[#1c2826]">Within 5 Days (Week) <span className="text-[#6b7280] font-normal">(0)</span></h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">COMPANY NAME</th>
                <th className="py-2.5 px-4">POSITION</th>
                <th className="py-2.5 px-4">REMINDER</th>
                <th className="py-2.5 px-4">DEADLINE</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
                <th className="py-2.5 px-4">STATUS / REMINDER</th>
              </tr>
            </thead>
          </table>
          <div className="py-10 text-center text-sm text-[#6b7280]">
            No reminders in this section.
          </div>
        </div>
      </div>
    </div>
  )
}
