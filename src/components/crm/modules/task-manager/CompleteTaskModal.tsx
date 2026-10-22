import React, { useState } from 'react'
import { OfficeTask } from '@/types/crm'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, CheckCircle } from 'lucide-react'

interface CompleteTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: OfficeTask | null
  onFinish: (taskId: string, result: string, completedBy: string) => void
}

export function CompleteTaskModal({
  isOpen,
  onClose,
  task,
  onFinish
}: CompleteTaskModalProps) {
  const [result, setResult] = useState('')
  const [completedBy, setCompletedBy] = useState(task?.assignedTo || STAFF_MEMBERS[0])

  if (!isOpen || !task) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!result.trim()) return alert('Please enter the action taken to complete this task.')
    onFinish(task.id, result.trim(), completedBy)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Complete Office Task</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Record resolution and action taken.
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
          <div className="p-3 bg-[#f8faf9] border border-[#edf0ee] rounded-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#677472]">Task Description</span>
            <p className="font-semibold text-[#202d2d] mt-1">{task.text}</p>
            {task.clientName && (
              <div className="text-[11.5px] text-[#246b54] font-medium mt-1">
                Client: {task.clientName}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              What was done? (Action taken) *
            </label>
            <textarea
              rows={3}
              required
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="e.g. Called client, explained processing timeline, updated notes."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Completed By</label>
            <select
              value={completedBy}
              onChange={(e) => setCompletedBy(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              {['Reception', 'Tejinder', ...STAFF_MEMBERS].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
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
              className="px-5 py-2 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md font-semibold text-[13px] shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
