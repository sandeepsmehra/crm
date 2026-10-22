import React, { useState } from 'react'
import { Matter, BallHolder } from '@/types/crm'
import { STAFF_MEMBERS } from '@/data/mockData'
import { X } from 'lucide-react'

interface EditAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  matter: Matter | null
  onSave: (updated: Matter) => void
  allMatters: Matter[]
}

export function EditAssignmentModal({
  isOpen,
  onClose,
  matter,
  onSave,
  allMatters
}: EditAssignmentModalProps) {
  const [owner, setOwner] = useState(matter?.owner || STAFF_MEMBERS[0])
  const [ball, setBall] = useState<BallHolder>(matter?.ball || 'Case Manager')
  const [next, setNext] = useState(matter?.next || '')
  const [due, setDue] = useState(matter?.due || '')

  if (!isOpen || !matter) return null

  // Workload count per staff
  const getWorkload = (staff: string) => {
    return allMatters
      .filter((m) => m.owner === staff && m.stage < 6)
      .reduce((sum, m) => sum + m.tasks.filter((t) => !t.done).length, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!next.trim()) return alert('Please enter the next action.')

    const oldStr = `${matter.owner} / ${matter.ball} / ${matter.next} / ${matter.due}`
    const newStr = `${owner} / ${ball} / ${next.trim()} / ${due}`

    onSave({
      ...matter,
      owner,
      ball,
      next: next.trim(),
      due,
      events: [`Assignment changed: ${oldStr} → ${newStr}`, ...matter.events]
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Assignment & Next Action</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Update ownership, bottleneck holder, and dated action.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8a9895] hover:text-[#202d2d] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none font-medium"
            >
              {STAFF_MEMBERS.map((s) => (
                <option key={s} value={s}>
                  {s} ({getWorkload(s)} open tasks)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Who has the ball?</label>
            <select
              value={ball}
              onChange={(e) => setBall(e.target.value as BallHolder)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none font-medium"
            >
              <option value="Case Manager">Case Manager (Staff working)</option>
              <option value="Client">Client (Awaiting documents/info)</option>
              <option value="RCIC">RCIC (Awaiting review approval)</option>
              <option value="Government">Government (Under IRCC/CBSA processing)</option>
              <option value="Reception">Reception</option>
              <option value="Third Party">Third Party</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Next Action *</label>
            <input
              type="text"
              required
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Due / Follow-up Date</label>
            <input
              type="date"
              required
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <div className="pt-3 border-t border-[#edf0ee] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cbd5d1] text-[#202d2d] hover:bg-[#f4f6f5] rounded-md font-semibold text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold text-[13px] shadow-xs"
            >
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
