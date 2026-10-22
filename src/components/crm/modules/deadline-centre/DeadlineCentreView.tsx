import React from 'react'
import { Matter } from '@/types/crm'
import { formatDueDate } from '@/lib/crmUtils'
import { Plus, AlertTriangle, Clock } from 'lucide-react'

interface DeadlineCentreViewProps {
  matters: Matter[]
  onOpenMatter: (matterId: string) => void
  onAddDeadline: () => void
  onAddGovtRequest: () => void
  onResolveDeadline: (matterId: string, index: number) => void
}

export function DeadlineCentreView({
  matters,
  onOpenMatter,
  onAddDeadline,
  onAddGovtRequest,
  onResolveDeadline
}: DeadlineCentreViewProps) {
  const allDeadlines = matters.flatMap((m) =>
    (m.deadlineItems || []).map((d, index) => ({
      ...d,
      matterId: m.id,
      matterName: m.name,
      matterType: m.type,
      owner: m.owner,
      itemIndex: index
    }))
  )

  const hardDeadlines = allDeadlines
    .filter((d) => d.kind === 'Hard Deadline' && d.status !== 'Resolved')
    .sort((a, b) => a.date.localeCompare(b.date))

  const internalTargets = allDeadlines
    .filter((d) => d.kind === 'Internal Target' && d.status !== 'Resolved')
    .sort((a, b) => a.date.localeCompare(b.date))

  const normalDeadlines = allDeadlines
    .filter((d) => d.kind === 'Normal Task Deadline' && d.status !== 'Resolved')
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Compliance & Time Limits · Practice Deadlines
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Deadline Centre
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Hard legal deadlines, internal management targets, and routine task follow-ups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAddGovtRequest}
            className="px-3.5 py-2 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded-md text-[13px] font-semibold text-[#202d2d] transition-colors"
          >
            + Government request
          </button>
          <button
            onClick={onAddDeadline}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add deadline</span>
          </button>
        </div>
      </div>

      {/* Note Notice */}
      <div className="p-4 bg-[#fff9ed] border-l-4 border-l-[#a7653b] rounded-r-lg border border-[#e8d5be] text-[13px] text-[#78522e]">
        <strong>Professional responsibility:</strong> In production practice, a licensed RCIC must verify the trigger date, statutory time limit, and time zone for every hard legal deadline.
      </div>

      {/* 1. Hard Deadlines Table */}
      <div className="bg-white border-2 border-[#ae4343]/30 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#fdf4f4] border-b border-[#f5d7d7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#ae4343]" />
            <h2 className="text-[16px] font-bold text-[#ae4343]">Hard Legal Deadlines</h2>
          </div>
          <span className="badge red font-bold">{hardDeadlines.length} Open</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[640px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase">
                <th className="py-2.5 px-4">Client / Matter</th>
                <th className="py-2.5 px-3">Deadline Action</th>
                <th className="py-2.5 px-3">Due Date & Time</th>
                <th className="py-2.5 px-3">Case Manager</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {hardDeadlines.map((d, i) => (
                <tr key={i} className="hover:bg-[#f8faf9]">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenMatter(d.matterId)}
                      className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline"
                    >
                      {d.matterName}
                    </button>
                    <div className="text-[11px] text-[#677472]">{d.matterId} · {d.matterType}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#202d2d]">{d.label}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="badge red font-bold">{formatDueDate(d.date)}</span>
                    <div className="text-[11px] text-[#677472] mt-0.5">
                      {d.time || '17:00'} · {d.zone || 'America/Vancouver'}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#12382e]">{d.owner}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onResolveDeadline(d.matterId, d.itemIndex)}
                      className="px-2.5 py-1 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded text-[12px] font-semibold text-[#202d2d]"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
              {hardDeadlines.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#677472]">
                    No open hard legal deadlines.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Internal Targets Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#fcf9f5] border-b border-[#edf0ee] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#a7653b]" />
            <h2 className="text-[16px] font-bold text-[#202d2d]">Internal Management Targets</h2>
          </div>
          <span className="badge amber font-bold">{internalTargets.length} Open</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[640px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase">
                <th className="py-2.5 px-4">Client / Matter</th>
                <th className="py-2.5 px-3">Target Description</th>
                <th className="py-2.5 px-3">Target Date</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {internalTargets.map((d, i) => (
                <tr key={i} className="hover:bg-[#f8faf9]">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenMatter(d.matterId)}
                      className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline"
                    >
                      {d.matterName}
                    </button>
                    <div className="text-[11px] text-[#677472]">{d.matterId} · {d.matterType}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#202d2d]">{d.label}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="badge amber font-bold">{formatDueDate(d.date)}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#12382e]">{d.owner}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onResolveDeadline(d.matterId, d.itemIndex)}
                      className="px-2.5 py-1 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded text-[12px] font-semibold text-[#202d2d]"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
              {internalTargets.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#677472]">
                    No open internal targets.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Normal Task Deadlines Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 bg-[#f4f7f6] border-b border-[#edf0ee] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#356c8d]" />
            <h2 className="text-[16px] font-bold text-[#202d2d]">Routine Task Deadlines</h2>
          </div>
          <span className="badge blue font-bold">{normalDeadlines.length} Open</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[640px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase">
                <th className="py-2.5 px-4">Client / Matter</th>
                <th className="py-2.5 px-3">Task Action</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {normalDeadlines.map((d, i) => (
                <tr key={i} className="hover:bg-[#f8faf9]">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onOpenMatter(d.matterId)}
                      className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline"
                    >
                      {d.matterName}
                    </button>
                    <div className="text-[11px] text-[#677472]">{d.matterId} · {d.matterType}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-[#202d2d]">{d.label}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="badge blue font-bold">{formatDueDate(d.date)}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[#12382e]">{d.owner}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onResolveDeadline(d.matterId, d.itemIndex)}
                      className="px-2.5 py-1 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded text-[12px] font-semibold text-[#202d2d]"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
              {normalDeadlines.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#677472]">
                    No routine task deadlines recorded.
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
