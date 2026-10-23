import React from 'react'

interface PflTabProps {
  pflTab: 'Open' | 'Completed'
  onTabChange: (tab: 'Open' | 'Completed') => void
  onCreatePfl: () => void
  onOpenMatter: (matterId: string) => void
}

export function PflTab({
  pflTab,
  onTabChange,
  onCreatePfl,
  onOpenMatter
}: PflTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1c2826]">PFL / Request Letters</h2>
        <button
          onClick={onCreatePfl}
          className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          + Create a PFL / Request
        </button>
      </div>

      {/* Subtabs with Terracotta underline */}
      <div className="flex items-center gap-6 border-b border-[#e5e7eb] pb-2">
        <button
          onClick={() => onTabChange('Open')}
          className={`text-sm pb-1.5 cursor-pointer transition-colors ${
            pflTab === 'Open'
              ? 'border-b-2 border-b-[#a75928] text-[#1c2826] font-semibold'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          Open Requests (3)
        </button>
        <button
          onClick={() => onTabChange('Completed')}
          className={`text-sm pb-1.5 cursor-pointer transition-colors ${
            pflTab === 'Completed'
              ? 'border-b-2 border-b-[#a75928] text-[#1c2826] font-semibold'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          Completed (0)
        </button>
      </div>

      <div className="pt-2">
        <h3 className="text-base font-bold text-[#1c2826]">Open requests (3)</h3>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Nearest deadline first · Countdown updates daily
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Request</th>
                <th className="py-3 px-4">Case Manager</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Days Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {/* Row 1 matching SCR-005 */}
              <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-002')}>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Omar Siddiqui →</div>
                  <div className="text-xs text-[#6b7280]">File: DEMO-E654321</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Express Entry PR Application</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Documents Requested</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                <td className="py-3.5 px-4 text-[#1c2826]">2026-10-22</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#b91c1c] text-white rounded-full px-3 py-1 text-xs font-semibold">
                    Due today
                  </span>
                </td>
              </tr>

              {/* Row 2 matching SCR-005 */}
              <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-001')}>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Amandeep Singh →</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Spousal Sponsorship</td>
                <td className="py-3.5 px-4 text-[#1c2826]">PFL</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                <td className="py-3.5 px-4 text-[#1c2826]">2026-10-27</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#b91c1c] text-white rounded-full px-3 py-1 text-xs font-semibold">
                    5 days left
                  </span>
                </td>
              </tr>

              {/* Row 3 matching SCR-005 */}
              <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-003')}>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Lucas Martin →</div>
                  <div className="text-xs text-[#6b7280]">File: DEMO-W123456</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">PRRA</td>
                <td className="py-3.5 px-4 text-[#1c2826]">PFL</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                <td className="py-3.5 px-4 text-[#1c2826]">2026-10-30</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#eab308] text-white rounded-full px-3 py-1 text-xs font-semibold">
                    8 days left
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[#6b7280]">
        Click a client name to open, edit or complete the request.
      </p>
    </div>
  )
}
