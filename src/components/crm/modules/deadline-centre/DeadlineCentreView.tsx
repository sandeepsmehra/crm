import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { toast } from '@/components/ui/sonner'

interface DeadlineCentreViewProps {
  matters: Matter[]
  onOpenMatter: (matterId: string) => void
  onAddDeadline: () => void
  onAddGovtRequest: () => void
  onResolveDeadline: (matterId: string, index: number) => void
}

export function DeadlineCentreView({
  onAddDeadline,
  onOpenMatter
}: DeadlineCentreViewProps) {
  const [mainTab, setMainTab] = useState<'all' | 'pfls' | 'ircc'>('all')
  const [showResolved, setShowResolved] = useState(false)
  const [urgencyFilter, setUrgencyFilter] = useState('all')

  const handleRecordCompletion = (clientName: string) => {
    toast('Save the current changes before opening documents.')
  }

  return (
    <div className="space-y-4">
      {/* Eyebrow and Header matching SCR-050 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
            FILE DEADLINES AND GOVERNMENT REQUESTS
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
            Deadline Centre
          </h1>
        </div>

        <button
          onClick={onAddDeadline}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Add deadline / request
        </button>
      </div>

      {/* Main Tabs matching SCR-050 */}
      <div className="flex items-center gap-6 border-b border-[#e5e7eb] pb-2 text-sm select-none pt-1">
        <button
          onClick={() => setMainTab('all')}
          className={`pb-1.5 cursor-pointer transition-colors ${
            mainTab === 'all'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          All deadlines
        </button>
        <button
          onClick={() => setMainTab('pfls')}
          className={`pb-1.5 cursor-pointer transition-colors ${
            mainTab === 'pfls'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          PFLs
        </button>
        <button
          onClick={() => setMainTab('ircc')}
          className={`pb-1.5 cursor-pointer transition-colors ${
            mainTab === 'ircc'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          IRCC Document Requests
        </button>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 pt-1 select-none">
        <input
          type="checkbox"
          id="showResolved"
          checked={showResolved}
          onChange={(e) => setShowResolved(e.target.checked)}
          className="w-4 h-4 rounded border-[#d1d5db] text-[#126b48] focus:ring-[#126b48] cursor-pointer"
        />
        <label htmlFor="showResolved" className="text-xs text-[#1c2826] cursor-pointer">
          Show resolved deadlines
        </label>
      </div>

      {/* Urgency Tabs matching SCR-050 */}
      <div className="flex items-center gap-4 border-b border-[#e5e7eb] pb-2 overflow-x-auto scrollbar-none text-xs select-none">
        <button
          onClick={() => setUrgencyFilter('all')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            urgencyFilter === 'all'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          All (3)
        </button>
        <button
          onClick={() => setUrgencyFilter('overdue')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            urgencyFilter === 'overdue'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Overdue (0)
        </button>
        <button
          onClick={() => setUrgencyFilter('3days')}
          className="bg-[#fff5f5] text-[#dc2626] border border-[#fca5a5] rounded-md px-3 py-1 font-semibold text-xs cursor-pointer whitespace-nowrap"
        >
          Within 3 Days (1)
        </button>
        <button
          onClick={() => setUrgencyFilter('5days')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            urgencyFilter === '5days'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Within 5 Days (Week) (1)
        </button>
        <button
          onClick={() => setUrgencyFilter('10days')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            urgencyFilter === '10days'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Within 10 Days (2 Weeks) (1)
        </button>
        <button
          onClick={() => setUrgencyFilter('later')}
          className={`pb-1 cursor-pointer whitespace-nowrap ${
            urgencyFilter === 'later'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280]'
          }`}
        >
          Later (0)
        </button>
      </div>

      {/* Main Table matching SCR-050 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">CLIENT / FILE</th>
                <th className="py-3 px-4">REQUEST & EXPLANATION</th>
                <th className="py-3 px-4">RECEIVED</th>
                <th className="py-3 px-4">DEADLINE</th>
                <th className="py-3 px-4">ASSIGNED TO</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {/* Row 1 (SCR-050) */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-4 px-4 align-top">
                  <div className="font-bold text-[#1c2826]">Omar Siddiqui</div>
                  <div className="text-xs text-[#6b7280] mt-0.5">Express Entry PR Application</div>
                </td>
                <td className="py-4 px-4 align-top max-w-sm">
                  <div className="font-bold text-[#1c2826]">IRCC Document Requests</div>
                  <div className="text-xs text-[#1c2826] mt-0.5">Updated police certificate</div>
                  <div className="text-xs text-[#6b7280] mt-1.5">Fictional document request</div>
                  <div className="text-xs text-[#1c2826] mt-1">Required: Police certificate</div>
                  <div className="text-xs text-[#6b7280] mt-1">Source:</div>
                </td>
                <td className="py-4 px-4 align-top text-[#1c2826]">Oct 12</td>
                <td className="py-4 px-4 align-top">
                  <span className="bg-[#fce8e8] text-[#c53030] rounded px-2.5 py-0.5 text-xs font-semibold inline-block">
                    Oct 22
                  </span>
                  <div className="text-xs text-[#6b7280] mt-1">America/Vancouver</div>
                </td>
                <td className="py-4 px-4 align-top text-[#1c2826]">Amanpreet</td>
                <td className="py-4 px-4 align-top">
                  <span className="bg-[#fef3e2] text-[#9a5518] px-2.5 py-0.5 rounded text-xs font-medium">
                    Open
                  </span>
                </td>
                <td className="py-4 px-4 align-top">
                  <button
                    onClick={() => handleRecordCompletion('Omar Siddiqui')}
                    className="bg-white border border-[#d1d5db] px-3 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs whitespace-nowrap block"
                  >
                    Record completion
                  </button>
                </td>
              </tr>

              {/* Row 2 (SCR-050) */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-4 px-4 align-top">
                  <div className="font-bold text-[#1c2826]">Amandeep Singh</div>
                  <div className="text-xs text-[#6b7280] mt-0.5">Spousal Sponsorship</div>
                </td>
                <td className="py-4 px-4 align-top max-w-sm">
                  <div className="font-bold text-[#1c2826]">PFLs</div>
                  <div className="text-xs text-[#1c2826] mt-0.5">
                    Procedural Fairness response letter for relationship timeline
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1.5">
                    Provide joint lease agreement and statutory declarations.
                  </div>
                  <div className="text-xs text-[#1c2826] mt-1">
                    Required: Affidavits, photos, joint utility invoices
                  </div>
                  <div className="text-xs text-[#6b7280] mt-1">
                    Source: IRCC Portal Communication Letter
                  </div>
                </td>
                <td className="py-4 px-4 align-top text-[#6b7280]">—</td>
                <td className="py-4 px-4 align-top">
                  <span className="bg-[#fce8e8] text-[#c53030] rounded px-2.5 py-0.5 text-xs font-semibold inline-block">
                    Oct 27
                  </span>
                  <div className="text-xs text-[#6b7280] mt-1">16:00</div>
                  <div className="text-xs text-[#6b7280]">America/Vancouver</div>
                </td>
                <td className="py-4 px-4 align-top text-[#1c2826]">Inderpreet</td>
                <td className="py-4 px-4 align-top">
                  <span className="bg-[#fef3e2] text-[#9a5518] px-2.5 py-0.5 rounded text-xs font-medium">
                    Open
                  </span>
                </td>
                <td className="py-4 px-4 align-top">
                  <button
                    onClick={() => handleRecordCompletion('Amandeep Singh')}
                    className="bg-white border border-[#d1d5db] px-3 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs whitespace-nowrap block"
                  >
                    Record completion
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
