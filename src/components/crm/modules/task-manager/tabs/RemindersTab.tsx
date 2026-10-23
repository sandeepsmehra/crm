import React from 'react'
import { OfficeTask } from '@/types/crm'

interface RemindersTabProps {
  selectedManager: string
  onManagerChange: (manager: string) => void
  tasks: OfficeTask[]
  onCompleteTask: (task: OfficeTask) => void
  onChangeStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void
}

export function RemindersTab({
  selectedManager,
  onManagerChange,
  tasks,
  onCompleteTask,
  onChangeStatus
}: RemindersTabProps) {
  return (
    <div className="space-y-4">
      {/* Filter Row matching SCR-014 */}
      <div className="flex items-center gap-2 select-none">
        <button className="bg-[#1f2d29] text-white px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer">
          Calls waiting 3+ days <span className="ml-1">5</span>
        </button>

        <select
          value={selectedManager}
          onChange={(e) => onManagerChange(e.target.value)}
          className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
        >
          <option value="All">All Case Managers ▾</option>
          <option value="Amanpreet">Amanpreet</option>
          <option value="Inderpreet">Inderpreet</option>
          <option value="Sukhman">Sukhman</option>
          <option value="Tejinder">Tejinder</option>
        </select>
      </div>

      <div className="pt-2">
        <h2 className="text-sm font-bold text-[#1c2826]">
          Follow-up Reminders · Urgent Attention Needed (5)
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">CALL DATE</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">CONTACT</th>
                <th className="py-3 px-4">WAIT TIME</th>
                <th className="py-3 px-4">ASSIGNED TO</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4 text-[#1c2826]">2026-10-14</td>
                <td className="py-3.5 px-4 font-bold text-[#1c2826]">Mei Lin Chen</td>
                <td className="py-3.5 px-4 text-[#1c2826]">604-555-0202</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#fee2e2] text-[#b91c1c] rounded px-2.5 py-0.5 text-xs font-semibold">
                    8 days waiting
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#fee2e2] text-[#b91c1c] rounded px-2.5 py-0.5 text-xs font-semibold">
                    Urgent
                  </span>
                </td>
                <td className="py-3.5 px-4 space-x-2">
                  <button
                    onClick={() => onCompleteTask(tasks[0] || ({} as any))}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Call Now
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4 text-[#1c2826]">2026-10-18</td>
                <td className="py-3.5 px-4 font-bold text-[#1c2826]">Aarav Sharma</td>
                <td className="py-3.5 px-4 text-[#1c2826]">604-555-0201</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#fee2e2] text-[#b91c1c] rounded px-2.5 py-0.5 text-xs font-semibold">
                    4 days waiting
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#fee2e2] text-[#b91c1c] rounded px-2.5 py-0.5 text-xs font-semibold">
                    Urgent
                  </span>
                </td>
                <td className="py-3.5 px-4 space-x-2">
                  <button
                    onClick={() => onCompleteTask(tasks[1] || ({} as any))}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Call Now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
