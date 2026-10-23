import React, { useState } from 'react'
import { SubmissionRecord } from '@/types/crm'
import { TODAY, STAFF_MEMBERS } from '@/data/mockData'
import { submissionZodSchema, submissionYupSchema } from './todoList.validation'
import { toast } from '@/components/ui/sonner'
import { X, Send, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface RecordSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (record: SubmissionRecord) => void
  matterName: string
  defaultOwner?: string
}

export function RecordSubmissionModal({
  isOpen,
  onClose,
  onSave,
  matterName,
  defaultOwner
}: RecordSubmissionModalProps) {
  const [date, setDate] = useState(TODAY)
  const [portal, setPortal] = useState('IRCC Permanent Residence Portal')
  const [ref, setRef] = useState('DEMO-2026-001')
  const [by, setBy] = useState(defaultOwner || STAFF_MEMBERS[0])
  const [confirmation, setConfirmation] = useState('Submission-Confirmation-Receipt.pdf')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      date: date.trim(),
      portal,
      ref: ref.trim(),
      by,
      confirmation: confirmation.trim()
    }

    // 1. Zod Validation
    const zodResult = submissionZodSchema.safeParse(candidateData)
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
      submissionYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    onSave(candidateData)
    toast.success(`Government submission recorded for ${matterName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Record Government Submission</h2>
            <p className="text-[12px] text-[#677472]">
              Official filing confirmation for {matterName}.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Submission Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                if (fieldErrors.date) setFieldErrors((p) => ({ ...p, date: '' }))
              }}
              className={`w-full p-2 border rounded-md outline-none transition-colors ${
                fieldErrors.date ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.date && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.date}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Portal / Authority</label>
            <CustomSelect
              value={portal}
              options={[
                "IRCC Permanent Residence Portal",
                "Authorized Paid Representative Portal",
                "Employer LMIA Online Portal",
                "IRB Refugee Appeal Division Portal",
                "Federal Court Registry (e-filing)",
                "Paper Courier Package Delivery"
              ]}
              onChange={(val) => setPortal(val)}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Application / Confirmation Reference Number *
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => {
                setRef(e.target.value)
                if (fieldErrors.ref) setFieldErrors((p) => ({ ...p, ref: '' }))
              }}
              placeholder="e.g. W309488102 or DEMO-2026-001"
              className={`w-full p-2 border rounded-md outline-none transition-colors ${
                fieldErrors.ref ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.ref && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.ref}
              </p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Submitted By (Case Manager)</label>
            <CustomSelect
              value={by}
              options={STAFF_MEMBERS}
              onChange={(val) => setBy(val)}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Confirmation Receipt Document / File Name
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="e.g. IRCC-Confirmation-Receipt.pdf"
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
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
              <Send className="w-3.5 h-3.5" />
              <span>Record submission</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
