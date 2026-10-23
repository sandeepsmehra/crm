import React, { useState } from 'react'
import { ClientUpdate, Matter } from '@/types/crm'
import { clientUpdateZodSchema, clientUpdateYupSchema } from '@/lib/validations'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'

interface ClientUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (update: ClientUpdate) => void
  matters: Matter[]
  initialMatterId?: string
}

export function ClientUpdateModal({
  isOpen,
  onClose,
  onSave,
  matters,
  initialMatterId
}: ClientUpdateModalProps) {
  const [selectedMatterId, setSelectedMatterId] = useState(initialMatterId || matters[0]?.id || '')
  const [date, setDate] = useState(TODAY)
  const [updateType, setUpdateType] = useState<'Approved' | 'Refused' | 'Documents Requested' | 'Other'>('Documents Requested')
  const [checkedBy, setCheckedBy] = useState(STAFF_MEMBERS[0])
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState<'Not Sent' | 'Pending Further' | 'Sent'>('Not Sent')
  const [method, setMethod] = useState('Email')
  const [sentBy, setSentBy] = useState(STAFF_MEMBERS[0])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  if (!isOpen) return null

  const selectedMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      date,
      clientName: selectedMatter ? selectedMatter.name : 'Client',
      applicationType: selectedMatter ? selectedMatter.type : 'Work Permit',
      updateType,
      checkedBy,
      comments: comments.trim(),
      status,
      method: status === 'Sent' ? method : undefined,
      sentBy: status === 'Sent' ? sentBy : undefined
    }

    // 1. Zod Validation
    const zodResult = clientUpdateZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Validation error')
      return
    }

    // 2. Yup Validation
    try {
      clientUpdateYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const newRecord: ClientUpdate = {
      id: `UPD-${Date.now().toString().slice(-4)}`,
      matterId: selectedMatter?.id,
      ...candidateData
    }

    onSave(newRecord)
    toast.success(`Client update for ${newRecord.clientName} recorded successfully`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Create an Update</h2>
            <p className="text-[12px] text-[#677472]">
              Record external result or document request and communicate to client.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8a9895] hover:text-[#202d2d] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Errors Banner */}
        {validationErrors.length > 0 && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-[12.5px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Please resolve validation errors:</div>
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
            <label className="block font-semibold text-[#202d2d] mb-1">Related Application Matter</label>
            <select
              value={selectedMatterId}
              onChange={(e) => setSelectedMatterId(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} · {m.type} ({m.id})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Update Type</label>
              <select
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Approved">Approved</option>
                <option value="Refused">Refused</option>
                <option value="Documents Requested">Documents Requested</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Checked By (Case Manager)</label>
              <select
                value={checkedBy}
                onChange={(e) => setCheckedBy(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Notification Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Not Sent">Not Sent</option>
                <option value="Pending Further">Pending Further</option>
                <option value="Sent">Sent</option>
              </select>
            </div>
          </div>

          {status === 'Sent' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#f5f8f7] rounded-md border border-[#d5e0dc]">
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Delivery Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                >
                  <option value="Email">Email</option>
                  <option value="Phone Call / Text">Phone Call / Text</option>
                  <option value="Client Portal">Client Portal</option>
                  <option value="In Person">In Person</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Sent By</label>
                <select
                  value={sentBy}
                  onChange={(e) => setSentBy(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                >
                  {STAFF_MEMBERS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Comments & Notes</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Record details of decision, request letters received, or client instructions..."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              required
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
              Save update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
