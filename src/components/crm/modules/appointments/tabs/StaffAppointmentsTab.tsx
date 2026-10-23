import React from 'react'

export function StaffAppointmentsTab() {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">TIME</th>
                <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CLIENT</th>
                <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CONTACT</th>
                <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">MEETING WITH</th>
                <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">COMING FOR</th>
                <th className="py-2.5 px-4 bg-[#edf5fd] text-[#1e4d7b]">NOTES</th>
                <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">STATUS</th>
                <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">CLIENT TYPE</th>
                <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">REFERRED BY</th>
              </tr>
            </thead>
          </table>
          <div className="py-12 text-center text-sm text-[#6b7280]">
            No staff appointments scheduled for this date.
          </div>
        </div>
      </div>
      <p className="text-xs text-[#6b7280]">
        Vancouver time · Click an appointment to open notes, reschedule or view the client profile.
      </p>
    </div>
  )
}
