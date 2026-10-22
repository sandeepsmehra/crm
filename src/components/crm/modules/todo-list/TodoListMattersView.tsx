import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { formatDueDate } from '@/lib/crmUtils'
import { Plus, Search, Filter, AlertCircle, ArrowUpRight } from 'lucide-react'

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
  clients,
  staffList,
  onOpenMatter,
  onNewMatter,
  onUpdateSubmissionDeadline,
  onChangeStage,
  onMoveInactive
}: TodoListMattersViewProps) {
  const [activeTab, setActiveTab] = useState<
    'Retained' | 'Temporary' | 'PR' | 'LMIA' | 'Inactive' | 'Submitted' | 'Closed' | 'All'
  >('All')
  const [ownerFilter, setOwnerFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // PR Types check
  const isPRType = (type: string) => {
    return [
      'Spousal Sponsorship',
      'Common-law Sponsorship',
      'Express Entry',
      'PRRA',
      'RAD',
      'H&C',
      'Refugee',
      'PNP',
      'Citizenship'
    ].includes(type)
  }

  const filteredMatters = matters.filter((m) => {
    // Tab filter
    if (activeTab === 'Retained' && (!m.retained || m.stage >= 6)) return false
    if (activeTab === 'Temporary' && (isPRType(m.type) || m.type === 'LMIA' || m.stage >= 5)) return false
    if (activeTab === 'PR' && (!isPRType(m.type) || m.stage >= 5)) return false
    if (activeTab === 'LMIA' && m.type !== 'LMIA') return false
    if (activeTab === 'Submitted' && m.stage !== 5) return false
    if (activeTab === 'Closed' && m.stage !== 6) return false
    if (activeTab === 'All' && m.stage === 6) return false

    // Owner filter
    if (ownerFilter !== 'All' && m.owner !== ownerFilter) return false

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const client = clients.find((c) => c.id === m.clientId)
      const hay = [
        m.name,
        m.id,
        m.type,
        m.owner,
        m.caseOverview,
        m.next,
        client?.phone || '',
        client?.email || ''
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }

    return true
  })

  // Retained intake count
  const retainedCount = matters.filter((m) => m.retained && m.stage < 6).length

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Case Operations · Retained Caseload
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            To-Do List
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Active application pipeline, document attention, and file submission deadlines.
          </p>
        </div>

        <button
          onClick={onNewMatter}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add retained client</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 border border-[#dfe5e3] rounded-xl shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
          {/* Prominent Red Retained Tab */}
          <button
            onClick={() => setActiveTab('Retained')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'Retained'
                ? 'bg-[#991b1b] text-white shadow-xs'
                : 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]'
            }`}
          >
            <span>Retained Clients</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-white text-[#991b1b]">
              {retainedCount}
            </span>
          </button>

          {(['All', 'Temporary', 'PR', 'LMIA', 'Submitted', 'Closed'] as const).map((tab) => {
            const isActive = activeTab === tab
            const count = matters.filter((m) => {
              if (tab === 'All') return m.stage < 6
              if (tab === 'Temporary') return !isPRType(m.type) && m.type !== 'LMIA' && m.stage < 5
              if (tab === 'PR') return isPRType(m.type) && m.stage < 5
              if (tab === 'LMIA') return m.type === 'LMIA' && m.stage < 6
              if (tab === 'Submitted') return m.stage === 5
              return m.stage === 6
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
                <span>{tab === 'Temporary' ? 'Temporary Files' : tab === 'PR' ? 'PR Applications' : tab}</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-[#e5ebe7] text-[#52625a]">
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter by Owner & Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-[#8a9895] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#f4f6f5] border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] focus:border-[#246b54] outline-none"
            />
          </div>

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="py-1.5 px-2 bg-white border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] outline-none"
          >
            <option value="All">All case managers</option>
            {staffList.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Retained Matters Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase tracking-wider">
                <th className="py-3 px-4 w-52">Client Info</th>
                <th className="py-3 px-3 w-40">Application Type</th>
                <th className="py-3 px-4 min-w-[260px]">Case Overview</th>
                <th className="py-3 px-3 w-28">Date Retained</th>
                <th className="py-3 px-3 w-44">Submission Deadline</th>
                <th className="py-3 px-3 w-32">Case Manager</th>
                <th className="py-3 px-3 w-36">File Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {filteredMatters.map((m) => {
                const client = clients.find((c) => c.id === m.clientId)
                const simpleStage =
                  m.stage === 0
                    ? 'Not Started'
                    : m.stage === 4 && m.ready
                    ? 'Ready'
                    : m.stage === 5
                    ? 'Submitted'
                    : m.stage === 6
                    ? 'Closed'
                    : 'Under Process'

                return (
                  <tr key={m.id} className="hover:bg-[#f8faf9] transition-colors">
                    {/* Client Info */}
                    <td className="py-3 px-4 align-top">
                      <button
                        onClick={() => onOpenMatter(m.id)}
                        className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline text-left block"
                      >
                        {m.name}
                      </button>
                      <div className="text-[11.5px] text-[#677472]">
                        {client?.phone || 'No phone'}
                      </div>
                      <div className="text-[11px] text-[#8a9895] truncate max-w-[180px]">
                        {client?.email || m.id}
                      </div>
                    </td>

                    {/* Application Type */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-semibold text-[#202d2d]">{m.type}</div>
                      <div className="text-[11px] text-[#8ba79b]">{m.id}</div>
                    </td>

                    {/* Case Overview */}
                    <td className="py-3 px-4 align-top">
                      <div className="line-clamp-2 text-[#202d2d] leading-snug">
                        {m.caseOverview || m.strategy}
                      </div>
                      <div className="text-[11.5px] text-[#677472] mt-1">
                        <strong className="text-[#12382e]">Next: </strong>
                        <span>{m.next}</span>
                      </div>
                    </td>

                    {/* Date Retained */}
                    <td className="py-3 px-3 align-top whitespace-nowrap text-[#677472] font-medium">
                      {formatDueDate(m.retainedDate || m.created)}
                    </td>

                    {/* File Submission Deadline */}
                    <td className="py-3 px-3 align-top">
                      <label className="text-[10.5px] font-semibold uppercase text-[#677472] block mb-1">
                        Target Date
                      </label>
                      <input
                        type="date"
                        value={m.submissionDue || ''}
                        onChange={(e) => onUpdateSubmissionDeadline(m.id, e.target.value)}
                        className="w-full px-2 py-1 border border-[#cbd5d1] rounded text-[12px] bg-white text-[#202d2d] outline-none focus:border-[#246b54]"
                      />
                      {m.hard && (
                        <div className="text-[11px] text-[#ae4343] font-bold mt-1">
                          Hard: {formatDueDate(m.hard)}
                        </div>
                      )}
                    </td>

                    {/* Case Manager */}
                    <td className="py-3 px-3 align-top font-semibold text-[#12382e] whitespace-nowrap">
                      {m.owner}
                    </td>

                    {/* File Stage */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={simpleStage}
                        onChange={(e) => {
                          const val = e.target.value
                          const stageNum =
                            val === 'Not Started'
                              ? 0
                              : val === 'Ready'
                              ? 4
                              : val === 'Submitted'
                              ? 5
                              : val === 'Closed'
                              ? 6
                              : 2
                          onChangeStage(m.id, stageNum, val)
                        }}
                        className="w-full py-1 px-2 border border-[#cbd5d1] rounded text-[12px] font-semibold bg-white text-[#202d2d] outline-none"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="Under Process">Under Process</option>
                        <option value="Ready">Ready</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <div className="text-[11px] text-[#677472] mt-1">
                        With <span className="font-semibold text-[#12382e]">{m.ball}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredMatters.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#677472]">
                    No files found matching your selected category.
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
