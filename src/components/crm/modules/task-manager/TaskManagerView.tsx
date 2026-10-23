import React, { useState } from 'react'
import { OfficeTask, Client } from '@/types/crm'
import { toast } from '@/components/ui/sonner'

interface TaskManagerViewProps {
  tasks: OfficeTask[]
  clients: Client[]
  staffList: string[]
  onAssignTask: () => void
  onCompleteTask: (task: OfficeTask) => void
  onReassignTask: (taskId: string, newAssignee: string) => void
  onChangeStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void
  onOpenClient?: (clientId: string) => void
}

export function TaskManagerView({
  tasks,
  clients,
  onAssignTask,
  onCompleteTask,
  onChangeStatus
}: TaskManagerViewProps) {
  const [mainTab, setMainTab] = useState<'Client Calls' | 'Staff Tasks' | 'Reminders'>('Client Calls')
  const [subTab, setSubTab] = useState<'Active Tasks' | 'Completed Tasks'>('Active Tasks')
  const [selectedManager, setSelectedManager] = useState<string>('All')

  return (
    <div className="space-y-5">
      {/* Eyebrow & Header matching SCR-011 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
            CALLS, ASSIGNMENTS AND FOLLOW-UPS IN ONE PLACE
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
            Task Manager
          </h1>
        </div>

        <button
          onClick={onAssignTask}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Assign Task
        </button>
      </div>

      {/* Main Tabs matching SCR-011 (Client Calls 5, Staff Tasks 3, Reminders 5) */}
      <div className="flex items-center gap-6 border-b border-[#e5e7eb] pb-2 text-sm select-none">
        <button
          onClick={() => {
            setMainTab('Client Calls')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Client Calls'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Client Calls</span>
          <span className="text-xs text-[#6b7280]">5</span>
        </button>

        <button
          onClick={() => {
            setMainTab('Staff Tasks')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Staff Tasks'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Staff Tasks</span>
          <span className="text-xs text-[#6b7280]">3</span>
        </button>

        <button
          onClick={() => {
            setMainTab('Reminders')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Reminders'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Reminders</span>
          <span className="text-xs text-[#6b7280]">5</span>
        </button>
      </div>

      {/* Filter Row matching SCR-011 and SCR-014 */}
      <div className="flex items-center gap-2 pt-1 select-none">
        {mainTab === 'Reminders' ? (
          <button className="bg-[#1f2d29] text-white px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer">
            Calls waiting 3+ days <span className="ml-1">5</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => setSubTab('Active Tasks')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                subTab === 'Active Tasks'
                  ? 'bg-[#1f2d29] text-white'
                  : 'bg-[#f0f2f1] text-[#556860] hover:bg-[#e4e7e5]'
              }`}
            >
              Active Tasks <span className="ml-0.5">{mainTab === 'Staff Tasks' ? '3' : '5'}</span>
            </button>
            <button
              onClick={() => setSubTab('Completed Tasks')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                subTab === 'Completed Tasks'
                  ? 'bg-[#1f2d29] text-white'
                  : 'bg-[#f0f2f1] text-[#556860] hover:bg-[#e4e7e5]'
              }`}
            >
              Completed Tasks <span className="ml-0.5">1</span>
            </button>
          </>
        )}

        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
          className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
        >
          <option value="All">All Case Managers ▾</option>
          <option value="Amanpreet">Amanpreet</option>
          <option value="Inderpreet">Inderpreet</option>
          <option value="Sukhman">Sukhman</option>
          <option value="Tejinder">Tejinder</option>
        </select>
      </div>

      {/* Section Title matching SCR-011 */}
      <div className="pt-2">
        <h2 className="text-sm font-bold text-[#1c2826]">
          {subTab === 'Completed Tasks' ? 'Completed Tasks (1)' : 'Today · 2026-10-22 (5)'}
        </h2>
      </div>

      {/* Tasks Table matching SCR-011 and SCR-014 */}
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
                      <select
                        defaultValue="Pending"
                        onChange={(e) => {
                          if (e.target.value === 'Completed') {
                            onCompleteTask(tasks[3])
                          } else {
                            onChangeStatus(tasks[3]?.id || '4', e.target.value as any)
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
                      <select
                        defaultValue="Pending"
                        onChange={(e) => {
                          if (e.target.value === 'Completed') {
                            onCompleteTask(tasks[4])
                          } else {
                            onChangeStatus(tasks[4]?.id || '5', e.target.value as any)
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
