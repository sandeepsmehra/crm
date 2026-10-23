import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { toast } from '@/components/ui/sonner'

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
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newManagerName, setNewManagerName] = useState('')

  const managersData = [
    { name: 'Amanpreet', openFiles: 6 },
    { name: 'Inderpreet', openFiles: 6 },
    { name: 'Sukhman', openFiles: 6 },
    { name: 'Tejinder', openFiles: 3 }
  ]

  const handleActionToast = (action: string, manager: string) => {
    toast('Save the current changes before opening documents.')
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newManagerName.trim()) {
      toast.error('Case manager name is required')
      return
    }
    onAddManager(newManagerName.trim())
    setNewManagerName('')
    setIsAddOpen(false)
    toast.success(`Case manager added: ${newManagerName.trim()}`)
  }

  return (
    <div className="space-y-4">
      {/* Header and Eyebrow matching SCR-047 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
            MANAGE ASSIGNMENTS ACROSS YOUR TEAM
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
            Case Managers
          </h1>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Add Case Manager
        </button>
      </div>

      <p className="text-xs text-[#6b7280]">
        Shared assignment names. Open files must be reassigned before a manager is removed. Historical records retain their original names.
      </p>

      {/* Directory Table matching SCR-047 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">CASE MANAGER</th>
                <th className="py-3 px-4">OPEN FILES</th>
                <th className="py-3 px-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {managersData.map((mgr) => (
                <tr key={mgr.name} className="hover:bg-[#fbfcfb]">
                  <td className="py-4 px-4 font-bold text-[#1c2826]">{mgr.name}</td>
                  <td className="py-4 px-4 text-[#1c2826]">{mgr.openFiles}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActionToast('view', mgr.name)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        View files
                      </button>
                      <button
                        onClick={() => handleActionToast('reassign', mgr.name)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Reassign Files
                      </button>
                      <button
                        onClick={() => handleActionToast('edit', mgr.name)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleActionToast('delete', mgr.name)}
                        className="bg-white border border-[#fecaca] px-3 py-1 rounded-md text-xs font-medium text-[#b91c1c] hover:bg-[#fff5f5] cursor-pointer shadow-2xs"
                      >
                        Delete Case Manager
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4">
            <h3 className="text-lg font-bold text-[#1c2826]">Add Case Manager</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1c2826] mb-1">Manager Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jaspreet"
                  value={newManagerName}
                  onChange={(e) => setNewManagerName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#d1d5db] rounded-md text-sm outline-none focus:border-[#126b48]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border border-[#d1d5db] text-xs font-medium rounded-md text-[#374151]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#a75928] hover:bg-[#924c1f] text-white text-xs font-medium rounded-md"
                >
                  Add Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
