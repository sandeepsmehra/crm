import React, { useState } from 'react'
import { PFLRecord, Matter } from '@/types/crm'
import { pflZodSchema, pflYupSchema } from './dashboard.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X, AlertCircle } from 'lucide-react'

interface PflModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (pfl: PFLRecord, docsList: string[]) => void
  matters: Matter[]
}

export function PflModal({
  isOpen,
  onClose,
  onSave,
  matters
}: PflModalProps) {
  const [selectedMatterId, setSelectedMatterId] = useState(matters[0]?.id || '')
  const [fileNumber, setFileNumber] = useState('WP-2026-9018')
  const [category, setCategory] = useState('Procedural Fairness Letter')
  const [actionRequired, setActionRequired] = useState('Respond to procedural fairness letter regarding employment history')
  const [receivedDate, setReceivedDate] = useState(TODAY)
  const [deadline, setDeadline] = useState(addDays(TODAY, 14))
  const [owner, setOwner] = useState(STAFF_MEMBERS[0])
  const [comments, setComments] = useState('')
  const [requiredDocs, setRequiredDocs] = useState('')
  const [verifiedCheck, setVerifiedCheck] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  if (!isOpen) return null

  const selectedMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      fileNumber: fileNumber.trim(),
      clientName: selectedMatter ? selectedMatter.name : 'Client',
      applicationType: selectedMatter ? selectedMatter.type : 'Work Permit',
      category,
      actionRequired: actionRequired.trim(),
      receivedDate,
      deadline,
      owner,
      comments: comments.trim() || undefined,
      verifiedCheck
    }

    // 1. Zod Validation
    const zodResult = pflZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Validation error')
      return
    }

    // 2. Yup Validation
    try {
      pflYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const docsList = requiredDocs.split('\n').map((s) => s.trim()).filter(Boolean)
    const pfl: PFLRecord = {
      id: `PFL-${Date.now().toString().slice(-4)}`,
      fileNumber: candidateData.fileNumber,
      clientName: candidateData.clientName,
      applicationType: candidateData.applicationType,
      category: candidateData.category,
      actionRequired: candidateData.actionRequired,
      receivedDate: candidateData.receivedDate,
      deadline: candidateData.deadline,
      owner: candidateData.owner,
      comments: candidateData.comments || '',
      status: 'Open',
      documents: docsList
    }

    onSave(pfl, docsList)
    toast.success(`Government request recorded for ${candidateData.clientName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Add Government Request / PFL</h2>
            <p className="text-[12px] text-[#677472]">
              Record procedural fairness letter, IRCC document request, or interview notice.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Related Application Matter</label>
            <select
              value={selectedMatterId}
              onChange={(e) => {
                setSelectedMatterId(e.target.value)
                const m = matters.find((x) => x.id === e.target.value)
                if (m) {
                  setOwner(m.owner)
                  setFileNumber(m.fileNumber || m.id)
                }
              }}
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
              <label className="block font-semibold text-[#202d2d] mb-1">Government File # / UCI</label>
              <input
                type="text"
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
                placeholder="e.g. WP-2026-9018"
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Request Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Procedural Fairness Letter">Procedural Fairness Letter (PFL)</option>
                <option value="Document Request Letter">IRCC Document Request Letter</option>
                <option value="Medical Request">Medical Request / Additional Medical</option>
                <option value="Interview Notice">Interview Notice</option>
                <option value="Biometrics Request">Biometrics Request</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Action Required</label>
            <textarea
              rows={2}
              value={actionRequired}
              onChange={(e) => setActionRequired(e.target.value)}
              placeholder="Summary of response needed and specific officer concerns..."
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Received Date</label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Official Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned Staff</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Required Documents Checklist (one per line)</label>
            <textarea
              rows={3}
              value={requiredDocs}
              onChange={(e) => setRequiredDocs(e.target.value)}
              placeholder="e.g.&#10;Updated T4 slips for 2024 and 2025&#10;Letter of explanation regarding employment gap&#10;Pay stubs (last 6 months)"
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54] font-mono text-[12.5px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Notes & Instructions</label>
            <input
              type="text"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Internal strategy or officer reference notes..."
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
            />
          </div>

          <div className="p-3 bg-[#fff8eb] border border-[#f5dfa8] rounded-md">
            <label className="flex items-start gap-2 text-[12.5px] text-[#7d4e10] cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedCheck}
                onChange={(e) => setVerifiedCheck(e.target.checked)}
                className="mt-0.5 rounded text-[#a7653b] focus:ring-[#a7653b]"
                required
              />
              <span>
                <strong>Verified by RCIC / Case Manager:</strong> I have checked the deadline date directly on the IRCC or ESDC official letter.
              </span>
            </label>
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
              Save request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
