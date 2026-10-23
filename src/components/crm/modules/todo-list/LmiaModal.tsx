import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { lmiaZodSchema, lmiaYupSchema } from './todoList.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X, Briefcase, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface LmiaModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
  existingLmia?: any
}

export function LmiaModal({
  isOpen,
  onClose,
  onSave,
  existingLmia
}: LmiaModalProps) {
  const [company, setCompany] = useState(existingLmia?.company || '')
  const [position, setPosition] = useState(existingLmia?.position || 'Cook')
  const [noc, setNoc] = useState(existingLmia?.noc || '63200')
  const [wage, setWage] = useState(existingLmia?.wage || '28.50')
  const [stream, setStream] = useState(existingLmia?.stream || 'High-wage')
  const [jobBankDate, setJobBankDate] = useState(existingLmia?.jobBankDate || TODAY)
  const [adExpiryDate, setAdExpiryDate] = useState(existingLmia?.adExpiryDate || addDays(TODAY, 28))
  const [submissionTarget, setSubmissionTarget] = useState(existingLmia?.submissionTarget || addDays(TODAY, 35))
  const [owner, setOwner] = useState(existingLmia?.owner || STAFF_MEMBERS[0])
  const [status, setStatus] = useState(existingLmia?.status || 'Advertising')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      company: company.trim(),
      position: position.trim(),
      noc: noc.trim(),
      wage: wage.trim(),
      stream,
      jobBankDate: jobBankDate.trim(),
      adExpiryDate: adExpiryDate.trim(),
      submissionTarget: submissionTarget.trim(),
      owner,
      status
    }

    // 1. Zod Validation
    const zodResult = lmiaZodSchema.safeParse(candidateData)
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
      lmiaYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    onSave({
      id: existingLmia?.id || `LMIA-${Date.now().toString().slice(-4)}`,
      ...candidateData
    })

    toast.success(existingLmia ? 'LMIA file updated successfully' : `Created LMIA application for ${candidateData.company}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {existingLmia ? 'Edit LMIA Application' : 'Create LMIA Application'}
            </h2>
            <p className="text-[12px] text-[#677472]">
              Track ESDC mandatory recruitment, advertising dates, and wages.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Employer / Company Name *</label>
            <input
              type="text"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value)
                if (fieldErrors.company) setFieldErrors((p) => ({ ...p, company: '' }))
              }}
              placeholder="e.g. Fraser Valley Foods Inc."
              className={`w-full p-2 border rounded-md outline-none transition-colors ${
                fieldErrors.company ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.company && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.company}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#202d2d] mb-1">Position / Job Title *</label>
              <input
                type="text"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value)
                  if (fieldErrors.position) setFieldErrors((p) => ({ ...p, position: '' }))
                }}
                placeholder="e.g. Cook"
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.position ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.position && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.position}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">NOC Code *</label>
              <input
                type="text"
                value={noc}
                onChange={(e) => {
                  setNoc(e.target.value)
                  if (fieldErrors.noc) setFieldErrors((p) => ({ ...p, noc: '' }))
                }}
                placeholder="63200"
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.noc ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.noc && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.noc}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Hourly Wage ($ CAD) *</label>
              <input
                type="text"
                value={wage}
                onChange={(e) => {
                  setWage(e.target.value)
                  if (fieldErrors.wage) setFieldErrors((p) => ({ ...p, wage: '' }))
                }}
                placeholder="28.50"
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.wage ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.wage && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.wage}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">ESDC Stream</label>
              <CustomSelect
                value={stream}
                options={[
                  { value: "High-wage", label: "High-wage Stream" },
                  { value: "Low-wage", label: "Low-wage Stream" },
                  { value: "Global Talent Stream", label: "Global Talent Stream" },
                  { value: "Permanent Residence Supporting", label: "PR Supporting" },
                  { value: "Agricultural Stream", label: "Agricultural Stream" }
                ]}
                onChange={(val) => setStream(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Job Bank Posted</label>
              <input
                type="date"
                value={jobBankDate}
                onChange={(e) => {
                  setJobBankDate(e.target.value)
                  setAdExpiryDate(addDays(e.target.value, 28))
                  if (fieldErrors.jobBankDate) setFieldErrors((p) => ({ ...p, jobBankDate: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.jobBankDate ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.jobBankDate && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.jobBankDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">28-day Ad Expiry</label>
              <input
                type="date"
                value={adExpiryDate}
                onChange={(e) => {
                  setAdExpiryDate(e.target.value)
                  if (fieldErrors.adExpiryDate) setFieldErrors((p) => ({ ...p, adExpiryDate: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.adExpiryDate ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.adExpiryDate && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.adExpiryDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Target Submission</label>
              <input
                type="date"
                value={submissionTarget}
                onChange={(e) => {
                  setSubmissionTarget(e.target.value)
                  if (fieldErrors.submissionTarget) setFieldErrors((p) => ({ ...p, submissionTarget: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.submissionTarget ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.submissionTarget && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.submissionTarget}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned Case Manager</label>
              <CustomSelect
                value={owner}
                options={STAFF_MEMBERS}
                onChange={(val) => setOwner(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Current Status</label>
              <CustomSelect
                value={status}
                options={[
                  { value: "Advertising", label: "Advertising (28-day countdown)" },
                  { value: "Candidate Screening", label: "Candidate Screening / Interviews" },
                  { value: "Preparing Submission", label: "Preparing Submission" },
                  { value: "Submitted", label: "Submitted to ESDC" },
                  { value: "Approved", label: "Positive LMIA Issued" },
                  { value: "Refused", label: "Refused" }
                ]}
                onChange={(val) => setStatus(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
              />
            </div>
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
              <Briefcase className="w-3.5 h-3.5" />
              <span>{existingLmia ? 'Save LMIA' : 'Create LMIA File'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
