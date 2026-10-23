import React, { useState } from 'react'
import { PersonalReminder, Matter } from '@/types/crm'
import { personalReminderZodSchema, personalReminderYupSchema } from './dashboard.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      text: text.trim(),
      person,
      reminderFor: person,
      applicationId: applicationId || undefined,
      dueDate: dueDate.trim(),
      dueTime: dueTime || undefined,
      priority,
      notes: notes.trim() || undefined
    }

    // 1. Zod Validation
    const zodResult = personalReminderZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMap: Record<string, string> = {}
      zodResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (key && !errMap[key]) {
          errMap[key] = issue.message
        }
      })
      setFieldErrors(errMap)
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Please complete all required fields')
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
      text: candidateData.text,
      person: candidateData.person,
      applicationId: candidateData.applicationId,
      dueDate: candidateData.dueDate,
      dueTime: candidateData.dueTime,
      priority: candidateData.priority,
      notes: candidateData.notes
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


        {/* Form Body */}
        <form noValidate onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">What do you need to do? *</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (fieldErrors.text) setFieldErrors((p) => ({ ...p, text: '' }))
              }}
              placeholder="e.g. Review updated employer job offer before LMIA upload..."
              className={`w-full p-2.5 border rounded-md bg-white outline-none transition-colors ${
                fieldErrors.text
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                  : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.text && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.text}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
              <CustomSelect
                value={person}
                options={STAFF_MEMBERS}
                onChange={(val) => setPerson(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Priority</label>
              <CustomSelect
                value={priority}
                options={["Normal", "High", "Urgent"]}
                onChange={(val) => setPriority(val as any)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (fieldErrors.dueDate) setFieldErrors((p) => ({ ...p, dueDate: '' }))
                }}
                className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                  fieldErrors.dueDate
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.dueDate && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.dueDate}
                </p>
              )}
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
            <CustomSelect
              value={applicationId}
              placeholder="None / General"
              isClearable
              options={[
                { value: "", label: "None / General" },
                ...matters.map((m) => ({
                  value: m.id,
                  label: `${m.name} · ${m.type} (${m.id})`
                }))
              ]}
              onChange={(val) => setApplicationId(val)}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
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
