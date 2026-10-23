import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { lmiaZodSchema, lmiaYupSchema } from '@/lib/validations'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X, Briefcase, AlertCircle } from 'lucide-react'

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

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      company: company.trim(),
      position: position.trim(),
      noc: noc.trim(),
      wage: wage.trim(),
      stream,
      jobBankDate,
      adExpiryDate,
      submissionTarget,
      owner,
      status
    }

    // 1. Zod Validation
    const zodResult = lmiaZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Validation error')
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
            <label className="block font-semibold text-[#202d2d] mb-1">Employer / Company Name *</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Fraser Valley Foods Inc."
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#202d2d] mb-1">Position / Job Title *</label>
              <input
                type="text"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Cook"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">NOC Code *</label>
              <input
                type="text"
                required
                value={noc}
                onChange={(e) => setNoc(e.target.value)}
                placeholder="63200"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Hourly Wage ($ CAD) *</label>
              <input
                type="text"
                required
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                placeholder="28.50"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">ESDC Stream</label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="High-wage">High-wage Stream</option>
                <option value="Low-wage">Low-wage Stream</option>
                <option value="Global Talent Stream">Global Talent Stream</option>
                <option value="Permanent Residence Supporting">PR Supporting</option>
                <option value="Agricultural Stream">Agricultural Stream</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Job Bank Posted</label>
              <input
                type="date"
                required
                value={jobBankDate}
                onChange={(e) => {
                  setJobBankDate(e.target.value)
                  setAdExpiryDate(addDays(e.target.value, 28))
                }}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">28-day Ad Expiry</label>
              <input
                type="date"
                required
                value={adExpiryDate}
                onChange={(e) => setAdExpiryDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Target Submission</label>
              <input
                type="date"
                required
                value={submissionTarget}
                onChange={(e) => setSubmissionTarget(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Assigned Case Manager</label>
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
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none focus:border-[#246b54]"
              >
                <option value="Advertising">Advertising (28-day countdown)</option>
                <option value="Candidate Screening">Candidate Screening / Interviews</option>
                <option value="Preparing Submission">Preparing Submission</option>
                <option value="Submitted">Submitted to ESDC</option>
                <option value="Approved">Positive LMIA Issued</option>
                <option value="Refused">Refused</option>
              </select>
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
