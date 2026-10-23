import React, { useState, useEffect } from 'react'
import { ClientUpdate, Matter } from '@/types/crm'
import { clientUpdateZodSchema, clientUpdateYupSchema } from './dashboard.validation'
import { toast } from '@/components/ui/sonner'
import { STAFF_MEMBERS, TODAY } from '@/data/mockData'
import { X, ChevronDown, AlertCircle } from 'lucide-react'

interface ClientUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (update: ClientUpdate) => void
  matters: Matter[]
  initialMatterId?: string
  initialUpdate?: ClientUpdate | null
}

export function ClientUpdateModal({
  isOpen,
  onClose,
  onSave,
  matters,
  initialMatterId,
  initialUpdate
}: ClientUpdateModalProps) {
  const [date, setDate] = useState(TODAY)
  const [clientName, setClientName] = useState('')
  const [applicationType, setApplicationType] = useState('')
  const [updateType, setUpdateType] = useState<string>('Approved')
  const [checkedBy, setCheckedBy] = useState<string>('')
  const [comments, setComments] = useState('')
  const [status, setStatus] = useState<'Not Sent' | 'Pending Further' | 'Sent'>('Not Sent')
  const [method, setMethod] = useState<string>('')
  const [sentBy, setSentBy] = useState<string>('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Initialize or reset form state when modal opens or initialUpdate changes
  useEffect(() => {
    if (isOpen) {
      if (initialUpdate) {
        setDate(initialUpdate.date || TODAY)
        setClientName(initialUpdate.clientName || '')
        setApplicationType(initialUpdate.applicationType || '')
        setUpdateType(initialUpdate.updateType || 'Approved')
        setCheckedBy(
          initialUpdate.checkedBy === 'Not checked' ? '' : initialUpdate.checkedBy || ''
        )
        setComments(initialUpdate.comments || '')
        setStatus(initialUpdate.status || initialUpdate.actionStatus || 'Not Sent')
        setMethod(initialUpdate.method || initialUpdate.actionMethod || '')
        setSentBy(initialUpdate.sentBy || '')
      } else if (initialMatterId) {
        const found = matters.find((m) => m.id === initialMatterId)
        setDate(TODAY)
        setClientName(found ? found.name : '')
        setApplicationType(found ? found.type : '')
        setUpdateType('Approved')
        setCheckedBy('')
        setComments('')
        setStatus('Not Sent')
        setMethod('')
        setSentBy('')
      } else {
        setDate(TODAY)
        setClientName('')
        setApplicationType('')
        setUpdateType('Approved')
        setCheckedBy('')
        setComments('')
        setStatus('Not Sent')
        setMethod('')
        setSentBy('')
      }
      setValidationErrors([])
    }
  }, [isOpen, initialUpdate, initialMatterId, matters])

  if (!isOpen) return null

  // Auto-fill application type if user picks a known client from matters
  const handleClientNameChange = (val: string) => {
    setClientName(val)
    const matched = matters.find((m) => m.name.toLowerCase() === val.trim().toLowerCase())
    if (matched && !applicationType) {
      setApplicationType(matched.type)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])

    const candidateData = {
      date,
      clientName: clientName.trim() || 'Client',
      applicationType: applicationType.trim() || 'General Application',
      updateType: updateType as any,
      checkedBy: checkedBy || 'Not checked',
      comments: comments.trim(),
      status,
      method: method || undefined,
      sentBy: sentBy || undefined
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

    const savedRecord: ClientUpdate = {
      id: initialUpdate?.id || `UPD-${Date.now().toString().slice(-4)}`,
      date,
      clientName: candidateData.clientName,
      applicationType: candidateData.applicationType,
      updateType: updateType as any,
      checkedBy: candidateData.checkedBy,
      comments: candidateData.comments,
      status,
      actionStatus: status,
      method: method || undefined,
      actionMethod: method || undefined,
      sentBy: sentBy || undefined,
      matterId: initialUpdate?.matterId
    }

    onSave(savedRecord)
    toast.success(`Update for ${savedRecord.clientName} saved successfully`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden animate-fade-in max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 sm:px-7 pt-5 sm:pt-6 pb-2 flex items-center justify-between">
          <h2 className="text-[19px] sm:text-[20px] font-bold text-[#1c2826]">
            Create an Update
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded border border-[#d1d5db] flex items-center justify-center text-[#6b7280] hover:text-[#1c2826] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Validation Errors Banner */}
        {validationErrors.length > 0 && (
          <div className="mx-6 sm:mx-7 mt-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-[12.5px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Please check the following:</div>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[12px]">
                {validationErrors.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-7 pt-3 pb-6 overflow-y-auto flex-1 text-[13.5px]">
          {/* Row 1: Date & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#d1d5db] rounded-md text-[13.5px] text-[#1c2826] outline-none focus:ring-1 focus:ring-[#9f5832] focus:border-[#9f5832]"
                required
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
                Client Name
              </label>
              <input
                type="text"
                list="client-names-datalist"
                value={clientName}
                onChange={(e) => handleClientNameChange(e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 bg-white border border-[#d1d5db] rounded-md text-[13.5px] text-[#1c2826] outline-none focus:ring-1 focus:ring-[#9f5832] focus:border-[#9f5832]"
                required
              />
              <datalist id="client-names-datalist">
                {matters.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.type}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 2: Type of Application & Update type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
                Type of Application
              </label>
              <input
                type="text"
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
                placeholder=""
                className="w-full px-3 py-2 bg-white border border-[#d1d5db] rounded-md text-[13.5px] text-[#1c2826] outline-none focus:ring-1 focus:ring-[#9f5832] focus:border-[#9f5832]"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
                Update type
              </label>
              <div className="relative">
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-9 bg-[#edf7f0] border border-[#c3e6cb] rounded-md text-[13.5px] font-medium text-[#166534] outline-none focus:ring-1 focus:ring-[#166534] cursor-pointer"
                >
                  <option value="Approved">Approved</option>
                  <option value="Refused">Refused</option>
                  <option value="Documents Requested">Documents Requested</option>
                  <option value="Biometrics instruction letter">Biometrics instruction letter</option>
                  <option value="Acknowledgement of receipt">Acknowledgement of receipt</option>
                  <option value="Medical Request">Medical Request</option>
                  <option value="Passport Request">Passport Request</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#166534] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Checked By (half width) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
                Checked By
              </label>
              <div className="relative">
                <select
                  value={checkedBy}
                  onChange={(e) => setCheckedBy(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-9 bg-[#edf3fe] border border-[#d7e3fc] rounded-md text-[13.5px] text-[#374151] outline-none focus:ring-1 focus:ring-[#3b82f6] cursor-pointer"
                >
                  <option value="">Select case manager</option>
                  {STAFF_MEMBERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 4: Comments */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-[#1c2826] mb-1.5">
              Comments
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2.5 bg-white border border-[#d1d5db] rounded-md text-[13.5px] text-[#1c2826] outline-none focus:ring-1 focus:ring-[#9f5832] focus:border-[#9f5832] resize-y"
            />
          </div>

          {/* Section: Action */}
          <div className="pt-1 mb-2">
            <h3 className="text-[15px] font-bold text-[#1c2826]">Action</h3>
          </div>

          {/* Row 5: Action 3 Columns (Status, Method, Sent by) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#1c2826] mb-1.5">
                Status
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full appearance-none px-3 py-2 pr-8 bg-[#edf3fe] border border-[#d7e3fc] rounded-md text-[13.5px] text-[#374151] outline-none focus:ring-1 focus:ring-[#3b82f6] cursor-pointer"
                >
                  <option value="Not Sent">Not Sent</option>
                  <option value="Sent">Sent</option>
                  <option value="Pending Further">Pending Further</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#6b7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1c2826] mb-1.5">
                Method
              </label>
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 bg-[#edf3fe] border border-[#d7e3fc] rounded-md text-[13.5px] text-[#374151] outline-none focus:ring-1 focus:ring-[#3b82f6] cursor-pointer"
                >
                  <option value=""></option>
                  <option value="Email">Email</option>
                  <option value="Phone call / Text">Phone call / Text</option>
                  <option value="In Person">In Person</option>
                  <option value="Client Portal">Client Portal</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#6b7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#1c2826] mb-1.5">
                Sent by
              </label>
              <div className="relative">
                <select
                  value={sentBy}
                  onChange={(e) => setSentBy(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 bg-[#edf3fe] border border-[#d7e3fc] rounded-md text-[13.5px] text-[#374151] outline-none focus:ring-1 focus:ring-[#3b82f6] cursor-pointer"
                >
                  <option value="">Select case manager</option>
                  {STAFF_MEMBERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#6b7280] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white border border-[#d1d5db] rounded-md text-[13.5px] font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer transition-colors shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#9f5832] hover:bg-[#884725] text-white rounded-md text-[13.5px] font-medium cursor-pointer transition-colors shadow-2xs"
            >
              Save update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
