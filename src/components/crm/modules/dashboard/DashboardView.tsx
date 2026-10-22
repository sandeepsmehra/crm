import React from 'react'
import { Matter, Appointment, PFLRecord, OfficeTask } from '@/types/crm'
import { 
  formatDueDate, 
  isOverdue, 
  isStalled, 
  hasHardDeadlineSoon, 
  getBusinessDaysOverdue,
  getHealthStatus
} from '@/lib/crmUtils'
import { 
  AlertTriangle, 
  Calendar, 
  CheckSquare, 
  Clock, 
  FileText, 
  ArrowRight,
  Plus
} from 'lucide-react'

interface DashboardViewProps {
  matters: Matter[]
  appointments: Appointment[]
  officeTasks: OfficeTask[]
  pflRecords: PFLRecord[]
  staffList: string[]
  onOpenMatter: (matterId: string) => void
  onNavigate: (view: any, filter?: string) => void
  onNewMatter: () => void
  onNewPfl: () => void
}

export function DashboardView({
  matters,
  appointments,
  officeTasks,
  pflRecords,
  staffList,
  onOpenMatter,
  onNavigate,
  onNewMatter,
  onNewPfl
}: DashboardViewProps) {
  const hardSoonCount = matters.filter((m) => hasHardDeadlineSoon(m)).length
  const overdueCount = matters.filter((m) => isOverdue(m)).length
  const reviewCount = matters.filter((m) => m.stage === 3).length
  const clientWaitingCount = matters.filter((m) => m.ball === 'Client' && m.stage < 6).length
  const staffWorkingCount = matters.filter((m) => m.ball === 'Case Manager' && m.stage < 5).length
  const readyCount = matters.filter((m) => m.stage === 4 && m.ready).length
  const stalledCount = matters.filter((m) => isStalled(m)).length
  const openTasksDueToday = officeTasks.filter((t) => t.status !== 'Completed' && t.due <= '2026-10-07').length

  const priorityMatters = matters.filter(
    (m) => isOverdue(m) || hasHardDeadlineSoon(m) || isStalled(m) || m.stage === 3
  )

  const todayAppointments = appointments.filter((a) => a.date === '2026-10-07')

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Owner Workspace · 7 October 2026
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            What needs attention today?
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Focus on files that need a decision, hard deadlines, and staff actions today.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('Deadline Centre')}
            className="px-3.5 py-2 bg-white hover:bg-[#edf2ef] border border-[#dfe5e3] rounded-md text-[13px] font-semibold text-[#202d2d] transition-colors shadow-2xs"
          >
            Deadline Centre
          </button>
          <button
            onClick={onNewMatter}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Open matter</span>
          </button>
        </div>
      </div>

      {/* Metric Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-3.5">
        <button
          onClick={() => onNavigate('Deadline Centre')}
          className="stat-card border-l-4 border-l-[#ae4343] cursor-pointer hover:bg-white"
        >
          <span className="label flex items-center justify-between">
            <span>Critical deadlines</span>
            <AlertTriangle className="w-4 h-4 text-[#ae4343]" />
          </span>
          <span className="num text-[#ae4343]">{hardSoonCount}</span>
          <span className="foot">
            {hardSoonCount > 0 ? (
              <span className="badge red">Next 7 days</span>
            ) : (
              <span className="text-[#677472]">No hard deadlines</span>
            )}
          </span>
        </button>

        <button
          onClick={() => onNavigate('To-Do List', 'Overdue')}
          className="stat-card border-l-4 border-l-[#ae4343] cursor-pointer hover:bg-white"
        >
          <span className="label flex items-center justify-between">
            <span>Overdue staff work</span>
            <Clock className="w-4 h-4 text-[#ae4343]" />
          </span>
          <span className="num text-[#ae4343]">{overdueCount}</span>
          <span className="foot">
            <span className="badge red">{overdueCount} needs action</span>
          </span>
        </button>

        <button
          onClick={() => onNavigate('To-Do List', 'RCIC')}
          className="stat-card border-l-4 border-l-[#7359a6] cursor-pointer hover:bg-white"
        >
          <span className="label flex items-center justify-between">
            <span>Waiting for my review</span>
            <FileText className="w-4 h-4 text-[#7359a6]" />
          </span>
          <span className="num text-[#7359a6]">{reviewCount}</span>
          <span className="foot">
            <span className="badge purple">RCIC review queue</span>
          </span>
        </button>

        <button
          onClick={() => onNavigate('Task Manager')}
          className="stat-card border-l-4 border-l-[#246b54] cursor-pointer hover:bg-white"
        >
          <span className="label flex items-center justify-between">
            <span>Tasks due today / overdue</span>
            <CheckSquare className="w-4 h-4 text-[#246b54]" />
          </span>
          <span className="num text-[#246b54]">{openTasksDueToday}</span>
          <span className="foot">
            <span className="badge green">Office action items</span>
          </span>
        </button>
      </div>

      {/* Secondary status tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
        <button
          onClick={() => onNavigate('To-Do List', 'Client')}
          className="p-3 bg-white border border-[#dfe5e3] rounded-lg text-left hover:border-[#a7653b] transition-all"
        >
          <div className="text-[#677472] text-[11px] font-semibold uppercase tracking-wider">With Client</div>
          <div className="text-xl font-bold text-[#976314] mt-0.5">{clientWaitingCount}</div>
          <div className="text-[11px] text-[#677472]">Awaiting documents</div>
        </button>
        <button
          onClick={() => onNavigate('To-Do List', 'Case Manager')}
          className="p-3 bg-white border border-[#dfe5e3] rounded-lg text-left hover:border-[#a7653b] transition-all"
        >
          <div className="text-[#677472] text-[11px] font-semibold uppercase tracking-wider">Staff Working</div>
          <div className="text-xl font-bold text-[#356c8d] mt-0.5">{staffWorkingCount}</div>
          <div className="text-[11px] text-[#677472]">Under preparation</div>
        </button>
        <button
          onClick={() => onNavigate('To-Do List', 'Ready')}
          className="p-3 bg-white border border-[#dfe5e3] rounded-lg text-left hover:border-[#a7653b] transition-all"
        >
          <div className="text-[#677472] text-[11px] font-semibold uppercase tracking-wider">Ready to Submit</div>
          <div className="text-xl font-bold text-[#246b54] mt-0.5">{readyCount}</div>
          <div className="text-[11px] text-[#677472]">Final checks verified</div>
        </button>
        <button
          onClick={() => onNavigate('To-Do List', 'Stalled')}
          className="p-3 bg-white border border-[#dfe5e3] rounded-lg text-left hover:border-[#a7653b] transition-all"
        >
          <div className="text-[#677472] text-[11px] font-semibold uppercase tracking-wider">Stalled Files</div>
          <div className="text-xl font-bold text-[#ae4343] mt-0.5">{stalledCount}</div>
          <div className="text-[11px] text-[#677472]">5+ days without activity</div>
        </button>
      </div>

      {/* Priority Work Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#edf0ee] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[17px] font-bold text-[#202d2d]">Priority Work Needing Decisions</h2>
            <span className="badge amber">Immediate Attention</span>
          </div>
          <button
            onClick={() => onNavigate('To-Do List')}
            className="text-[13px] font-semibold text-[#a7653b] hover:text-[#804822] flex items-center gap-1"
          >
            <span>View all retained files</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase tracking-wider">
                <th className="py-3 px-4">Client / Matter</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3">Action Holder</th>
                <th className="py-3 px-4">Next Action</th>
                <th className="py-3 px-3">Due / Delay</th>
                <th className="py-3 px-3">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {priorityMatters.map((m) => {
                const overdue = isOverdue(m)
                const delay = getBusinessDaysOverdue(m.due)
                const health = getHealthStatus(m)
                return (
                  <tr key={m.id} className="hover:bg-[#f8faf9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          health.colorClass === 'red' ? 'bg-red-500' : health.colorClass === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        <button
                          onClick={() => onOpenMatter(m.id)}
                          className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline text-left block"
                        >
                          {m.name}
                        </button>
                      </div>
                      <div className="text-[11.5px] text-[#677472] ml-4">
                        {m.id} · {m.type}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`badge ${m.stage === 3 ? 'purple' : ''}`}>
                        Stage {m.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`badge ${
                          m.ball === 'Client'
                            ? 'amber'
                            : m.ball === 'RCIC'
                            ? 'purple'
                            : m.ball === 'Government'
                            ? 'blue'
                            : ''
                        }`}
                      >
                        {m.ball}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-[#202d2d] truncate font-medium">
                      {m.next}
                      {m.hard && (
                        <div className="text-[11px] text-[#ae4343] font-semibold mt-0.5">
                          Hard deadline: {formatDueDate(m.hard)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {overdue ? (
                        <span className="badge red">
                          {formatDueDate(m.due)} ({delay}d overdue)
                        </span>
                      ) : (
                        <span className="text-[#677472]">{formatDueDate(m.due)}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-[#202d2d] font-medium">{m.owner}</td>
                  </tr>
                )
              })}
              {priorityMatters.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#677472]">
                    No urgent matters requiring decisions right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Staff Workload & Today's Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Workload */}
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16.5px] font-bold text-[#202d2d]">Staff Workload & Open Tasks</h2>
            <button
              onClick={() => onNavigate('Task Manager')}
              className="text-[12.5px] text-[#a7653b] hover:underline font-semibold"
            >
              Task Manager
            </button>
          </div>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase">
                <th className="pb-2.5">Case Manager</th>
                <th className="pb-2.5 text-center">Open Tasks</th>
                <th className="pb-2.5 text-center">Active Matters</th>
                <th className="pb-2.5 text-center">Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {staffList.map((staffName) => {
                const assignedMatters = matters.filter((m) => m.owner === staffName && m.stage < 6)
                const openTasksCount = assignedMatters.reduce(
                  (acc, m) => acc + m.tasks.filter((t) => !t.done).length,
                  0
                )
                const overdueMatters = assignedMatters.filter((m) => isOverdue(m)).length

                return (
                  <tr key={staffName} className="hover:bg-[#f8faf9]">
                    <td className="py-2.5 flex items-center gap-2.5 font-semibold text-[#12382e]">
                      <div className="w-6 h-6 rounded-full bg-[#e9dace] text-[#815535] text-[10px] font-bold flex items-center justify-center">
                        {staffName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{staffName}</span>
                    </td>
                    <td className="py-2.5 text-center font-mono font-semibold">{openTasksCount}</td>
                    <td className="py-2.5 text-center font-mono">{assignedMatters.length}</td>
                    <td className="py-2.5 text-center">
                      {overdueMatters > 0 ? (
                        <span className="badge red">{overdueMatters}</span>
                      ) : (
                        <span className="text-[#8ba79b]">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#246b54]" />
              <h2 className="text-[16.5px] font-bold text-[#202d2d]">Today’s Consultations & Visits</h2>
            </div>
            <button
              onClick={() => onNavigate('Appointments')}
              className="text-[12.5px] text-[#a7653b] hover:underline font-semibold"
            >
              Weekly sheet
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAppointments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-2.5 bg-[#f8faf9] border border-[#edf0ee] rounded-lg text-[13px]"
              >
                <div>
                  <div className="font-bold text-[#12382e]">
                    {a.time} · {a.client}
                  </div>
                  <div className="text-[11.5px] text-[#677472] truncate max-w-xs">{a.notes}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge blue">{a.service}</span>
                  <span
                    className={`badge ${
                      a.status === 'Completed' || a.status === 'Confirmed'
                        ? 'green'
                        : a.status === 'Waiting'
                        ? 'amber'
                        : ''
                    }`}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
            {todayAppointments.length === 0 && (
              <p className="text-center text-[#677472] py-6 text-[13px]">
                No appointments booked for today.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* PFL & Government Request Letters Section */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#202d2d]">
              PFL & Government Request Letters
            </h2>
            <p className="text-[12.5px] text-[#677472]">
              Track critical procedural fairness letters and time-limited document requests.
            </p>
          </div>
          <button
            onClick={onNewPfl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md text-[12.5px] font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add PFL / Request</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[760px]">
            <thead>
              <tr className="bg-[#fff1d6] text-[#76501d] text-[11px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">File / Client</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-4">Action Required</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3">Case Manager</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {pflRecords.map((pfl) => (
                <tr key={pfl.id} className="hover:bg-[#fafbf9]">
                  <td className="py-2.5 px-3 font-semibold text-[#12382e]">
                    <div>{pfl.clientName}</div>
                    <div className="text-[11px] text-[#677472]">{pfl.fileNumber} · {pfl.applicationType}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="badge amber">{pfl.category}</span>
                  </td>
                  <td className="py-2.5 px-4 max-w-sm text-[#202d2d] truncate">
                    {pfl.actionRequired}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="badge red font-bold">
                      {formatDueDate(pfl.deadline)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium">{pfl.owner}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="badge green">{pfl.status}</span>
                  </td>
                </tr>
              ))}
              {pflRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-[#677472]">
                    No active procedural fairness letters.
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
