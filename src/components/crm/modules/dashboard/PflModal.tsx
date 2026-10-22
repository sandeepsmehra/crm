import React, { useState } from 'react'
import { PFLRecord, Matter } from '@/types/crm'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { addDays } from '@/lib/crmUtils'
import { X } from 'lucide-react'

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

  if (!isOpen) return null

  const selectedMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifiedCheck) {
      return alert('Please confirm you have checked the deadline against the official correspondence.')
    }

    const pfl: PFLRecord = {
      id: `PFL-${Date.now().toString().slice(-4)}`,
      fileNumber,
      clientName: selectedMatter ? selectedMatter.name : 'Client',
      applicationType: selectedMatter ? selectedMatter.type : 'Work Permit',
      category,
      actionRequired: actionRequired.trim(),
      receivedDate,
      deadline,
      owner,
      comments: comments.trim(),
      status: 'Open',
      documents: requiredDocs.split('\n').map((s) => s.trim()).filter(Boolean)
    }

    onSave(pfl, requiredDocs.split('\n').map((s) => s.trim()).filter(Boolean))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Add Government Request / PFL</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Record procedural fairness letter, IRCC document request, or interview notice.
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
            <label className="block font-semibold text-[#202d2d] mb-1">Related Application Matter</label>
            <select
              value={selectedMatterId}
              onChange={(e) => {
                setSelectedMatterId(e.target.value)
                const m = matters.find((x) => x.id === e.target.value)
                if (m) setOwner(m.owner)
              }}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
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
              <label className="block font-semibold text-[#202d2d] mb-1">Request Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                <option value="Procedural Fairness Letter">Procedural Fairness Letter</option>
                <option value="Document Request">Document Request</option>
                <option value="Interview Notice">Interview Notice</option>
                <option value="Additional Information">Additional Information</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">File Number / Reference</label>
              <input
                type="text"
                required
                value={fileNumber}
                onChange={(e) => setFileNumber(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Action Required *</label>
            <input
              type="text"
              required
              value={actionRequired}
              onChange={(e) => setActionRequired(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Received Date</label>
              <input
                type="date"
                required
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Verified Deadline</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none font-bold text-[#ae4343]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Documents Required (One per line)</label>
            <textarea
              rows={2}
              placeholder="e.g. Updated Police Certificate&#10;Original Paystubs&#10;Employment Letter"
              value={requiredDocs}
              onChange={(e) => setRequiredDocs(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none font-mono text-[12px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Comments / Strategy Instructions</label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-[12.5px] font-semibold text-[#202d2d] cursor-pointer">
            <input
              type="checkbox"
              required
              checked={verifiedCheck}
              onChange={(e) => setVerifiedCheck(e.target.checked)}
            />
            <span>Deadline verified against source correspondence (time zone & calendar days confirmed)</span>
          </label>

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
              className="px-5 py-2 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md font-semibold text-[13px] shadow-xs"
            >
              Create Response Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
