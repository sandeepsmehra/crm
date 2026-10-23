import React, { useState } from 'react'
import { PersonalReminder, Matter } from '@/types/crm'
import { personalReminderZodSchema, personalReminderYupSchema } from './dashboard.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'

interface PersonalReminderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (reminder: PersonalReminder) => void
  matters: Matter[]
}

export function PersonalReminderModal({
  isOpen,
  onClose,
  onSave,
  matters
}: PersonalReminderModalProps) {
  const [text, setText] = useState('')
  const [person, setPerson] = useState(STAFF_MEMBERS[0])
  const [applicationId, setApplicationId] = useState('')
  const [dueDate, setDueDate] = useState(TODAY)
  const [dueTime, setDueTime] = useState('14:00')
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal')
  const [notes, setNotes] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      text: text.trim(),
      person,
      applicationId: applicationId || undefined,
      dueDate,
      dueTime: dueTime || undefined,
      priority,
      notes: notes.trim() || undefined
    }

    // 1. Zod Validation
    const zodResult = personalReminderZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Validation error')
      return
    }

    // 2. Yup Validation
    try {
      personalReminderYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const newReminder: PersonalReminder = {
      id: `REM-${Date.now().toString().slice(-4)}`,
      completed: false,
      ...candidateData
    }

    onSave(newReminder)
    toast.success('Personal reminder created successfully')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Add Personal Reminder</h2>
            <p className="text-[12px] text-[#677472]">
              Track your individual action items and scheduled reminders.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8a9895] hover:text-[#202d2d] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-[12.5px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Please fix validation errors:</div>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[12px]">
                {validationErrors.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">What do you need to do? *</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Review updated employer job offer before LMIA upload..."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
              <select
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Time</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Related Application (Optional)</label>
            <select
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
            >
              <option value="">None / General</option>
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.type} ({m.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional context or reminder reference..."
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#edf0ee] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cbd5d1] rounded-md text-[#52625a] hover:bg-[#f4f6f5] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold transition-colors shadow-xs"
            >
              Add reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
