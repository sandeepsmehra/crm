import React, { useState } from 'react'
import { ContactLogEntry } from '@/types/crm'
import { TODAY, STAFF_MEMBERS } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { contactLogZodSchema } from './matter.validation'

interface RecordContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contact: ContactLogEntry) => void
  defaultStaff?: string
  clientName?: string
}

export function RecordContactModal({
  isOpen,
  onClose,
  onSave,
  defaultStaff,
  clientName
}: RecordContactModalProps) {
  const [date, setDate] = useState(TODAY)
  const [time, setTime] = useState('11:30')
  const [method, setMethod] = useState<ContactLogEntry['method']>('Phone call')
  const [person, setPerson] = useState(clientName || 'Client')
  const [staff, setStaff] = useState(defaultStaff || STAFF_MEMBERS[0])
  const [explanation, setExplanation] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = contactLogZodSchema.safeParse({
      date,
      time,
      method,
      person: person.trim(),
      staff,
      explanation: explanation.trim()
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
      const firstMsg = parseResult.error.issues[0]?.message || 'Please check contact record fields'
      toast.error(firstMsg)
      return
    }

    setFieldErrors({})

    const entry: ContactLogEntry = {
      id: `CLog-${Date.now().toString().slice(-4)}`,
      date,
      time,
      method,
      person: person.trim(),
      staff,
      explanation: explanation.trim()
    }

    onSave(entry)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Record Last Contact</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Track when you last spoke with the client and discussion details.
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Contact Date *</label>
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
              <label className="block font-semibold text-[#202d2d] mb-1">Time (Vancouver) *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value)
                  if (fieldErrors.time) setFieldErrors((prev) => ({ ...prev, time: '' }))
                }}
                className={`w-full p-2 border ${
                  fieldErrors.time ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
                } rounded-md outline-none`}
              />
              {fieldErrors.time && (
                <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.time}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Contact Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                <option value="Phone call">Phone call</option>
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="In person">In person</option>
                <option value="Internal note">Internal note</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Recorded By</label>
              <select
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                {['Tejinder', 'Reception', ...STAFF_MEMBERS].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Contact With *</label>
            <input
              type="text"
              value={person}
              onChange={(e) => {
                setPerson(e.target.value)
                if (fieldErrors.person) setFieldErrors((prev) => ({ ...prev, person: '' }))
              }}
              placeholder="e.g. Client, Sponsor, Employer HR"
              className={`w-full p-2 border ${
                fieldErrors.person ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              } rounded-md outline-none`}
            />
            {fieldErrors.person && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.person}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Discussion Summary / Explanation *
            </label>
            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => {
                setExplanation(e.target.value)
                if (fieldErrors.explanation) setFieldErrors((prev) => ({ ...prev, explanation: '' }))
              }}
              placeholder="Detailed summary of phone call or meeting discussion..."
              className={`w-full p-2.5 border ${
                fieldErrors.explanation ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              } rounded-md outline-none focus:border-[#246b54]`}
            />
            {fieldErrors.explanation && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.explanation}</p>
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
              Save Contact Record
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
