import React, { useState } from 'react'
import { DeadlineItem, DeadlineKind, Matter } from '@/types/crm'
import { TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X } from 'lucide-react'

interface DeadlineModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (matterId: string, deadline: DeadlineItem) => void
  matters: Matter[]
  defaultMatterId?: string
}

export function DeadlineModal({
  isOpen,
  onClose,
  onSave,
  matters,
  defaultMatterId
}: DeadlineModalProps) {
  const [matterId, setMatterId] = useState(defaultMatterId || matters[0]?.id || '')
  const [kind, setKind] = useState<DeadlineKind>('Internal Target')
  const [label, setLabel] = useState('')
  const [date, setDate] = useState(addDays(TODAY, 7))
  const [time, setTime] = useState('16:00')
  const [zone, setZone] = useState('America/Vancouver')
  const [source, setSource] = useState('Internal target')
  const [verified, setVerified] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return alert('Please enter deadline description.')
    if (!verified) return alert('Please confirm date and time verification.')

    const deadline: DeadlineItem = {
      kind,
      label: label.trim(),
      date,
      time,
      zone,
      source: source.trim(),
      status: 'Open'
    }

    onSave(matterId, deadline)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Add Deadline / Target</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Track statutory deadlines, internal review targets, or milestones.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Application Matter</label>
            <select
              value={matterId}
              onChange={(e) => setMatterId(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.type} ({m.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Deadline Type</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as DeadlineKind)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none font-medium"
            >
              <option value="Hard Deadline">Hard Legal Deadline (Statutory / Officer Letter)</option>
              <option value="Internal Target">Internal Management Target</option>
              <option value="Normal Task Deadline">Normal Task Deadline</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Action / Deadline Description *</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. RAD Record Perfection / Job Bank Ad Expiry"
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Time Zone</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none text-[#677472]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Source / Reason</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="IRCC letter, rule 3, internal"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-[12.5px] font-semibold text-[#202d2d] cursor-pointer">
            <input
              type="checkbox"
              required
              checked={verified}
              onChange={(e) => setVerified(e.target.checked)}
            />
            <span>Date and time verified by the responsible staff member</span>
          </label>

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
              Save Deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
