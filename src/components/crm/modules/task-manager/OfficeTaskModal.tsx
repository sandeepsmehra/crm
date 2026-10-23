import React, { useState } from 'react'
import { OfficeTask, Client } from '@/types/crm'
import { officeTaskZodSchema, officeTaskYupSchema } from './taskManager.validation'
import { toast } from '@/components/ui/sonner'
import { TODAY, STAFF_MEMBERS } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'

interface OfficeTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: OfficeTask) => void
  clients: Client[]
  existingTask?: OfficeTask | null
}

export function OfficeTaskModal({
  isOpen,
  onClose,
  onSave,
  clients,
  existingTask
}: OfficeTaskModalProps) {
  const [text, setText] = useState(existingTask?.text || '')
  const [category, setCategory] = useState<'Client Calls' | 'Staff Tasks'>(
    existingTask?.taskCategory || 'Client Calls'
  )
  const [clientId, setClientId] = useState(existingTask?.client || '')
  const [assignedBy, setAssignedBy] = useState(existingTask?.assignedBy || 'Reception')
  const [assignedTo, setAssignedTo] = useState(existingTask?.assignedTo || STAFF_MEMBERS[0])
  const [date, setDate] = useState(existingTask?.date || TODAY)
  const [time, setTime] = useState(existingTask?.time || '11:30')
  const [due, setDue] = useState(existingTask?.due || TODAY)
  const [priority, setPriority] = useState<'Normal' | 'Urgent'>(
    existingTask?.priority || 'Normal'
  )
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const selectedClient = clients.find((c) => c.id === clientId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      text: text.trim(),
      taskCategory: category,
      assignedTo,
      assignedBy,
      due: due.trim(),
      priority,
      clientName: selectedClient?.name,
      clientPhone: selectedClient?.phone
    }

    // 1. Zod Validation
    const zodResult = officeTaskZodSchema.safeParse(candidateData)
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
      officeTaskYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const task: OfficeTask = {
      id: existingTask ? existingTask.id : `T-${Date.now().toString().slice(-4)}`,
      text: candidateData.text,
      taskCategory: category,
      client: clientId || undefined,
      clientName: selectedClient?.name,
      clientPhone: selectedClient?.phone,
      assignedBy,
      assignedTo,
      date,
      time,
      due,
      priority,
      status: existingTask ? existingTask.status : 'Pending',
      result: existingTask ? existingTask.result : '',
      completedAt: existingTask ? existingTask.completedAt : '',
      history: existingTask
        ? [`Updated on ${TODAY}: assigned to ${assignedTo}`, ...existingTask.history]
        : [`Assigned by ${assignedBy} to ${assignedTo} on ${TODAY} ${time}`]
    }

    onSave(task)
    toast.success(existingTask ? 'Task updated successfully' : `Task assigned to ${assignedTo}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {existingTask ? 'Edit Office Task' : 'Assign Office Task'}
            </h2>
            <p className="text-[12px] text-[#677472]">
              Route client inquiries or dispatch casework to staff.
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
        <form noValidate onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Task Category</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'Client Calls'}
                  onChange={() => setCategory('Client Calls')}
                  className="text-[#a7653b] focus:ring-[#a7653b]"
                />
                <span>Client Calls & Inquiries</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'Staff Tasks'}
                  onChange={() => setCategory('Staff Tasks')}
                  className="text-[#a7653b] focus:ring-[#a7653b]"
                />
                <span>Internal Staff Tasks</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Related Client (Optional)</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
            >
              <option value="">General inquiry / No client file linked</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Task Enquiry / Instructions *</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (fieldErrors.text) setFieldErrors((p) => ({ ...p, text: '' }))
              }}
              placeholder="What did the client ask, or what casework needs completion?"
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
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned By</label>
              <select
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Reception">Reception</option>
                <option value="Tejinder">Tejinder</option>
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date</label>
              <input
                type="date"
                value={due}
                onChange={(e) => {
                  setDue(e.target.value)
                  if (fieldErrors.due) setFieldErrors((p) => ({ ...p, due: '' }))
                }}
                className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                  fieldErrors.due
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.due && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.due}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Call Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
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
              {existingTask ? 'Save changes' : 'Assign task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
