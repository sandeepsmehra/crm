import React from 'react'

const DEV_GUIDE_ROWS = [
  {
    observed: 'Appointment sheet with weekday filters and client details',
    decision: 'Keep. Give it one dedicated Appointments page, default to whole week and retain notes, reference, confirmation and follow-up.'
  },
  {
    observed: 'Appointment board repeated on Dashboard and Appointments',
    decision: 'Simplify. Owner dashboard becomes operational priorities; show only a short today summary.'
  },
  {
    observed: 'Nine client sections: Overview, Consultation, Follow-Up, Appointments, Email History, Transcript, Documents, Notes, Activity',
    decision: 'Reduce to five matter sections. Put consultation in the client profile; combine email, calls, transcripts and notes in Communication & Notes.'
  },
  {
    observed: 'Personalized Document Required list, received/pending summary, internal notes and Prepared by',
    decision: 'Keep and strengthen. Use assigned case manager, linked requirements and distinct review/approval states.'
  },
  {
    observed: 'Verified Language Test and Passport uploads while matching requirements remained Pending',
    decision: 'Investigate linkage. A document approval must update its requirement in the same matter. Existing data may need reconciliation.'
  },
  {
    observed: 'Consultation records, case notes, audio and transcript entry points',
    decision: 'Keep useful capability. Make strategy available immediately; verify recording consent and client notifications.'
  }
]

export function DeveloperGuideTab() {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top banner callout matching SCR-056 */}
      <div className="bg-[#fffdfb] border-l-4 border-[#a75928] border border-[#e5e7eb] rounded-r-lg p-4 text-[13.5px] text-[#374151] leading-relaxed">
        <span className="font-bold text-[#111827]">Updated navigation:</span> Dashboard, Task Manager, Appointments, Clients, To-Do List, Settings. Task Manager handles staff-to-staff messages and completion. Appointments includes Service requested and Mark retained. To-Do List contains the seven retained-file columns requested.
      </div>

      {/* Heading */}
      <div>
        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
          REVIEW FINDINGS & INTERACTIVE REDESIGN
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] mt-1">
          Developer guide
        </h2>
      </div>

      {/* Card with Comparison Table matching SCR-056 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden p-6 space-y-4">
        <h3 className="text-lg font-bold text-[#111827]">
          Review of the original Nationrise CRM
        </h3>
        <p className="text-xs text-[#6b7280] leading-relaxed">
          Inspected signed-in manager screens on 7 October 2026: dashboard, appointments, client directory, a representative client profile, consultation, documents, intake and reports. No live records were changed. Features not seen are marked unverified rather than assumed absent.
        </p>

        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden mt-3">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-1/2">OBSERVED IN ORIGINAL CRM</th>
                <th className="py-3 px-4 w-1/2">DECISION FOR REDESIGN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {DEV_GUIDE_ROWS.map((row, i) => (
                <tr key={i} className="hover:bg-[#fbfcfb]">
                  <td className="py-4 px-4 text-[#111827] align-top leading-relaxed">
                    {row.observed}
                  </td>
                  <td className="py-4 px-4 text-[#374151] align-top leading-relaxed">
                    {row.decision}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
