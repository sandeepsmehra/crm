import React, { useState } from 'react'
import { Client, ClientKind } from '@/types/crm'
import { APPLICATION_TYPES } from '@/data/mockData'
import { normalizePhone } from '@/lib/crmUtils'
import { clientZodSchema, clientYupSchema } from './clients.validation'
import { toast } from '@/components/ui/sonner'
import { X, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface NewClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (client: Client, consultationDateTime?: string) => void
  existingClients: Client[]
  initialPhone?: string
}

export function NewClientModal({
  isOpen,
  onClose,
  onSave,
  existingClients,
  initialPhone = ''
}: NewClientModalProps) {
  const [kind, setKind] = useState<ClientKind>('Individual')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState(initialPhone)
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState('')
  const [status, setStatus] = useState('Work permit')
  const [expiry, setExpiry] = useState('')
  const [type, setType] = useState('Work Permit')
  const [notes, setNotes] = useState('')
  const [receptionAlert, setReceptionAlert] = useState('')
  const [consultationDateTime, setConsultationDateTime] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  // Duplicate check
  const normalizedPhone = normalizePhone(phone)
  const duplicate = existingClients.find(
    (c) =>
      (normalizedPhone.length >= 7 && normalizePhone(c.phone) === normalizedPhone) ||
      (name && c.name.toLowerCase() === name.trim().toLowerCase()) ||
      (email && c.email.toLowerCase() === email.trim().toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      type,
      kind,
      dob: kind === 'Individual' ? dob : undefined,
      status: kind === 'Individual' ? status : undefined,
      expiry: kind === 'Individual' ? expiry : undefined,
      receptionAlert: receptionAlert.trim() || undefined,
      notes: notes.trim() || undefined
    }

    // 1. Zod Validation
    const zodResult = clientZodSchema.safeParse(candidateData)
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
      clientYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const newClient: Client = {
      id: `C-${existingClients.length + 1}`,
      name: candidateData.name,
      kind,
      phone: candidateData.phone,
      email: candidateData.email,
      dob: candidateData.dob,
      status: candidateData.status,
      expiry: candidateData.expiry,
      type: candidateData.type,
      receptionAlert: candidateData.receptionAlert,
      notes: candidateData.notes || '',
      history: '',
      risks: '',
      strategy: '',
      address: '',
      uci: `DEMO-${10000 + existingClients.length + 1}`
    }

    onSave(newClient, consultationDateTime)
    toast.success(`Client profile created for ${newClient.name}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">New Client Profile</h2>
            <p className="text-[12px] text-[#677472]">
              Create a permanent client or employer record.
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
          {duplicate && (
            <div className="p-3 bg-[#fdf2f2] border border-[#fca5a5] rounded-lg text-[#991b1b] text-[12.5px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ae4343]" />
              <div>
                <strong>Possible duplicate client:</strong> {duplicate.name} ({duplicate.phone}). Confirm identity before saving.
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Client Kind</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="clientKind"
                  checked={kind === 'Individual'}
                  onChange={() => setKind('Individual')}
                  className="text-[#a7653b] focus:ring-[#a7653b]"
                />
                <span>Individual Client</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="clientKind"
                  checked={kind === 'Employer'}
                  onChange={() => setKind('Employer')}
                  className="text-[#a7653b] focus:ring-[#a7653b]"
                />
                <span>Employer / Corporate</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              {kind === 'Individual' ? 'Full Legal Name *' : 'Company / Business Name *'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: '' }))
              }}
              placeholder={kind === 'Individual' ? 'e.g. Gurpreet Singh' : 'e.g. Fraser Valley Foods Ltd.'}
              className={`w-full p-2 border rounded-md outline-none transition-colors ${
                fieldErrors.name
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                  : 'border-[#cbd5d1] focus:border-[#246b54]'
              }`}
            />
            {fieldErrors.name && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }))
                }}
                placeholder="604-555-0100"
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.phone
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.phone}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                }}
                placeholder="client@example.com"
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.email
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1] focus:border-[#246b54]'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Application Type / Service</label>
            <CustomSelect
              value={type}
              options={APPLICATION_TYPES}
              onChange={(val) => setType(val)}
              triggerClassName="w-full border-[#cbd5d1] bg-white text-[#202d2d]"
            />
          </div>

          <div className="p-3 bg-[#fff8eb] border border-[#f5dfa8] rounded-md">
            <label className="block font-semibold text-[#7d4e10] mb-1">Reception Alert / Staff Notice</label>
            <input
              type="text"
              value={receptionAlert}
              onChange={(e) => setReceptionAlert(e.target.value)}
              placeholder="e.g. Urgent expiry next week / Speak Punjabi only / Cash client"
              className="w-full p-2 border border-[#ecd5a0] rounded-md bg-white outline-none focus:border-[#a7653b] text-xs text-[#7d4e10]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Case Notes / Background</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial consult summary or immigration history notes..."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
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
              Save client profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
