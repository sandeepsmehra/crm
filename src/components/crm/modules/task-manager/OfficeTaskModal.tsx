import React, { useState } from 'react'
import { OfficeTask, Client } from '@/types/crm'
import { TODAY, STAFF_MEMBERS } from '@/data/mockData'
import { X } from 'lucide-react'

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

  if (!isOpen) return null

  const selectedClient = clients.find((c) => c.id === clientId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return alert('Please enter task instructions or message.')

    const task: OfficeTask = {
      id: existingTask ? existingTask.id : `T-${Date.now().toString().slice(-4)}`,
      text: text.trim(),
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
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {existingTask ? 'Edit Office Task' : 'Assign Office Task'}
            </h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Route client inquiries or dispatch casework to staff.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Task Category</label>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'Client Calls'}
                  onChange={() => setCategory('Client Calls')}
                />
                <span>Client Call / Telephone Inquiry</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="category"
                  checked={category === 'Staff Tasks'}
                  onChange={() => setCategory('Staff Tasks')}
                />
                <span>Internal Staff Task</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Task / Client Message *</label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Simran called asking for file update; please review evidence and return call..."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Related Client (Optional)</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <option value="">General office task (no client linked)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned By</label>
              <select
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                {['Reception', 'Tejinder', ...STAFF_MEMBERS].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned To *</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none font-medium"
              >
                {['Reception', 'Tejinder', ...STAFF_MEMBERS].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Due Date</label>
              <input
                type="date"
                required
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
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
              {existingTask ? 'Save Changes' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
