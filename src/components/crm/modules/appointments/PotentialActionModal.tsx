import React, { useState } from 'react'
import { Client } from '@/types/crm'
import { followUpZodSchema, followUpYupSchema } from '@/lib/validations'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'

export interface PotentialActionModalProps {
  isOpen: boolean
  onClose: () => void
  client?: Client | null
  clientName?: string
  actionType?: 'Follow Up' | 'Convert to Retained' | 'Archive / Not Interested'
  onConfirm?: (clientId: string, data: { date: string; notes: string; manager: string; action: string }) => void
  onSuccess?: () => void
}

export function PotentialActionModal({
  isOpen,
  onClose,
  client,
  clientName,
  actionType = 'Follow Up',
  onConfirm,
  onSuccess
}: PotentialActionModalProps) {
  const [followupDate, setFollowupDate] = useState(TODAY)
  const [notes, setNotes] = useState('')
  const [caseManager, setCaseManager] = useState(STAFF_MEMBERS[0])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const displayName = client?.name || clientName || 'Potential Client'
  const targetId = client?.id || 'potential-01'

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      clientId: targetId,
      followupDate,
      notes: notes.trim(),
      caseManager
    }

    // 1. Zod Validation
    const zodResult = followUpZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Validation error')
      return
    }

    // 2. Yup Validation
    try {
      followUpYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    if (onConfirm) {
      onConfirm(targetId, {
        date: followupDate,
        notes: notes.trim(),
        manager: caseManager,
        action: actionType
      })
    }

    if (onSuccess) {
      onSuccess()
    }

    toast.success(`Action "${actionType}" recorded for ${displayName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {actionType}: {displayName}
            </h2>
            <p className="text-[12px] text-[#677472]">
              Record follow-up details or disposition for potential client.
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
          <div className="p-3 bg-[#f8faf9] rounded-lg border border-[#edf0ee] text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#677472]">Phone:</span>
              <span className="font-medium text-[#202d2d]">{client?.phone || '604-555-0199'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#677472]">Email:</span>
              <span className="font-medium text-[#202d2d]">{client?.email || 'Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#677472]">Application Interest:</span>
              <span className="font-medium text-[#202d2d]">{client?.type || 'Spousal Sponsorship'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followupDate}
                onChange={(e) => setFollowupDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned Manager</label>
              <select
                value={caseManager}
                onChange={(e) => setCaseManager(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Discussion Notes / Strategy *</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did the client say, and what are next steps or retainer conditions?"
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
              Confirm action
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
