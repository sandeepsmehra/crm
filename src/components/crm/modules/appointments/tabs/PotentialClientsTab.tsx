import React from 'react'

interface PotentialClientsTabProps {
  onOpenPotentialAction: (clientName: string) => void
}

export function PotentialClientsTab({ onOpenPotentialAction }: PotentialClientsTabProps) {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#fef3e2] text-[#8a5327] text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">CLIENT</th>
                <th className="py-2.5 px-4">FOLLOW-UP</th>
                <th className="py-2.5 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {/* Row 1 matching SCR-018 */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4 font-bold text-[#1c2826]">Chloe Tremblay</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#f3f4f6] text-[#374151] rounded px-2.5 py-0.5 text-xs font-medium">
                    Oct 26
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onOpenPotentialAction('Chloe Tremblay')}
                    className="bg-[#fff8ee] border border-[#fed7aa] text-[#8a5327] rounded-md px-3 py-1 text-xs font-medium hover:bg-[#fde8cb] cursor-pointer shadow-2xs"
                  >
                    Action ▾
                  </button>
                </td>
              </tr>

              {/* Row 2 matching SCR-018 */}
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4 font-bold text-[#1c2826]">Harmanpreet Kaur</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#f3f4f6] text-[#374151] rounded px-2.5 py-0.5 text-xs font-medium">
                    Oct 30
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onOpenPotentialAction('Harmanpreet Kaur')}
                    className="bg-[#fff8ee] border border-[#fed7aa] text-[#8a5327] rounded-md px-3 py-1 text-xs font-medium hover:bg-[#fde8cb] cursor-pointer shadow-2xs"
                  >
                    Action ▾
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
