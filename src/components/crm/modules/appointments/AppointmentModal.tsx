import React, { useState, useEffect } from 'react'
import { Appointment, Client, AppointmentStatus } from '@/types/crm'
import { APPLICATION_TYPES, CONSULTANTS, TODAY } from '@/data/mockData'
import { X, AlertCircle } from 'lucide-react'

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (appointment: Appointment, newClientObj?: Client) => void
  existingAppointment?: Appointment | null
  clients: Client[]
  allAppointments: Appointment[]
  defaultDate?: string
  defaultTime?: string
}

export function AppointmentModal({
  isOpen,
  onClose,
  onSave,
  existingAppointment,
  clients,
  allAppointments,
  defaultDate,
  defaultTime
}: AppointmentModalProps) {
  const [clientId, setClientId] = useState('')
  const [isNewClient, setIsNewClient] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const [service, setService] = useState('Spousal Sponsorship')
  const [consultant, setConsultant] = useState('Tejinder')
  const [date, setDate] = useState(defaultDate || TODAY)
  const [time, setTime] = useState(defaultTime || '11:00')
  const [duration, setDuration] = useState(30)
  const [kind, setKind] = useState('Initial Consultation')
  const [mode, setMode] = useState('In person')
  const [status, setStatus] = useState<AppointmentStatus>('Scheduled')
  const [section, setSection] = useState<'Clients' | 'Staff' | 'Follow-ups'>('Clients')
  const [location, setLocation] = useState('Surrey office')
  const [notes, setNotes] = useState('')
  const [source, setSource] = useState('Phone inquiry')
  const [reminder, setReminder] = useState('Pending')
  const [followup, setFollowup] = useState('')

  useEffect(() => {
    if (existingAppointment) {
      setClientId(existingAppointment.client)
      setIsNewClient(false)
      setService(existingAppointment.service || 'Spousal Sponsorship')
      setConsultant(existingAppointment.consultant || 'Tejinder')
      setDate(existingAppointment.date || TODAY)
      setTime(existingAppointment.time || '11:00')
      setDuration(existingAppointment.duration || 30)
      setKind(existingAppointment.kind || 'Initial Consultation')
      setMode(existingAppointment.mode || 'In person')
      setStatus(existingAppointment.status || 'Scheduled')
      setSection(existingAppointment.section || 'Clients')
      setLocation(existingAppointment.location || 'Surrey office')
      setNotes(existingAppointment.notes || '')
      setSource(existingAppointment.source || 'Phone inquiry')
      setReminder(existingAppointment.reminder || 'Pending')
      setFollowup(existingAppointment.followup || '')
    } else {
      if (clients.length > 0 && !clientId) {
        setClientId(clients[0].id)
      }
      if (defaultDate) setDate(defaultDate)
      if (defaultTime) setTime(defaultTime)
    }
  }, [existingAppointment, defaultDate, defaultTime, clients, clientId])

  if (!isOpen) return null

  // Helper to convert HH:MM to minutes
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  // Conflict overlap check
  const startMins = toMinutes(time)
  const endMins = startMins + duration
  const hasConflict = allAppointments.some((a) => {
    if (existingAppointment && a.id === existingAppointment.id) return false
    if (a.date !== date || a.consultant !== consultant) return false
    if (['Cancelled', 'No-show'].includes(a.status)) return false
    const aStart = toMinutes(a.time)
    const aEnd = aStart + a.duration
    return startMins < aEnd && aStart < endMins
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (hasConflict) {
      const proceed = confirm(
        'Warning: This consultant already has an overlapping appointment at this time. Would you like to schedule anyway?'
      )
      if (!proceed) return
    }

    let resolvedClientId = clientId
    let createdClient: Client | undefined = undefined

    if (isNewClient) {
      if (!newName.trim() || !newPhone.trim()) {
        return alert('Please enter new client name and phone number.')
      }
      resolvedClientId = `C-${clients.length + 1}`
      createdClient = {
        id: resolvedClientId,
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim(),
        kind: 'Individual',
        type: service,
        notes: notes.trim()
      }
    }

    const appt: Appointment = {
      id: existingAppointment ? existingAppointment.id : Date.now(),
      client: resolvedClientId,
      date,
      time,
      duration,
      consultant,
      status,
      confirmation: ['Scheduled', 'Pending'].includes(status) ? 'Pending' : status,
      section,
      phone: createdClient ? createdClient.phone : clients.find((c) => c.id === resolvedClientId)?.phone || '',
      email: createdClient ? createdClient.email : clients.find((c) => c.id === resolvedClientId)?.email || '',
      source,
      called: existingAppointment ? existingAppointment.called : TODAY,
      notes,
      service,
      reminder,
      followup,
      kind,
      mode,
      location,
      retainedMatterId: existingAppointment ? existingAppointment.retainedMatterId : null,
      history: existingAppointment
        ? [`Updated on ${TODAY}: ${date} at ${time} (${status})`, ...existingAppointment.history]
        : [`Booked for ${date} at ${time} · ${consultant}`]
    }

    onSave(appt, createdClient)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {existingAppointment ? 'Edit Appointment' : 'Book New Appointment'}
            </h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Reception calendar and consultation booking.
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
          {hasConflict && (
            <div className="p-3 bg-[#fff7ed] border border-[#fed7aa] rounded-lg text-[#9a3412] text-[12.5px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Scheduling overlap:</strong> {consultant} has another booking around this time.
              </span>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Client Profile</label>
            <select
              value={isNewClient ? 'NEW' : clientId}
              onChange={(e) => {
                if (e.target.value === 'NEW') {
                  setIsNewClient(true)
                } else {
                  setIsNewClient(false)
                  setClientId(e.target.value)
                }
              }}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <optgroup label="Existing Clients">
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </optgroup>
              <option value="NEW">+ Add a new client profile</option>
            </select>
          </div>

          {/* New Client Inline Fields */}
          {isNewClient && (
            <div className="p-3 sm:p-3.5 bg-[#f4f7f6] border border-[#cbe0d6] rounded-lg space-y-3">
              <div className="text-[12.5px] font-bold text-[#245942]">New Client Information</div>
              <div>
                <label className="block text-[12px] font-semibold text-[#202d2d] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#202d2d] mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#202d2d] mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service & Consultant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Service Requested</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
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
              <label className="block font-semibold text-[#202d2d] mb-1">Consultant</label>
              <select
                value={consultant}
                onChange={(e) => setConsultant(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                {CONSULTANTS.map((c) => (
                  <option key={c} value={c}>
                    {c} (RCIC-IRB)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Start Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                <option value={15}>15 mins</option>
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins</option>
                <option value={90}>90 mins</option>
                <option value={120}>120 mins</option>
              </select>
            </div>
          </div>

          {/* Meeting Type & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Meeting Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                <option value="In person">In person</option>
                <option value="Phone">Phone</option>
                <option value="Video call">Video call</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Sheet Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value as any)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
              >
                <option value="Clients">Clients</option>
                <option value="Staff">Staff</option>
                <option value="Follow-ups">Follow-ups</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Waiting">Waiting</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="No-show">No-show</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Appointment Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What does the consultant need to know?"
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          {/* Follow-up date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Reference / Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followup}
                onChange={(e) => setFollowup(e.target.value)}
                className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
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
              {existingAppointment ? 'Save Changes' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
