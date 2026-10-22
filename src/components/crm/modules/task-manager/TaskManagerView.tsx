import React, { useState } from 'react'
import { OfficeTask, Client } from '@/types/crm'
import { formatDueDate } from '@/lib/crmUtils'
import { Plus, CheckCircle, Search, Filter } from 'lucide-react'

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
  staffList,
  onAssignTask,
  onCompleteTask,
  onReassignTask,
  onChangeStatus,
  onOpenClient
}: TaskManagerViewProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Client Calls' | 'Staff Tasks' | 'Waiting 3+ Days' | 'Completed'>('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const allAssignees = ['All', 'Reception', 'Tejinder', ...staffList]

  const filteredTasks = tasks.filter((t) => {
    // Tab filter
    if (activeTab === 'Client Calls' && (t.taskCategory !== 'Client Calls' || t.status === 'Completed')) return false
    if (activeTab === 'Staff Tasks' && (t.taskCategory !== 'Staff Tasks' || t.status === 'Completed')) return false
    if (activeTab === 'Completed' && t.status !== 'Completed') return false
    if (activeTab === 'Waiting 3+ Days') {
      if (t.status === 'Completed') return false
      // Created on or before 2026-10-04 (3+ days relative to 2026-10-07)
      if (t.date > '2026-10-04') return false
    }
    if (activeTab === 'All' && t.status === 'Completed') return false

    // Assignee filter
    if (assigneeFilter !== 'All' && t.assignedTo !== assigneeFilter) return false

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const clientName = t.clientName || clients.find((c) => c.id === t.client)?.name || ''
      const matches =
        t.text.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.assignedBy.toLowerCase().includes(q) ||
        clientName.toLowerCase().includes(q)
      if (!matches) return false
    }

    return true
  })

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Case Operations · Task Dispatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Task Manager
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Assign telephone enquiries, internal staff tasks, and track completed work.
          </p>
        </div>

        <button
          onClick={onAssignTask}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign task</span>
        </button>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 border border-[#dfe5e3] rounded-xl shadow-2xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {(['All', 'Client Calls', 'Staff Tasks', 'Waiting 3+ Days', 'Completed'] as const).map((tab) => {
            const isActive = activeTab === tab
            const count = tasks.filter((t) => {
              if (tab === 'All') return t.status !== 'Completed'
              if (tab === 'Client Calls') return t.taskCategory === 'Client Calls' && t.status !== 'Completed'
              if (tab === 'Staff Tasks') return t.taskCategory === 'Staff Tasks' && t.status !== 'Completed'
              if (tab === 'Waiting 3+ Days') return t.status !== 'Completed' && t.date <= '2026-10-04'
              return t.status === 'Completed'
            }).length

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#12382e] text-white font-semibold shadow-xs'
                    : 'text-[#677472] hover:bg-[#edf2ef] hover:text-[#202d2d]'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#e5ebe7] text-[#52625a]'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Assignee Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#8a9895] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#f4f6f5] border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] focus:border-[#246b54] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[13px] text-[#677472] whitespace-nowrap">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="py-1.5 px-2 bg-white border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] outline-none"
            >
              {allAssignees.map((person) => (
                <option key={person} value={person}>
                  {person === 'All' ? 'All assignees' : person}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Office Tasks Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse min-w-[840px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase tracking-wider">
                <th className="py-3 px-3 w-28">Received</th>
                <th className="py-3 px-4 min-w-[260px]">Task / Client Message</th>
                <th className="py-3 px-3 w-32">Assigned By</th>
                <th className="py-3 px-3 w-40">Assigned To</th>
                <th className="py-3 px-3 w-24">Due</th>
                <th className="py-3 px-3 w-32">Status</th>
                <th className="py-3 px-3 w-28 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {filteredTasks.map((t) => {
                const isOverdue = Boolean(t.due && t.due < '2026-10-07' && t.status !== 'Completed')
                const client = clients.find((c) => c.id === t.client)

                return (
                  <tr key={t.id} className="hover:bg-[#f8faf9] transition-colors">
                    <td className="py-3 px-3 align-top whitespace-nowrap text-[#677472]">
                      <div className="font-semibold text-[#202d2d]">{formatDueDate(t.date)}</div>
                      <div className="text-[11px] text-[#8a9895]">{t.time}</div>
                    </td>

                    <td className="py-3 px-4 align-top">
                      <div className="font-medium text-[#202d2d] leading-snug">{t.text}</div>

                      {client && (
                        <div className="mt-1 flex items-center gap-1.5 text-[11.5px]">
                          <button
                            onClick={() => onOpenClient && onOpenClient(client.id)}
                            className="font-semibold text-[#246b54] hover:underline"
                          >
                            {client.name}
                          </button>
                          <span className="text-[#8a9895]">·</span>
                          <span className="text-[#677472]">{client.phone}</span>
                        </div>
                      )}

                      {t.result && (
                        <div className="mt-1.5 p-2 bg-[#edf6f0] border border-[#cbe4d4] rounded text-[12px] text-[#245942] leading-tight">
                          <span className="font-bold">Result: </span>
                          {t.result}
                        </div>
                      )}

                      {t.completedAt && (
                        <div className="text-[11px] text-[#677472] mt-0.5">
                          Completed: {t.completedAt}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 align-top whitespace-nowrap font-medium text-[#677472]">
                      {t.assignedBy}
                    </td>

                    <td className="py-3 px-3 align-top">
                      <select
                        value={t.assignedTo}
                        onChange={(e) => onReassignTask(t.id, e.target.value)}
                        className="w-full py-1 px-2 border border-[#cbd5d1] rounded text-[12.5px] bg-white font-medium text-[#202d2d] outline-none focus:border-[#246b54]"
                      >
                        {['Reception', 'Tejinder', ...staffList].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      {isOverdue ? (
                        <span className="badge red font-bold">{formatDueDate(t.due)}</span>
                      ) : (
                        <span className="text-[#202d2d] font-medium">{formatDueDate(t.due)}</span>
                      )}
                    </td>

                    <td className="py-3 px-3 align-top">
                      <select
                        value={t.status}
                        onChange={(e) => onChangeStatus(t.id, e.target.value as any)}
                        className={`w-full py-1 px-2 border rounded text-[12px] font-semibold outline-none ${
                          t.status === 'Completed'
                            ? 'bg-[#e8f3ed] border-[#b9dfbf] text-[#176328]'
                            : t.status === 'In Progress'
                            ? 'bg-[#eaf2f7] border-[#bdd5e3] text-[#356c8d]'
                            : 'bg-[#faf0dc] border-[#e9cb8d] text-[#976314]'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 align-top text-right">
                      {t.status === 'Completed' ? (
                        <button
                          onClick={() => onChangeStatus(t.id, 'Pending')}
                          className="text-[12px] text-[#677472] hover:text-[#202d2d] underline font-medium"
                        >
                          Reopen
                        </button>
                      ) : (
                        <button
                          onClick={() => onCompleteTask(t)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#246b54] hover:bg-[#1a503e] text-white rounded text-[12px] font-semibold transition-colors ml-auto shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}

              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#677472]">
                    No office tasks found matching your filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
