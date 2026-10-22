import React, { useState } from 'react'
import { Client, ClientKind } from '@/types/crm'
import { APPLICATION_TYPES } from '@/data/mockData'
import { normalizePhone } from '@/lib/crmUtils'
import { X, AlertCircle } from 'lucide-react'

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
  const [consultationDateTime, setConsultationDateTime] = useState('')

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
    if (!name.trim()) return alert('Please enter client or company name.')

    const newClient: Client = {
      id: `C-${existingClients.length + 1}`,
      name: name.trim(),
      kind,
      phone: phone.trim(),
      email: email.trim(),
      dob: kind === 'Individual' ? dob : undefined,
      status: kind === 'Individual' ? status : undefined,
      expiry: kind === 'Individual' ? expiry : undefined,
      type,
      notes: notes.trim(),
      history: '',
      risks: '',
      strategy: '',
      address: '',
      uci: `DEMO-${10000 + existingClients.length + 1}`
    }

    onSave(newClient, consultationDateTime)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">New Client Profile</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Create a permanent client or employer record.
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
          {duplicate && (
            <div className="p-3 bg-[#fdf2f2] border border-[#fca5a5] rounded-lg text-[#991b1b] text-[12.5px] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#ae4343]" />
              <div>
                <strong>Possible duplicate client:</strong> {duplicate.name} ({duplicate.phone}). Confirm identity before saving.
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Profile Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="kind"
                  checked={kind === 'Individual'}
                  onChange={() => setKind('Individual')}
                />
                <span>Individual</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="kind"
                  checked={kind === 'Employer'}
                  onChange={() => setKind('Employer')}
                />
                <span>Employer / Company</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              {kind === 'Employer' ? 'Company Name' : 'Full Name'} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={kind === 'Employer' ? 'e.g. Acme Construction Ltd.' : 'e.g. Jaspreet Kaur'}
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="604-555-0100"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
              />
            </div>
          </div>

          {kind === 'Individual' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none focus:border-[#246b54]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Immigration Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                >
                  <option value="Work permit">Work permit</option>
                  <option value="Study permit">Study permit</option>
                  <option value="Visitor">Visitor</option>
                  <option value="Permanent resident">Permanent resident</option>
                  <option value="Out of status">Out of status</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Primary Inquiry Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                {APPLICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">
                Consultation Booking (Optional)
              </label>
              <input
                type="datetime-local"
                value={consultationDateTime}
                onChange={(e) => setConsultationDateTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Intake / Consultation Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial enquiry details, caller background..."
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
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
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold text-[13px] shadow-xs"
            >
              Create Client Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
