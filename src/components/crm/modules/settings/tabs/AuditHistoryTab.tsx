import React from 'react'

const AUDIT_ROWS = [
  { time: '2026-10-22T04:55:13.765Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed matters/NR-demo-18' },
  { time: '2026-10-22T04:53:35.019Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-demo-03' },
  { time: '2026-10-22T04:50:22.015Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed officeTasks/T-demo-4' },
  { time: '2026-10-22T04:49:34.020Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed personalReminders/R-demo-2' },
  { time: '2026-10-19T08:05:49.808Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-22; Changed matters/NR-26020' },
  { time: '2026-10-19T08:04:55.392Z', staff: 'seedy@sites.test', action: 'save', changes: 'Created officeTasks/T-944776d6-02ef-40da-bd9e-72ea052c2709' },
  { time: '2026-10-19T08:04:26.711Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-demo-E1' }
]

export function AuditHistoryTab() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">STAFF</th>
                <th className="py-3 px-4">ACTION</th>
                <th className="py-3 px-4">CHANGES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {AUDIT_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-[#fbfcfb]">
                  <td className="py-3.5 px-4 font-mono text-xs text-[#374151] whitespace-nowrap">
                    {row.time}
                  </td>
                  <td className="py-3.5 px-4 text-[#111827]">{row.staff}</td>
                  <td className="py-3.5 px-4 text-[#111827]">{row.action}</td>
                  <td className="py-3.5 px-4 text-[#111827]">{row.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
