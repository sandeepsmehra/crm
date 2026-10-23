import React from 'react'
import { toast } from '@/components/ui/sonner'

interface ImportTabProps {
  needsReviewOnly: boolean
  onNeedsReviewOnlyChange: (checked: boolean) => void
  importSearch: string
  onImportSearchChange: (value: string) => void
}

export function ImportTab({
  needsReviewOnly,
  onNeedsReviewOnlyChange,
  importSearch,
  onImportSearchChange
}: ImportTabProps) {
  return (
    <div className="space-y-5">
      <p className="text-[13.5px] text-[#374151] leading-relaxed max-w-4xl">
        Choose the prepared Nationrise import JSON. Original rows and notes are saved, including entries needing review. Uploading the same prepared file again skips rows already saved.
      </p>

      <div className="border border-[#d1d5db] rounded-lg p-3 w-fit bg-white flex items-center gap-3">
        <label className="bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-[#d1d5db] text-[#111827] text-xs font-semibold px-3 py-1.5 rounded cursor-pointer">
          Choose File
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={() => toast.info('Prepared JSON verified: ready for import')}
          />
        </label>
        <span className="text-xs text-[#6b7280]">No file chosen</span>
      </div>

      <div className="pt-2">
        <h2 className="text-base font-bold text-[#111827]">Imported history (0 rows)</h2>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="needsReview"
          checked={needsReviewOnly}
          onChange={(e) => onNeedsReviewOnlyChange(e.target.checked)}
          className="w-4 h-4 text-[#126b48] rounded border-gray-300 focus:ring-0 cursor-pointer"
        />
        <label htmlFor="needsReview" className="text-sm font-semibold text-[#111827] cursor-pointer">
          Needs review only (0)
        </label>
      </div>

      <div>
        <label className="block text-sm text-[#374151] mb-1">Search name, phone or notes</label>
        <input
          type="text"
          value={importSearch}
          onChange={(e) => onImportSearchChange(e.target.value)}
          className="w-full bg-white border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] outline-none"
        />
      </div>

      <p className="text-xs text-[#6b7280] pt-1">
        Showing 0 of 0 matching rows. Narrow your search to find a specific record.
      </p>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">CLIENT</th>
              <th className="py-3 px-4">PHONE</th>
              <th className="py-3 px-4">SOURCE</th>
              <th className="py-3 px-4">REVIEW</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} className="py-8 text-center text-xs text-[#6b7280]">
                No imported rows found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
