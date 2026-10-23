import React from 'react'
import { OfficeTask } from '@/types/crm'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface StaffTasksTabProps {
  subTab: 'Active Tasks' | 'Completed Tasks'
  onSubTabChange: (tab: 'Active Tasks' | 'Completed Tasks') => void
  selectedManager: string
  onManagerChange: (manager: string) => void
  tasks: OfficeTask[]
  onCompleteTask: (task: OfficeTask) => void
  onChangeStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void
}

export function StaffTasksTab({
  subTab,
  onSubTabChange,
  selectedManager,
  onManagerChange,
  tasks,
  onCompleteTask,
  onChangeStatus
}: StaffTasksTabProps) {
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
          Active Tasks <span className="ml-0.5">3</span>
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

      <div className="pt-2">
        <h2 className="text-sm font-bold text-[#1c2826]">
          {subTab === 'Completed Tasks' ? 'Completed Tasks (1)' : 'Today · Staff Assignments (3)'}
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">TASK DESCRIPTION</th>
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
                  <td className="py-3.5 px-4 font-bold text-[#1c2826]">10:00 a.m.</td>
                  <td className="py-3.5 px-4 font-bold text-[#1c2826]">Inderpreet / Internal</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">Quarterly file compliance audit</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">2026-10-21</td>
                  <td className="py-3.5 px-4 text-[#1c2826]">Managing Partner</td>
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
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">9:00 a.m.</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Aarav Sharma</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Review LMIA submission proof documents</td>
                    <td className="py-3.5 px-4 text-[#c53030] font-medium">2026-10-22</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Tejinder</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#fee2e2] text-[#b91c1c] rounded px-2.5 py-0.5 text-xs font-semibold">
                        Urgent
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
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">11:30 a.m.</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Mei Lin Chen</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Verify translation of PCC documents</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">2026-10-23</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
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
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">2:00 p.m.</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Office Internal</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Prepare monthly billable hours report</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">2026-10-25</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
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
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
