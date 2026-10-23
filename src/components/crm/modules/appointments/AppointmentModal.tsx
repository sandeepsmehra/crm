import React, { useState, useEffect } from 'react'
import { Appointment, Client, AppointmentStatus } from '@/types/crm'
import { APPLICATION_TYPES, CONSULTANTS, TODAY } from '@/data/mockData'
import { appointmentZodSchema, appointmentYupSchema } from './appointments.validation'
import { toast } from '@/components/ui/sonner'
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
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

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
    setValidationErrors([])
    setFieldErrors({})
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
    setValidationErrors([])
    setFieldErrors({})

    let resolvedClientId = clientId
    let createdClient: Client | undefined = undefined

    if (isNewClient) {
      const inlineErrs: Record<string, string> = {}
      if (!newName.trim()) inlineErrs.client = 'Client name is required'
      if (!newPhone.trim()) inlineErrs.phone = 'Valid phone number is required'

      if (Object.keys(inlineErrs).length > 0) {
        setFieldErrors(inlineErrs)
        const msgs = Object.values(inlineErrs)
        setValidationErrors(msgs)
        toast.error(msgs[0])
        return
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

    const clientName = isNewClient ? (createdClient?.name || '') : (clients.find((c) => c.id === resolvedClientId)?.name || '')
    const clientPhone = isNewClient ? (createdClient?.phone || '') : (clients.find((c) => c.id === resolvedClientId)?.phone || '')

    const candidateData = {
      client: clientName,
      phone: clientPhone,
      date: date.trim(),
      time: time.trim(),
      consultant: consultant.trim(),
      service: service.trim(),
      notes: notes.trim() || undefined,
      appointmentType: kind
    }

    // 1. Zod Validation
    const zodResult = appointmentZodSchema.safeParse(candidateData)
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
      appointmentYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    if (hasConflict) {
      toast.warning('Overlapping appointment detected for consultant at this time')
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
      phone: clientPhone,
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
    toast.success(existingAppointment ? 'Appointment updated successfully' : `Booked consultation for ${clientName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">
              {existingAppointment ? 'Edit Appointment' : 'Book Consultation'}
            </h2>
            <p className="text-[12px] text-[#677472]">
              Schedule consultation or staff meeting in Vancouver timezone.
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
        <form noValidate onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
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
                  if (fieldErrors.client) setFieldErrors((p) => ({ ...p, client: '' }))
                }
              }}
              className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                fieldErrors.client && !isNewClient
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                  : 'border-[#cbd5d1]'
              }`}
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
            {fieldErrors.client && !isNewClient && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.client}
              </p>
            )}
          </div>

          {/* New Client Inline Fields */}
          {isNewClient && (
            <div className="p-3 sm:p-3.5 bg-[#f4f7f6] border border-[#cbe0d6] rounded-lg space-y-3">
              <div className="text-[12.5px] font-bold text-[#245942]">New Client Information</div>
              <div>
                <label className="block text-[12px] font-semibold text-[#202d2d] mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value)
                    if (fieldErrors.client) setFieldErrors((p) => ({ ...p, client: '' }))
                  }}
                  className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                    fieldErrors.client
                      ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                      : 'border-[#cbd5d1]'
                  }`}
                />
                {fieldErrors.client && (
                  <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                    <span>•</span> {fieldErrors.client}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[12px] font-semibold text-[#202d2d] mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => {
                      setNewPhone(e.target.value)
                      if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: '' }))
                    }}
                    className={`w-full p-2 border rounded-md bg-white outline-none transition-colors ${
                      fieldErrors.phone
                        ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                        : 'border-[#cbd5d1]'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                      <span>•</span> {fieldErrors.phone}
                    </p>
                  )}
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
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  if (fieldErrors.date) setFieldErrors((p) => ({ ...p, date: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.date
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1]'
                }`}
              />
              {fieldErrors.date && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.date}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Start Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value)
                  if (fieldErrors.time) setFieldErrors((p) => ({ ...p, time: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.time
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500'
                    : 'border-[#cbd5d1]'
                }`}
              />
              {fieldErrors.time && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.time}
                </p>
              )}
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
