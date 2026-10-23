import React from 'react'
import { PersonalReminder } from '@/types/crm'

interface PersonalRemindersTabProps {
  personalReminders: PersonalReminder[]
  remindersUrgency: string
  onUrgencyChange: (urgency: string) => void
  reminderManagerFilter: string
  onManagerFilterChange: (manager: string) => void
  onCreateReminder: () => void
  onEditReminder: (reminder?: PersonalReminder) => void
  onToggleReminder: (id: string) => void
}

export function PersonalRemindersTab({
  personalReminders,
  remindersUrgency,
  onUrgencyChange,
  reminderManagerFilter,
  onManagerFilterChange,
  onCreateReminder,
  onEditReminder,
  onToggleReminder
}: PersonalRemindersTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1c2826]">Personal Reminders</h2>
        <button
          onClick={onCreateReminder}
          className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          + Create Reminder
        </button>
      </div>

      {/* Urgency Tabs */}
      <div className="flex items-center gap-4 border-b border-[#e5e7eb] pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => onUrgencyChange('All')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            remindersUrgency === 'All'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          All Reminders (2)
        </button>
        <button
          onClick={() => onUrgencyChange('Overdue')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            remindersUrgency === 'Overdue'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Overdue (1)
        </button>
        <button
          onClick={() => onUrgencyChange('Within 3 Days')}
          className="bg-[#fff5f5] text-[#dc2626] border border-[#fca5a5] rounded-md px-3 py-1 font-semibold text-xs cursor-pointer whitespace-nowrap"
        >
          Within 3 Days (0)
        </button>
        <button
          onClick={() => onUrgencyChange('Within 5 Days')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            remindersUrgency === 'Within 5 Days'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Within 5 Days (Week) (0)
        </button>
        <button
          onClick={() => onUrgencyChange('Within 10 Days')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            remindersUrgency === 'Within 10 Days'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Within 10 Days (2 Weeks) (1)
        </button>
        <button
          onClick={() => onUrgencyChange('Later')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            remindersUrgency === 'Later'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Later (0)
        </button>
      </div>

      {/* Case Manager Dropdown Filter */}
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs text-[#1c2826] font-medium">Case manager</span>
        <select
          value={reminderManagerFilter}
          onChange={(e) => onManagerFilterChange(e.target.value)}
          className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
        >
          <option value="All">All case managers</option>
          <option value="Amanpreet">Amanpreet</option>
          <option value="Inderpreet">Inderpreet</option>
          <option value="Sukhman">Sukhman</option>
          <option value="Tejinder">Tejinder</option>
        </select>
      </div>

      <p className="text-xs text-[#6b7280]">
        Date-based reminders use Vancouver dates. Each reminder belongs to one date group. Later contains reminders more than 10 days away. Shared workspace reminders are visible to your team.
      </p>

      {/* Reminders Table matching SCR-008 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">REMINDER DATE</th>
                <th className="py-3 px-4">REMINDER</th>
                <th className="py-3 px-4">REMINDER FOR</th>
                <th className="py-3 px-4">RELATED APPLICATION</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {/* Row 1 */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4">
                  <div className="font-medium text-[#1c2826]">Oct 19</div>
                  <span className="bg-[#dc2626] text-white rounded px-2 py-0.5 text-[11px] font-bold mt-1 inline-block">
                    Overdue by 3 days
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">
                  Check abd IRCC news for TRV processing changes
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                <td className="py-3.5 px-4 text-[#1c2826]">General reminder</td>
                <td className="py-3.5 px-4 space-x-2">
                  <button
                    onClick={() => onEditReminder(personalReminders[0])}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggleReminder(personalReminders[0]?.id || '1')}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Mark Complete
                  </button>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4">
                  <div className="font-medium text-[#1c2826]">Oct 28</div>
                  <span className="bg-[#e0f2fe] text-[#0284c7] rounded px-2 py-0.5 text-[11px] font-semibold mt-1 inline-block">
                    6 days left
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">
                  Renew office professional insurance
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                <td className="py-3.5 px-4 text-[#1c2826]">General reminder</td>
                <td className="py-3.5 px-4 space-x-2">
                  <button
                    onClick={() => onEditReminder(personalReminders[1])}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onToggleReminder(personalReminders[1]?.id || '2')}
                    className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                  >
                    Mark Complete
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
