import React, { useState } from 'react'
import { SubmissionRecord } from '@/types/crm'
import { TODAY, STAFF_MEMBERS } from '@/data/mockData'
import { X, Send } from 'lucide-react'

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

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ref.trim()) return alert('Please enter application confirmation number.')

    onSave({
      date,
      portal,
      ref: ref.trim(),
      by,
      confirmation: confirmation.trim()
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Record Government Submission</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Filing confirmation for {matterName}.
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
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Submission Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Portal / Authority</label>
            <select
              value={portal}
              onChange={(e) => setPortal(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <option value="IRCC Permanent Residence Portal">IRCC Permanent Residence Portal</option>
              <option value="Authorized Paid Representative Portal">Authorized Paid Representative Portal</option>
              <option value="Employer LMIA Online Portal">Employer LMIA Online Portal</option>
              <option value="IRB Refugee Appeal Division Portal">IRB Refugee Appeal Division Portal</option>
              <option value="Federal Court Registry (e-filing)">Federal Court Registry (e-filing)</option>
              <option value="Paper Courier Package Delivery">Paper Courier Package Delivery</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Application / Confirmation Reference Number *
            </label>
            <input
              type="text"
              required
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Submitted By</label>
            <select
              value={by}
              onChange={(e) => setBy(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              {['Tejinder', ...STAFF_MEMBERS].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Confirmation Document Name
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <div className="p-3 bg-[#f8faf9] rounded-lg border border-[#edf0ee] text-[12px] text-[#677472]">
            Recording submission advances the matter to <strong>Government Processing</strong> and transitions ownership to government monitoring.
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
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold text-[13px] shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Submitted</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
