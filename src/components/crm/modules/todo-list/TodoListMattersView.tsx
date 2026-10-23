import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface TodoListMattersViewProps {
  matters: Matter[]
  clients: Client[]
  staffList: string[]
  onOpenMatter: (matterId: string) => void
  onNewMatter: () => void
  onUpdateSubmissionDeadline: (matterId: string, deadline: string) => void
  onChangeStage: (matterId: string, stage: number, stageName?: string) => void
  onMoveInactive?: (matter: Matter) => void
}

export function TodoListMattersView({
  matters,
  onOpenMatter,
  onNewMatter
}: TodoListMattersViewProps) {
  const [activeTab, setActiveTab] = useState<
    'Retained' | 'Temporary' | 'PR' | 'LMIA' | 'Inactive' | 'Submitted' | 'Closed'
  >('Retained')

  // Closed files collapsible notes
  const [closedNote1Open, setClosedNote1Open] = useState(false)
  const [closedNote2Open, setClosedNote2Open] = useState(false)

  return (
    <div className="space-y-4">
      {/* Top Title & Primary Retained Tab matching SCR-028 & SCR-046 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826]">
            To-Do List
          </h1>
          <button
            onClick={() => setActiveTab('Retained')}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
              activeTab === 'Retained'
                ? 'bg-[#871c1c] text-white shadow-2xs'
                : 'bg-[#fee2e2] text-[#871c1c] hover:bg-[#fecaca]'
            }`}
          >
            Retained Clients (6)
          </button>
        </div>

        <button
          onClick={onNewMatter}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Create Application
        </button>
      </div>

      {/* Subtabs Row with authentic color tints matching SCR-028 & SCR-046 */}
      <div className="flex flex-wrap items-center gap-2 select-none pt-1">
        <button
          onClick={() => setActiveTab('Temporary')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'Temporary'
              ? 'bg-[#6b21a8] text-white border-2 border-[#581c87]'
              : 'bg-[#f3ebfc] border border-[#ebd9fb] text-[#6b21a8] hover:bg-[#ebe0f8]'
          }`}
        >
          Temporary Files (8)
        </button>

        <button
          onClick={() => setActiveTab('PR')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'PR'
              ? 'bg-[#0d7647] text-white border-2 border-[#095231]'
              : 'bg-[#e6f7ef] border border-[#bbf0d8] text-[#0d7647] hover:bg-[#d5f2e3]'
          }`}
        >
          PR Applications (7)
        </button>

        <button
          onClick={() => setActiveTab('LMIA')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'LMIA'
              ? 'bg-[#9a5518] text-white border-2 border-[#7c3d0b]'
              : 'bg-[#fef3e2] border border-[#fcdbb3] text-[#9a5518] hover:bg-[#fde8cb]'
          }`}
        >
          LMIA (3)
        </button>

        <button
          onClick={() => setActiveTab('Inactive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'Inactive'
              ? 'bg-[#855b14] text-white border-2 border-[#664309]'
              : 'bg-[#fef9e7] border border-[#fae8b1] text-[#855b14] hover:bg-[#fbf1cf]'
          }`}
        >
          Inactive Files (2)
        </button>

        <button
          onClick={() => setActiveTab('Submitted')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'Submitted'
              ? 'bg-[#1e538c] text-white border-2 border-[#153e6b]'
              : 'bg-[#edf5fd] border border-[#d0e4f7] text-[#1e538c] hover:bg-[#e0eefb]'
          }`}
        >
          Submitted (1)
        </button>

        <button
          onClick={() => setActiveTab('Closed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            activeTab === 'Closed'
              ? 'bg-[#edf1f7] border-2 border-[#1e3a5f] text-[#1e3a5f]'
              : 'bg-[#edf1f7] border border-[#d3deee] text-[#374d6d] hover:bg-[#e1e8f2]'
          }`}
        >
          Closed Files (2)
        </button>
      </div>

      {/* Subtitle description when Closed is active (SCR-046) */}
      {activeTab === 'Closed' && (
        <p className="text-xs text-[#6b7280]">
          Closed files appear here for 30 days after closing. They remain read-only in the client profile afterwards. Active reminders are paused until reopening.
        </p>
      )}

      {/* ======================================================== */}
      {/* CLOSED FILES VIEW (SCR-046)                              */}
      {/* ======================================================== */}
      {activeTab === 'Closed' ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">CLIENT</th>
                  <th className="py-3 px-4">APPLICATION</th>
                  <th className="py-3 px-4">CLOSING REASON</th>
                  <th className="py-3 px-4">CLOSED DATE</th>
                  <th className="py-3 px-4">CLOSED BY</th>
                  <th className="py-3 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {/* Row 1 (SCR-046) */}
                <tr className="hover:bg-[#fbfcfb]">
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-[#1c2826] text-sm">Amandeep Singh</div>
                    <div className="text-xs text-[#6b7280] mt-0.5">604-555-0101</div>
                  </td>
                  <td className="py-4 px-4 align-top text-[#1c2826] font-medium">TRV</td>
                  <td className="py-4 px-4 align-top text-[#1c2826]">
                    <div>Application approved by IRCC; work permit issued.</div>
                    <button
                      onClick={() => setClosedNote1Open(!closedNote1Open)}
                      className="flex items-center gap-1 text-xs font-bold text-[#111827] mt-1.5 hover:text-[#a75928] cursor-pointer"
                    >
                      {closedNote1Open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>Closing notes</span>
                    </button>
                    {closedNote1Open && (
                      <div className="mt-2 p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded text-xs text-[#4b5563]">
                        Final work permit dispatched to client Surrey address.
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top font-mono text-[#374151]">2026-10-22</td>
                  <td className="py-4 px-4 align-top text-[#1c2826]">Inderpreet</td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenMatter('DEMO-MAT-006')}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Open Application
                      </button>
                      <button
                        onClick={() => toast.success('Application reopened successfully')}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Reopen File
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2 (SCR-046) */}
                <tr className="hover:bg-[#fbfcfb]">
                  <td className="py-4 px-4 align-top">
                    <div className="font-bold text-[#1c2826] text-sm">Elena Petrova</div>
                    <div className="text-xs text-[#6b7280] mt-0.5">604-555-0211</div>
                  </td>
                  <td className="py-4 px-4 align-top text-[#1c2826] font-medium">TRV</td>
                  <td className="py-4 px-4 align-top text-[#1c2826]">
                    <div>Client withdrew (demo)</div>
                    <button
                      onClick={() => setClosedNote2Open(!closedNote2Open)}
                      className="flex items-center gap-1 text-xs font-bold text-[#111827] mt-1.5 hover:text-[#a75928] cursor-pointer"
                    >
                      {closedNote2Open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span>Closing notes</span>
                    </button>
                    {closedNote2Open && (
                      <div className="mt-2 p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded text-xs text-[#4b5563]">
                        Client elected to postpone submission until winter 2027.
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 align-top font-mono text-[#374151]">2026-10-18</td>
                  <td className="py-4 px-4 align-top text-[#1c2826]">Inderpreet</td>
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenMatter('DEMO-MAT-007')}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Open Application
                      </button>
                      <button
                        onClick={() => toast.success('Application reopened successfully')}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Reopen File
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* STANDARD RETAINED CLIENTS & TO-DO TABLE (SCR-028)        */
        /* ======================================================== */
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-14">NO.</th>
                  <th className="py-3 px-4">CLIENT</th>
                  <th className="py-3 px-4">APPLICATION</th>
                  <th className="py-3 px-4">DATE RETAINED</th>
                  <th className="py-3 px-4">CASE MANAGER</th>
                  <th className="py-3 px-4">OVERVIEW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {/* Row 1 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-002')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">1</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Mei Lin Chen</div>
                    <div className="text-xs text-[#6b7280]">604-555-0202</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">Spousal Sponsorship</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 8</td>
                  <td className="py-4 px-4 text-[#1c2826]">Unassigned</td>
                  <td className="py-4 px-4 text-[#1c2826]">Needs staff intake</td>
                </tr>

                {/* Row 2 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-001')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">2</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Gurdeep Singh</div>
                    <div className="text-xs text-[#6b7280]">604-555-0212</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">Work Permit</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 8</td>
                  <td className="py-4 px-4 text-[#1c2826]">Unassigned</td>
                  <td className="py-4 px-4 text-[#1c2826]">Needs staff intake</td>
                </tr>

                {/* Row 3 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-003')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">3</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Daniel Okafor</div>
                    <div className="text-xs text-[#6b7280]">604-555-0203</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">Work Permit</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 8</td>
                  <td className="py-4 px-4 text-[#1c2826]">Unassigned</td>
                  <td className="py-4 px-4 text-[#1c2826]">Needs staff intake</td>
                </tr>

                {/* Row 4 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-004')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">4</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Flow Test Alpha Renamed</div>
                    <div className="text-xs text-[#6b7280]">604-555-9201</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">TRV</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 19</td>
                  <td className="py-4 px-4 text-[#1c2826]">Not assigned</td>
                  <td className="py-4 px-4 text-[#1c2826]">Needs staff intake</td>
                </tr>

                {/* Row 5 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-005')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">5</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Flow Test Beta</div>
                    <div className="text-xs text-[#6b7280]">604-555-9202</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">Spousal Sponsorship</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 19</td>
                  <td className="py-4 px-4 text-[#1c2826]">Not assigned</td>
                  <td className="py-4 px-4 text-[#1c2826]">Needs staff intake</td>
                </tr>

                {/* Row 6 (SCR-028) */}
                <tr 
                  className="hover:bg-[#fbfcfb] cursor-pointer"
                  onClick={() => onOpenMatter('DEMO-MAT-006')}
                >
                  <td className="py-4 px-4 text-[#6b7280]">6</td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-[#1c2826]">Amandeep Singh</div>
                    <div className="text-xs text-[#6b7280]">604-555-0101</div>
                  </td>
                  <td className="py-4 px-4 text-[#1c2826]">Work Permit</td>
                  <td className="py-4 px-4 text-[#1c2826]">Oct 22</td>
                  <td className="py-4 px-4 text-[#1c2826]">Inderpreet</td>
                  <td className="py-4 px-4 text-[#1c2826]">
                    Inland work permit extension application tied to spousal sponsorship filing.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
