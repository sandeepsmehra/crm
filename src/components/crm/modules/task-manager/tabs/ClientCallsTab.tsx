import React from 'react'
import { OfficeTask } from '@/types/crm'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface ClientCallsTabProps {
  subTab: 'Active Tasks' | 'Completed Tasks'
  onSubTabChange: (tab: 'Active Tasks' | 'Completed Tasks') => void
  selectedManager: string
  onManagerChange: (manager: string) => void
  tasks: OfficeTask[]
  onCompleteTask: (task: OfficeTask) => void
  onChangeStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void
}

export function ClientCallsTab({
  subTab,
  onSubTabChange,
  selectedManager,
  onManagerChange,
  tasks,
  onCompleteTask,
  onChangeStatus
}: ClientCallsTabProps) {
  return (
    <div className="space-y-4">
      {/* Subfilter Row */}
      <div className="flex items-center gap-2 select-none">
        <button
          onClick={() => onSubTabChange('Active Tasks')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
            subTab === 'Active Tasks'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-[#f0f2f1] text-[#556860] hover:bg-[#e4e7e5]'
          }`}
        >
          Active Tasks <span className="ml-0.5">5</span>
        </button>
        <button
          onClick={() => onSubTabChange('Completed Tasks')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
            subTab === 'Completed Tasks'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-[#f0f2f1] text-[#556860] hover:bg-[#e4e7e5]'
          }`}
        >
          Completed Tasks <span className="ml-0.5">1</span>
        </button>

        <div className="w-48">
          <CustomSelect
            value={selectedManager}
            options={[
              { value: "All", label: "All Case Managers" },
              { value: "Amanpreet", label: "Amanpreet" },
              { value: "Inderpreet", label: "Inderpreet" },
              { value: "Sukhman", label: "Sukhman" },
              { value: "Tejinder", label: "Tejinder" }
            ]}
            onChange={(val) => onManagerChange(val)}
            triggerClassName="bg-[#ebf3fc] border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1 text-xs font-medium h-8"
          />
        </div>
      </div>

      {/* Section Title matching SCR-011 */}
      <div className="pt-2">
        <h2 className="text-sm font-bold text-[#1c2826]">
          {subTab === 'Completed Tasks' ? 'Completed Tasks (1)' : 'Today · 2026-10-22 (5)'}
        </h2>
      </div>

      {/* Tasks Table matching SCR-011 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">CONTACT INFO</th>
                <th className="py-3 px-4">ENQUIRY</th>
                <th className="py-3 px-4">DUE DATE</th>
                <th className="py-3 px-4">ASSIGNED BY</th>
                <th className="py-3 px-4">ASSIGNED TO</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {subTab === 'Completed Tasks' ? (
                <tr className="hover:bg-[#fbfcfb]">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1c2826]">11:00 a.m.</div>
                    <div className="text-xs text-[#6b7280]">Received 2026-10-20</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1c2826]">Sofia Rodriguez</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">604-555-0204</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">TRV document follow up completed</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">2026-10-21</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">Reception</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                      Normal
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#dcfce7] text-[#166534] rounded-md px-2.5 py-1 text-xs font-semibold">
                      Completed
                    </span>
                  </td>
                </tr>
              ) : (
                <>
                  {/* Row 1 (SCR-011) */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">9:30 a.m.</div>
                      <div className="text-xs text-[#6b7280]">Received 2026-10-14</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Mei Lin Chen</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">604-555-0202</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Mei Lin Chen called asking for a file update. Call back....</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#c53030]">2026-10-15</div>
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2 py-0.5 text-[11px] font-semibold mt-0.5 inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Reception</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={tasks[0]?.status || "Pending"}
                          options={["Pending", "In Progress", "Completed"]}
                          onChange={(val) => {
                            if (val === 'Completed') {
                              onCompleteTask(tasks[0])
                            } else {
                              onChangeStatus(tasks[0]?.id || '1', val as any)
                            }
                          }}
                          triggerClassName="bg-[#fff8ee] border-[#fbd8ab] text-[#8a5327] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 (SCR-011) */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">9:30 a.m.</div>
                      <div className="text-xs text-[#6b7280]">Received 2026-10-18</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Aarav Sharma</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">604-555-0201</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Aarav Sharma called asking for a file update. Call back....</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#c53030]">2026-10-18</div>
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2 py-0.5 text-[11px] font-semibold mt-0.5 inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Reception</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={tasks[1]?.status || "Pending"}
                          options={["Pending", "In Progress", "Completed"]}
                          onChange={(val) => {
                            if (val === 'Completed') {
                              onCompleteTask(tasks[1])
                            } else {
                              onChangeStatus(tasks[1]?.id || '2', val as any)
                            }
                          }}
                          triggerClassName="bg-[#fff8ee] border-[#fbd8ab] text-[#8a5327] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 (SCR-011) */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">1:15 p.m.</div>
                      <div className="text-xs text-[#6b7280]">Received 2026-10-18</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Grace Mensah</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">604-555-0215</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Grace Mensah called asking for a file update. Call back....</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#c53030]">2026-10-19</div>
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2 py-0.5 text-[11px] font-semibold mt-0.5 inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Reception</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={tasks[2]?.status || "Pending"}
                          options={["Pending", "In Progress", "Completed"]}
                          onChange={(val) => {
                            if (val === 'Completed') {
                              onCompleteTask(tasks[2])
                            } else {
                              onChangeStatus(tasks[2]?.id || '3', val as any)
                            }
                          }}
                          triggerClassName="bg-[#fff8ee] border-[#fbd8ab] text-[#8a5327] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 (SCR-011) */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">8:58 p.m.</div>
                      <div className="text-xs text-[#6b7280]">Received 2026-10-18</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Temp1</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">1234567891</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Do this please</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#c53030]">2026-10-18</div>
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2 py-0.5 text-[11px] font-semibold mt-0.5 inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={tasks[3]?.status || "Pending"}
                          options={["Pending", "In Progress", "Completed"]}
                          onChange={(val) => {
                            if (val === 'Completed') {
                              onCompleteTask(tasks[3])
                            } else {
                              onChangeStatus(tasks[3]?.id || '4', val as any)
                            }
                          }}
                          triggerClassName="bg-[#fff8ee] border-[#fbd8ab] text-[#8a5327] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 (SCR-011) */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">1:04 a.m.</div>
                      <div className="text-xs text-[#6b7280]">Received 2026-10-19</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Maple Ridge Farms Ltd.</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">604-555-0301</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Call HR back about wage table.</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#c53030]">2026-10-19</div>
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2 py-0.5 text-[11px] font-semibold mt-0.5 inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Tejinder</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#e6f4ea] text-[#137333] rounded px-2.5 py-0.5 text-xs font-medium">
                        Normal
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <CustomSelect
                          value={tasks[4]?.status || "Pending"}
                          options={["Pending", "In Progress", "Completed"]}
                          onChange={(val) => {
                            if (val === 'Completed') {
                              onCompleteTask(tasks[4])
                            } else {
                              onChangeStatus(tasks[4]?.id || '5', val as any)
                            }
                          }}
                          triggerClassName="bg-[#fff8ee] border-[#fbd8ab] text-[#8a5327] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
