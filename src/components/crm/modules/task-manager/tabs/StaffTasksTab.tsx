import React from 'react'
import { OfficeTask } from '@/types/crm'

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

        <select
          value={selectedManager}
          onChange={(e) => onManagerChange(e.target.value)}
          className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
        >
          <option value="All">All Case Managers ▾</option>
          <option value="Amanpreet">Amanpreet</option>
          <option value="Inderpreet">Inderpreet</option>
          <option value="Sukhman">Sukhman</option>
          <option value="Tejinder">Tejinder</option>
        </select>
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
                      <select
                        defaultValue="Pending"
                        onChange={(e) => {
                          if (e.target.value === 'Completed') {
                            onCompleteTask(tasks[0])
                          } else {
                            onChangeStatus(tasks[0]?.id || '1', e.target.value as any)
                          }
                        }}
                        className="bg-[#fff8ee] border border-[#fbd8ab] text-[#8a5327] rounded-md px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending ▾</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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
                      <select
                        defaultValue="Pending"
                        onChange={(e) => {
                          if (e.target.value === 'Completed') {
                            onCompleteTask(tasks[1])
                          } else {
                            onChangeStatus(tasks[1]?.id || '2', e.target.value as any)
                          }
                        }}
                        className="bg-[#fff8ee] border border-[#fbd8ab] text-[#8a5327] rounded-md px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending ▾</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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
                      <select
                        defaultValue="Pending"
                        onChange={(e) => {
                          if (e.target.value === 'Completed') {
                            onCompleteTask(tasks[2])
                          } else {
                            onChangeStatus(tasks[2]?.id || '3', e.target.value as any)
                          }
                        }}
                        className="bg-[#fff8ee] border border-[#fbd8ab] text-[#8a5327] rounded-md px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Pending">Pending ▾</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
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
