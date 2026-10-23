import React, { useState } from 'react'
import { Matter, BallHolder } from '@/types/crm'
import { STAFF_MEMBERS } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { CustomSelect } from '@/components/ui/custom/custom-select'
import { editAssignmentModalZodSchema } from './matter.validation'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen || !matter) return null

  // Workload count per staff
  const getWorkload = (staff: string) => {
    return allMatters
      .filter((m) => m.owner === staff && m.stage < 6)
      .reduce((sum, m) => sum + m.tasks.filter((t) => !t.done).length, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = editAssignmentModalZodSchema.safeParse({
      owner,
      ball,
      next: next.trim(),
      due
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
      const firstMsg = parseResult.error.issues[0]?.message || 'Please check assignment fields'
      toast.error(firstMsg)
      return
    }

    setFieldErrors({})

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
        <form noValidate onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
            <CustomSelect
              value={owner}
              options={STAFF_MEMBERS.map((s) => ({
                value: s,
                label: `${s} (${getWorkload(s)} open tasks)`
              }))}
              onChange={(val) => {
                setOwner(val)
                if (fieldErrors.owner) setFieldErrors((prev) => ({ ...prev, owner: '' }))
              }}
              triggerClassName="w-full border-[#cbd5d1] bg-white font-medium text-[#202d2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Who has the ball?</label>
            <CustomSelect
              value={ball}
              options={[
                { value: "Case Manager", label: "Case Manager (Staff working)" },
                { value: "Client", label: "Client (Awaiting documents/info)" },
                { value: "RCIC", label: "RCIC (Awaiting review approval)" },
                { value: "Government", label: "Government (Under IRCC/CBSA processing)" },
                { value: "Reception", label: "Reception" },
                { value: "Third Party", label: "Third Party" }
              ]}
              onChange={(val) => {
                setBall(val as BallHolder)
                if (fieldErrors.ball) setFieldErrors((prev) => ({ ...prev, ball: '' }))
              }}
              triggerClassName="w-full border-[#cbd5d1] bg-white font-medium text-[#202d2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Next Action *</label>
            <input
              type="text"
              value={next}
              onChange={(e) => {
                setNext(e.target.value)
                if (fieldErrors.next) setFieldErrors((prev) => ({ ...prev, next: '' }))
              }}
              placeholder="e.g. Draft submission letter and checklist"
              className={`w-full p-2 border ${
                fieldErrors.next ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              } rounded-md outline-none focus:border-[#246b54]`}
            />
            {fieldErrors.next && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.next}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Due / Follow-up Date *</label>
            <input
              type="date"
              value={due}
              onChange={(e) => {
                setDue(e.target.value)
                if (fieldErrors.due) setFieldErrors((prev) => ({ ...prev, due: '' }))
              }}
              className={`w-full p-2 border ${
                fieldErrors.due ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
              } rounded-md outline-none`}
            />
            {fieldErrors.due && (
              <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.due}</p>
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
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
