import React, { useState } from 'react'
import { PFLRecord, Matter } from '@/types/crm'
import { pflZodSchema, pflYupSchema } from './dashboard.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const selectedMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      fileNumber: fileNumber.trim(),
      clientName: selectedMatter ? selectedMatter.name : '',
      applicationType: selectedMatter ? selectedMatter.type : '',
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
      const errMap: Record<string, string> = {}
      zodResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (key && !errMap[key]) {
          errMap[key] = issue.message
        }
      })
      if (!verifiedCheck) {
        errMap.verifiedCheck = 'Verification checkbox is required'
      }
      setFieldErrors(errMap)
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      if (!verifiedCheck && !errMsgs.includes('Verification checkbox is required')) {
        errMsgs.push('Verification checkbox is required')
      }
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Please complete all required fields')
      return
    }

    if (!verifiedCheck) {
      setFieldErrors({ verifiedCheck: 'Verification checkbox is required' })
      setValidationErrors(['Verification checkbox is required'])
      toast.error('Please verify the deadline date')
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


        {/* Form Body */}
        <form noValidate onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Related Application Matter</label>
            <CustomSelect
              value={selectedMatterId}
              options={matters.map((m) => ({
                value: m.id,
                label: `${m.name} · ${m.type} (${m.id})`
              }))}
              onChange={(val) => {
                setSelectedMatterId(val)
                const m = matters.find((x) => x.id === val)
                if (m) {
                  setOwner(m.owner)
                  setFileNumber(m.fileNumber || m.id)
                }
              }}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Government File # / UCI</label>
              <input
                type="text"
                value={fileNumber}
                onChange={(e) => {
                  setFileNumber(e.target.value)
                  if (fieldErrors.fileNumber) setFieldErrors((p) => ({ ...p, fileNumber: '' }))
                }}
                placeholder="e.g. WP-2026-9018"
                className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                  fieldErrors.fileNumber
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.fileNumber && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.fileNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Request Category</label>
              <CustomSelect
                value={category}
                options={[
                  { value: 'Procedural Fairness Letter', label: 'Procedural Fairness Letter (PFL)' },
                  { value: 'Document Request Letter', label: 'IRCC Document Request Letter' },
                  { value: 'Medical Request', label: 'Medical Request / Additional Medical' },
                  { value: 'Interview Notice', label: 'Interview Notice' },
                  { value: 'Biometrics Request', label: 'Biometrics Request' }
                ]}
                onChange={(val) => setCategory(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Action Required</label>
            <textarea
              rows={2}
              value={actionRequired}
              onChange={(e) => {
                setActionRequired(e.target.value)
                if (fieldErrors.actionRequired) setFieldErrors((p) => ({ ...p, actionRequired: '' }))
              }}
              placeholder="Summary of response needed and specific officer concerns..."
              className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                fieldErrors.actionRequired
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                  : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.actionRequired && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.actionRequired}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Received Date</label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => {
                  setReceivedDate(e.target.value)
                  if (fieldErrors.receivedDate) setFieldErrors((p) => ({ ...p, receivedDate: '' }))
                }}
                className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                  fieldErrors.receivedDate
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.receivedDate && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.receivedDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Official Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value)
                  if (fieldErrors.deadline) setFieldErrors((p) => ({ ...p, deadline: '' }))
                }}
                className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                  fieldErrors.deadline
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.deadline && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.deadline}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned Staff</label>
              <CustomSelect
                value={owner}
                options={STAFF_MEMBERS}
                onChange={(val) => setOwner(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
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

          <div className={`p-3 border rounded-md transition-colors ${fieldErrors.verifiedCheck ? 'border-red-300 bg-red-50/30' : 'border-[#f5dfa8] bg-[#fff8eb]'}`}>
            <label className="flex items-start gap-2 text-[12.5px] text-[#7d4e10] cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedCheck}
                onChange={(e) => {
                  setVerifiedCheck(e.target.checked)
                  if (fieldErrors.verifiedCheck) setFieldErrors((p) => ({ ...p, verifiedCheck: '' }))
                }}
                className="mt-0.5 rounded text-[#a7653b] focus:ring-[#a7653b]"
              />
              <span>
                <strong>Verified by RCIC / Case Manager:</strong> I have checked the deadline date directly on the IRCC or ESDC official letter.
              </span>
            </label>
            {fieldErrors.verifiedCheck && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.verifiedCheck}
              </p>
            )}
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
