import React, { useState } from 'react'
import { Matter, DocumentRecord } from '@/types/crm'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { toast } from '@/components/ui/sonner'
import { X, FileCheck, UploadCloud, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

import { documentManagerZodSchema } from './matter.validation'

interface DocumentManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (doc: DocumentRecord) => void
  matter: Matter
  existingDoc?: DocumentRecord | null
}

export function DocumentManagerModal({
  isOpen,
  onClose,
  onSave,
  matter,
  existingDoc
}: DocumentManagerModalProps) {
  const [kind, setKind] = useState(existingDoc?.kind || 'Passport Copy')
  const [customName, setCustomName] = useState(existingDoc?.customName || '')
  const [received, setReceived] = useState(existingDoc?.received || TODAY)
  const [reviewDue, setReviewDue] = useState(existingDoc?.reviewDue || addDays(TODAY, 3))
  const [status, setStatus] = useState<DocumentRecord['status']>(existingDoc?.status || 'Pending')
  const [verifiedBy, setVerifiedBy] = useState(existingDoc?.verifiedBy || STAFF_MEMBERS[0])
  const [notes, setNotes] = useState(existingDoc?.notes || '')
  const [fileName, setFileName] = useState(existingDoc?.fileName || 'Scanned-Document.pdf')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parseResult = documentManagerZodSchema.safeParse({
      kind,
      customName: customName.trim(),
      received,
      reviewDue,
      status,
      verifiedBy
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
      const firstMsg = parseResult.error.issues[0]?.message || 'Please check document fields'
      toast.error(firstMsg)
      return
    }

    setFieldErrors({})

    const docName = kind === 'Other' ? customName.trim() : kind
    const updatedDoc: DocumentRecord = {
      id: existingDoc ? existingDoc.id : `DOC-${Date.now().toString().slice(-4)}`,
      kind,
      label: docName,
      customName: kind === 'Other' ? customName.trim() : undefined,
      received,
      reviewDue,
      status,
      verifiedBy,
      notes: notes.trim(),
      fileName
    }

    onSave(updatedDoc)
    toast.success(`Document "${docName}" verified by ${verifiedBy}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Document Manager & Verification</h2>
            <p className="text-[12px] text-[#677472]">
              Verify checklist item for {matter.name} ({matter.id}).
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
            <label className="block font-semibold text-[#202d2d] mb-1">Document Category</label>
            <CustomSelect
              value={kind}
              options={[
                { value: "Passport Copy", label: "Passport / Identity Document" },
                { value: "Police Certificate", label: "Police Clearance Certificate" },
                { value: "Language Test Result", label: "Language Test (IELTS / CELPIP / TEF)" },
                { value: "Educational Credential Assessment", label: "ECA Report (WES / ICAS)" },
                { value: "Proof of Funds", label: "Proof of Funds / Bank Certificate" },
                { value: "Job Offer Letter", label: "Job Offer Letter & LMIA" },
                { value: "T4 & Notice of Assessment", label: "CRA Notices of Assessment & T4s" },
                { value: "Medical Exam Sheet", label: "eMedical Information Sheet" },
                { value: "Other", label: "Other / Custom Document" }
              ]}
              onChange={(val) => {
                setKind(val)
                if (fieldErrors.kind) setFieldErrors((prev) => ({ ...prev, kind: '' }))
              }}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
          </div>

          {kind === 'Other' && (
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Custom Document Title *</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value)
                  if (fieldErrors.customName) setFieldErrors((prev) => ({ ...prev, customName: '' }))
                }}
                placeholder="e.g. Statutory Declaration of Common-Law Union"
                className={`w-full p-2 border ${
                  fieldErrors.customName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
                } rounded-md outline-none focus:border-[#246b54]`}
              />
              {fieldErrors.customName && (
                <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.customName}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Received Date *</label>
              <input
                type="date"
                value={received}
                onChange={(e) => {
                  setReceived(e.target.value)
                  if (fieldErrors.received) setFieldErrors((prev) => ({ ...prev, received: '' }))
                }}
                className={`w-full p-2 border ${
                  fieldErrors.received ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
                } rounded-md outline-none focus:border-[#246b54]`}
              />
              {fieldErrors.received && (
                <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.received}</p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Review Due Date *</label>
              <input
                type="date"
                value={reviewDue}
                onChange={(e) => {
                  setReviewDue(e.target.value)
                  if (fieldErrors.reviewDue) setFieldErrors((prev) => ({ ...prev, reviewDue: '' }))
                }}
                className={`w-full p-2 border ${
                  fieldErrors.reviewDue ? 'border-red-500 ring-1 ring-red-500' : 'border-[#cbd5d1]'
                } rounded-md outline-none focus:border-[#246b54]`}
              />
              {fieldErrors.reviewDue && (
                <p className="mt-1 text-[11.5px] text-red-600 font-medium">⚠️ {fieldErrors.reviewDue}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Verification Status</label>
              <CustomSelect
                value={status}
                options={[
                  { value: "Pending", label: "Pending Review" },
                  { value: "Verified", label: "Verified & Valid" },
                  { value: "Rejected", label: "Rejected / Re-upload Required" }
                ]}
                onChange={(val) => setStatus(val as any)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Verified By</label>
              <CustomSelect
                value={verifiedBy}
                options={STAFF_MEMBERS}
                onChange={(val) => setVerifiedBy(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Attached File Reference</label>
            <div className="flex items-center gap-2 p-2.5 bg-[#f8faf9] border border-[#d5e0dc] rounded-md">
              <UploadCloud className="w-4 h-4 text-[#246b54]" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none font-mono text-[#202d2d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Notes & Deficiencies</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Scanned in color, bio page fully legible, expires June 2028."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#edf0ee] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cbd5d1] text-[#202d2d] hover:bg-[#f4f6f5] rounded-md font-semibold text-[13px] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold text-[13px] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Save verification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
