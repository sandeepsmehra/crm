import React from 'react'
import { APPLICATION_TYPES, STAFF_MEMBERS } from '@/data/mockData'

interface ApplicationDetailsTabProps {
  appType: string
  onAppTypeChange: (value: string) => void
  customAppType: string
  onCustomAppTypeChange: (value: string) => void
  caseManager: string
  onCaseManagerChange: (value: string) => void
  caseOverview: string
  onCaseOverviewChange: (value: string) => void
  extraNotes: string
  onExtraNotesChange: (value: string) => void
  hasDependants: string
  onHasDependantsChange: (value: string) => void
  itaDate: string
  onItaDateChange: (value: string) => void
  deadlineSubmit: string
  onDeadlineSubmitChange: (value: string) => void
  prNotes: string
  onPrNotesChange: (value: string) => void
}

export function ApplicationDetailsTab({
  appType,
  onAppTypeChange,
  customAppType,
  onCustomAppTypeChange,
  caseManager,
  onCaseManagerChange,
  caseOverview,
  onCaseOverviewChange,
  extraNotes,
  onExtraNotesChange,
  hasDependants,
  onHasDependantsChange,
  itaDate,
  onItaDateChange,
  deadlineSubmit,
  onDeadlineSubmitChange,
  prNotes,
  onPrNotesChange
}: ApplicationDetailsTabProps) {
  return (
    <div className="space-y-4">
      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-5">
        <h2 className="text-base font-bold text-[#111827]">Application Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Application Type
            </label>
            <select
              value={appType}
              onChange={(e) => onAppTypeChange(e.target.value)}
              className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
            >
              {APPLICATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Your application type
            </label>
            <input
              type="text"
              placeholder="e.g. with Restoration"
              value={customAppType}
              onChange={(e) => onCustomAppTypeChange(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Case Manager
          </label>
          <select
            value={caseManager}
            onChange={(e) => onCaseManagerChange(e.target.value)}
            className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer max-w-md"
          >
            <option value="Unassigned">Unassigned</option>
            {STAFF_MEMBERS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Case Overview
          </label>
          <textarea
            rows={7}
            value={caseOverview}
            onChange={(e) => onCaseOverviewChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Extra Notes
          </label>
          <textarea
            rows={3}
            placeholder="Additional notes for this application"
            value={extraNotes}
            onChange={(e) => onExtraNotesChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
          />
        </div>
      </div>

      {/* Dependants Card (SCR-041) */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-[#111827]">Dependants</h2>
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Any dependants?
          </label>
          <select
            value={hasDependants}
            onChange={(e) => onHasDependantsChange(e.target.value)}
            className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
      </div>

      {/* PR Tracking Card (SCR-041) */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
        <h2 className="text-base font-bold text-[#111827]">PR Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              ITA date
            </label>
            <input
              type="date"
              value={itaDate}
              onChange={(e) => onItaDateChange(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Deadline to Submit
            </label>
            <input
              type="date"
              value={deadlineSubmit}
              onChange={(e) => onDeadlineSubmitChange(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Notes
          </label>
          <textarea
            rows={4}
            value={prNotes}
            onChange={(e) => onPrNotesChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
          />
        </div>
      </div>
    </div>
  )
}
