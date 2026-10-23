import React from 'react'
import { ClientUpdate } from '@/types/crm'

interface UpdatesTabProps {
  clientUpdates: ClientUpdate[]
  updatesFilter: 'Updates' | 'UpdateSent'
  onFilterChange: (filter: 'Updates' | 'UpdateSent') => void
  onCreateUpdate: () => void
  onOpenUpdate: (update: ClientUpdate) => void
}

export function UpdatesTab({
  clientUpdates,
  updatesFilter,
  onFilterChange,
  onCreateUpdate,
  onOpenUpdate
}: UpdatesTabProps) {
  const filteredUpdates = clientUpdates.filter((u) => {
    if (updatesFilter === 'UpdateSent') {
      return u.status === 'Sent' || u.actionStatus === 'Sent'
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold text-[#1c2826]">Client Updates</h2>
        <button
          onClick={onCreateUpdate}
          className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          + Create an Update
        </button>
      </div>

      {/* Subfilter Pills */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onFilterChange('Updates')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            updatesFilter === 'Updates'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-white border border-[#e5e7eb] text-[#374151]'
          }`}
        >
          Updates ({clientUpdates.length})
        </button>
        <button
          onClick={() => onFilterChange('UpdateSent')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            updatesFilter === 'UpdateSent'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-white border border-[#e5e7eb] text-[#374151]'
          }`}
        >
          Update Sent ({clientUpdates.filter((u) => u.status === 'Sent' || u.actionStatus === 'Sent').length})
        </button>
      </div>

      {/* Updates Table Card matching SCR-003 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">TYPE OF APPLICATION</th>
                <th className="py-3 px-4">UPDATE</th>
                <th className="py-3 px-4">CHECKED BY</th>
                <th className="py-3 px-4">COMMENTS</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredUpdates.length > 0 ? (
                filteredUpdates.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 text-[#1c2826]">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">{item.clientName}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{item.applicationType}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{item.updateType}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{item.checkedBy}</td>
                    <td className="py-3.5 px-4 text-[#1c2826] max-w-xs whitespace-pre-line">{item.comments}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">
                        {item.status === 'Sent' || item.actionStatus === 'Sent' ? 'Sent' : 'Not Sent'}
                      </div>
                      <button
                        onClick={() => onOpenUpdate(item)}
                        className="text-[12px] text-[#1c2826] hover:underline cursor-pointer block mt-0.5"
                      >
                        Open update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-[#6b7280]">
                    No client updates found.
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
