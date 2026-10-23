import React from 'react'
import { toast } from '@/components/ui/sonner'

export function MatterRemindersTab() {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#111827]">Personal Reminders</h2>
        <button
          onClick={() => toast.info('Create reminder for this matter')}
          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          + Create Reminder
        </button>
      </div>
      <p className="text-xs text-[#6b7280]">No open reminders for this application.</p>
    </div>
  )
}
