import React, { useState } from 'react'
import { DeadlineItem, DeadlineKind, Matter } from '@/types/crm'
import { TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { CustomSelect } from '@/components/ui/custom/custom-select'
import { deadlineZodSchema } from './deadlineCentre.validation'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = deadlineZodSchema.safeParse({
      matterId,
      kind,
      label: label.trim(),
      date,
      time,
      zone,
      source: source.trim(),
      verified
    })

    if (!parseResult.success) {
      const newErrors: Record<string, string> = {}
      parseResult.error.issues.forEach((err) => {
        const fieldName = err.path[0] as string
        if (fieldName && !newErrors[fieldName]) {
          newErrors[fieldName] = err.message
        }
      })
      setFieldErrors(newErrors)
      const firstMsg = parseResult.error.issues[0]?.message || 'Please correct deadline errors'
      toast.error(firstMsg)
      return
    }

    setFieldErrors({})

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
        <form noValidate onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Application Matter</label>
            <CustomSelect
              value={matterId}
              options={matters.map((m) => ({
                value: m.id,
                label: `${m.name} · ${m.type} (${m.id})`
              }))}
              onChange={(val) => {
                setMatterId(val)
                if (fieldErrors.matterId) setFieldErrors((prev) => ({ ...prev, matterId: '' }))
              }}
              invalid={!!fieldErrors.matterId}
              triggerClassName={`w-full bg-white text-[#202d2d] ${
                fieldErrors.matterId ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              }`}
            />
            {fieldErrors.matterId && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.matterId}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Deadline Type</label>
            <CustomSelect
              value={kind}
              options={[
                { value: "Hard Deadline", label: "Hard Legal Deadline (Statutory / Officer Letter)" },
                { value: "Internal Target", label: "Internal Management Target" },
                { value: "Normal Task Deadline", label: "Normal Task Deadline" }
              ]}
              onChange={(val) => setKind(val as DeadlineKind)}
              triggerClassName="w-full border-[#cbd5d1] bg-white font-medium text-[#202d2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Action / Deadline Description *</label>
            <input
              type="text"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value)
                if (fieldErrors.label) setFieldErrors((prev) => ({ ...prev, label: '' }))
              }}
              placeholder="e.g. RAD Record Perfection / Job Bank Ad Expiry"
              className={`w-full p-2 border ${
                fieldErrors.label ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              } rounded-md outline-none focus:border-[#246b54]`}
            />
            {fieldErrors.label && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.label}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  if (fieldErrors.date) setFieldErrors((prev) => ({ ...prev, date: '' }))
                }}
                className={`w-full p-2 border ${
                  fieldErrors.date ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
                } rounded-md outline-none`}
              />
              {fieldErrors.date && (
                <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.date}</p>
              )}
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

          <div>
            <label className="flex items-center gap-2 text-[12.5px] font-semibold text-[#202d2d] cursor-pointer">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) => {
                  setVerified(e.target.checked)
                  if (fieldErrors.verified) setFieldErrors((prev) => ({ ...prev, verified: '' }))
                }}
              />
              <span>Date and time verified by the responsible staff member *</span>
            </label>
            {fieldErrors.verified && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.verified}</p>
            )}
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
              Save Deadline
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
