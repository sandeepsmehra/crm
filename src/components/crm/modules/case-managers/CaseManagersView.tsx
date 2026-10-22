import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { Plus, Users, ArrowRightLeft, UserCheck, Shield } from 'lucide-react'

interface CaseManagersViewProps {
  staffList: string[]
  matters: Matter[]
  onReassignFiles: (sourceManager: string, targetManager: string, matterIds: string[]) => void
  onAddManager: (name: string) => void
  onOpenMatter: (matterId: string) => void
}

export function CaseManagersView({
  staffList,
  matters,
  onReassignFiles,
  onAddManager,
  onOpenMatter
}: CaseManagersViewProps) {
  const [isReassignOpen, setIsReassignOpen] = useState(false)
  const [sourceManager, setSourceManager] = useState(staffList[0] || 'Inderpreet')
  const [targetManager, setTargetManager] = useState(staffList[1] || 'Sukhman')
  const [selectedMatterIds, setSelectedMatterIds] = useState<string[]>([])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newManagerName, setNewManagerName] = useState('')

  // Files currently owned by source manager
  const sourceFiles = matters.filter((m) => m.owner === sourceManager && m.stage < 6)

  const handleExecuteReassign = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMatterIds.length === 0) {
      return alert('Please select at least one file to reassign.')
    }
    if (sourceManager === targetManager) {
      return alert('Target manager must be different from source manager.')
    }
    onReassignFiles(sourceManager, targetManager, selectedMatterIds)
    setSelectedMatterIds([])
    setIsReassignOpen(false)
  }

  const handleAddManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newManagerName.trim()) return
    onAddManager(newManagerName.trim())
    setNewManagerName('')
    setIsAddOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Practice Staff · Caseload Balancing
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Case Managers
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Manage assigned caseworkers, monitor workload capacity, and reassign active files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setIsReassignOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded-md text-[13px] font-semibold text-[#202d2d] transition-colors shadow-2xs"
          >
            <ArrowRightLeft className="w-4 h-4 text-[#a7653b]" />
            <span>Reassign files</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add case manager</span>
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-[13.5px] border-collapse">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase tracking-wider">
                <th className="py-3 px-4">Case Manager</th>
                <th className="py-3 px-3 text-center">Active Matters</th>
                <th className="py-3 px-3 text-center">Open Tasks</th>
                <th className="py-3 px-4">Assigned Active Matters</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {staffList.map((staffName) => {
                const activeMatters = matters.filter((m) => m.owner === staffName && m.stage < 6)
                const openTasks = activeMatters.reduce(
                  (sum, m) => sum + m.tasks.filter((t) => !t.done).length,
                  0
                )

                return (
                  <tr key={staffName} className="hover:bg-[#f8faf9] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#12382e] flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#e9dace] text-[#815535] text-xs font-bold flex items-center justify-center">
                        {staffName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div>{staffName}</div>
                        <div className="text-[11px] text-[#677472] font-normal">Active Caseworker</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-lg text-[#202d2d]">
                      {activeMatters.length}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-semibold text-[#356c8d]">
                      {openTasks}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5 max-w-md">
                        {activeMatters.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => onOpenMatter(m.id)}
                            className="text-[11.5px] px-2 py-0.5 bg-[#edf4f0] hover:bg-[#d8eadd] text-[#245942] rounded font-medium border border-[#cbe4d4] transition-colors"
                          >
                            {m.name} ({m.type})
                          </button>
                        ))}
                        {activeMatters.length === 0 && (
                          <span className="text-[12px] text-[#8ba79b] italic">No active files</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSourceManager(staffName)
                          setTargetManager(staffList.find((s) => s !== staffName) || staffName)
                          setIsReassignOpen(true)
                        }}
                        className="text-[12.5px] text-[#a7653b] hover:text-[#784722] hover:underline font-semibold"
                      >
                        Reassign files
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      {isReassignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in flex flex-col max-h-[92vh]">
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Reassign Active Files</h2>
                <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
                  Redistribute workload between case managers.
                </p>
              </div>
              <button
                onClick={() => setIsReassignOpen(false)}
                className="text-[#8a9895] hover:text-[#202d2d]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteReassign} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">From (Current Owner)</label>
                  <select
                    value={sourceManager}
                    onChange={(e) => {
                      setSourceManager(e.target.value)
                      setSelectedMatterIds([])
                    }}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                  >
                    {staffList.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">To (New Owner)</label>
                  <select
                    value={targetManager}
                    onChange={(e) => setTargetManager(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none font-semibold text-[#246b54]"
                  >
                    {staffList.map((s) => (
                      <option key={s} value={s} disabled={s === sourceManager}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-[#202d2d]">Select Files to Transfer</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMatterIds.length === sourceFiles.length) {
                        setSelectedMatterIds([])
                      } else {
                        setSelectedMatterIds(sourceFiles.map((m) => m.id))
                      }
                    }}
                    className="text-[12px] text-[#a7653b] hover:underline"
                  >
                    {selectedMatterIds.length === sourceFiles.length ? 'Deselect all' : 'Select all'}
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto border border-[#cbd5d1] rounded-md divide-y divide-[#edf0ee]">
                  {sourceFiles.map((m) => {
                    const isChecked = selectedMatterIds.includes(m.id)
                    return (
                      <label
                        key={m.id}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#f8faf9] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedMatterIds((prev) => prev.filter((id) => id !== m.id))
                            } else {
                              setSelectedMatterIds((prev) => [...prev, m.id])
                            }
                          }}
                        />
                        <div className="text-[13px]">
                          <div className="font-bold text-[#12382e]">{m.name}</div>
                          <div className="text-[11.5px] text-[#677472]">
                            {m.id} · {m.type} · Next: {m.next}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                  {sourceFiles.length === 0 && (
                    <div className="p-4 text-center text-[#8ba79b]">
                      No active files owned by {sourceManager}.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#edf0ee] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReassignOpen(false)}
                  className="px-4 py-2 border border-[#cbd5d1] text-[#202d2d] rounded-md font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md font-semibold text-[13px] shadow-xs"
                >
                  Reassign {selectedMatterIds.length} File(s)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manager Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-sm max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
            <div className="px-5 py-3.5 border-b border-[#edf0ee] flex items-center justify-between">
              <h3 className="font-bold text-[#12382e] text-[15px]">Add Case Manager</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[#8a9895]">✕</button>
            </div>
            <form onSubmit={handleAddManagerSubmit} className="p-5 space-y-3.5 text-[13px]">
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navjot"
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border border-[#cbd5d1] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#a7653b] text-white font-semibold rounded"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
