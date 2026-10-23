import React from 'react'

interface FileSubmissionDeadlinesTabProps {
  onNavigate: (view: any) => void
}

export function FileSubmissionDeadlinesTab({ onNavigate }: FileSubmissionDeadlinesTabProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[20px] font-bold text-[#1c2826]">File submission deadlines</h2>
        <p className="text-[13px] text-[#6b7280] mt-1">
          Overdue submissions and upcoming submissions for the next 10 calendar days. Each file appears once. Alerts use Vancouver calendar dates, including weekends.
        </p>
        <div className="mt-2 text-[13px] text-[#1c2826] font-medium">
          <button
            onClick={() => onNavigate('To-Do List')}
            className="hover:underline cursor-pointer"
          >
            Open To-Do List · View all deadlines, including overdue
          </button>
        </div>
      </div>

      {/* Card 1: Overdue (1) */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#b91c1c] p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1c2826]">
            Overdue <span className="text-[#6b7280] font-normal">(1)</span>
          </h3>
          <span className="text-xs text-[#6b7280]">Unsubmitted files stay visible beyond 10 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">SUBMISSION DEADLINE</th>
                <th className="py-2.5 px-4">DAYS OVERDUE</th>
                <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4 font-normal text-[#1c2826]">2026-10-16</td>
                <td className="py-3.5 px-4">
                  <span className="bg-[#fce8e8] text-[#c53030] rounded px-2.5 py-0.5 text-xs font-semibold">
                    6 days overdue
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Grace Mensah</div>
                  <div className="text-xs text-[#6b7280]">Work Permit</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 2: Within 3 Days (2) matching SCR-001 pink background */}
      <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#dc2626] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
              !
            </span>
            <span>Within 3 Days</span>
            <span className="text-[#dc2626] font-normal">(2)</span>
          </h3>
          <span className="text-xs text-[#6b7280]">Today–3 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">DUE DATE</th>
                <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                <th className="py-2.5 px-4">ACTION REQUIRED</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fee2e2]">
              <tr className="hover:bg-[#ffeded]">
                <td className="py-3.5 px-4">
                  <span className="bg-[#dc2626] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                    Oct 22
                  </span>
                  <div className="text-[#dc2626] text-xs font-bold mt-1">
                    Due today · File submission
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Omar Siddiqui</div>
                  <div className="text-xs text-[#6b7280]">Express Entry PR Application</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Submit Express Entry PR Application</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
              </tr>
              <tr className="hover:bg-[#ffeded]">
                <td className="py-3.5 px-4">
                  <span className="bg-[#dc2626] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                    Oct 23
                  </span>
                  <div className="text-[#dc2626] text-xs font-bold mt-1">
                    Due tomorrow · File submission
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Kenji Watanabe</div>
                  <div className="text-xs text-[#6b7280]">Work Permit</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Submit Work Permit</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Card 3: Within 5 Days (Week) (1) */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#d97706] p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#1c2826]">
            Within 5 Days (Week) <span className="text-[#6b7280] font-normal">(1)</span>
          </h3>
          <span className="text-xs text-[#6b7280]">4–5 days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-4">DUE DATE</th>
                <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                <th className="py-2.5 px-4">ACTION REQUIRED</th>
                <th className="py-2.5 px-4">CASE MANAGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              <tr className="hover:bg-[#fbfcfb]">
                <td className="py-3.5 px-4">
                  <span className="bg-[#d97706] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                    Oct 27
                  </span>
                  <div className="text-[#d97706] text-xs font-semibold mt-1">
                    Due in 5 days · File submission
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#1c2826]">Amandeep Singh</div>
                  <div className="text-xs text-[#6b7280]">Spousal Sponsorship</div>
                </td>
                <td className="py-3.5 px-4 text-[#1c2826]">Submit Spousal Sponsorship PR Application</td>
                <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
