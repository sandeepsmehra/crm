import React, { useState, useMemo } from 'react'
import { Appointment, Client } from '@/types/crm'
import { APPLICATION_TYPES, TODAY } from '@/data/mockData'
import { normalizePhone, formatDueDate, formatClock, addDays } from '@/lib/crmUtils'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Phone, 
  Search 
} from 'lucide-react'

interface AppointmentsViewProps {
  appointments: Appointment[]
  clients: Client[]
  onBookAppointment: (date?: string, time?: string) => void
  onEditAppointment: (appointment: Appointment) => void
  onUpdateCell: (id: number, key: keyof Appointment, value: any) => void
  onMarkRetained: (appointment: Appointment) => void
  onOpenMatter: (matterId: string) => void
  onNewClient: (initialPhone?: string) => void
}

export function AppointmentsView({
  appointments,
  clients,
  onBookAppointment,
  onEditAppointment,
  onUpdateCell,
  onMarkRetained,
  onOpenMatter,
  onNewClient
}: AppointmentsViewProps) {
  const [weekStart, setWeekStart] = useState('2026-10-05')
  const [selectedDay, setSelectedDay] = useState<string>('Week')
  const [searchQuery, setSearchQuery] = useState('')
  const [phoneLookup, setPhoneLookup] = useState('')
  const [viewMode, setViewMode] = useState<'Sheet' | 'Calendar'>('Sheet')
  const [statusFilter, setStatusFilter] = useState('All')

  // Generate 5 week days (Mon-Fri)
  const weekDays = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i))
  }, [weekStart])

  // Phone lookup matches
  const phoneMatches = useMemo(() => {
    const norm = normalizePhone(phoneLookup)
    if (norm.length < 7) return []
    return clients.filter((c) => normalizePhone(c.phone).includes(norm))
  }, [phoneLookup, clients])

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      // Date filter
      if (selectedDay === 'Week') {
        if (!weekDays.includes(a.date)) return false
      } else {
        if (a.date !== selectedDay) return false
      }

      // Status filter
      if (statusFilter !== 'All' && a.status !== statusFilter) return false

      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const client = clients.find((c) => c.id === a.client)
        const hay = [
          client?.name || '',
          a.phone,
          a.notes,
          a.service,
          a.source,
          a.consultant
        ].join(' ').toLowerCase()
        if (!hay.includes(q)) return false
      }

      return true
    })
  }, [appointments, weekDays, selectedDay, statusFilter, searchQuery, clients])

  // Summary counts
  const totalBookedThisWeek = appointments.filter((a) => weekDays.includes(a.date) && !['Cancelled', 'No-show'].includes(a.status)).length
  const confirmedCount = appointments.filter((a) => weekDays.includes(a.date) && a.status === 'Confirmed').length
  const waitingCount = appointments.filter((a) => weekDays.includes(a.date) && a.status === 'Waiting').length

  const activeDates = selectedDay === 'Week' ? weekDays : [selectedDay]

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Reception Desk · Weekly Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Appointments
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            Manage consultations, follow-up calls, and reception intake schedule.
          </p>
        </div>

        <button
          onClick={() => onBookAppointment(selectedDay === 'Week' ? TODAY : selectedDay)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New appointment</span>
        </button>
      </div>

      {/* Week Summary Banner */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white border border-[#dfe5e3] rounded-xl shadow-2xs text-[13.5px]">
        <div>
          <strong className="text-xl font-bold text-[#12382e]">{totalBookedThisWeek}</strong>
          <span className="text-[#677472] ml-1.5">booked this week</span>
        </div>
        <div className="h-4 w-px bg-[#dfe5e3]" />
        <div>
          <strong className="text-xl font-bold text-[#246b54]">{confirmedCount}</strong>
          <span className="text-[#677472] ml-1.5">confirmed</span>
        </div>
        <div className="h-4 w-px bg-[#dfe5e3]" />
        <div>
          <strong className="text-xl font-bold text-[#976314]">{waitingCount}</strong>
          <span className="text-[#677472] ml-1.5">in waiting room</span>
        </div>
        <div className="ml-auto text-[12px] text-[#8ba79b] font-medium hidden sm:block">
          America/Vancouver · Pacific Time
        </div>
      </div>

      {/* Phone Lookup Card */}
      <div className="bg-[#f0f5f3] border border-[#d2e2db] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center gap-2 text-[#12382e] font-bold text-[14px] mb-2">
          <Phone className="w-4 h-4 text-[#246b54]" />
          <span>Find existing client by phone number</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="tel"
              placeholder="Enter phone number (e.g. 604-555-0101)..."
              value={phoneLookup}
              onChange={(e) => setPhoneLookup(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#b9d0c6] rounded-md text-[13.5px] text-[#202d2d] focus:border-[#246b54] outline-none"
            />
            {phoneLookup && (
              <button
                onClick={() => setPhoneLookup('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#677472]"
              >
                ✕
              </button>
            )}
          </div>
          <span className="text-[12px] text-[#677472]">
            Instant duplicate verification before booking
          </span>
        </div>

        {/* Matches / Empty state */}
        {phoneLookup.length >= 7 && (
          <div className="mt-3 p-3 bg-white border border-[#c2d9cf] rounded-lg">
            {phoneMatches.length > 0 ? (
              <div className="space-y-2">
                <div className="text-[12px] font-bold text-[#176328]">
                  Existing client profile found:
                </div>
                {phoneMatches.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between p-2 bg-[#f8faf9] rounded border border-[#edf0ee]"
                  >
                    <div>
                      <div className="font-bold text-[#12382e] text-[13px]">{client.name}</div>
                      <div className="text-[11.5px] text-[#677472]">
                        {client.phone} · {client.email || 'No email recorded'} · Status: {client.status || 'Client'}
                      </div>
                    </div>
                    <button
                      onClick={() => onBookAppointment(TODAY)}
                      className="px-3 py-1 bg-[#246b54] hover:bg-[#1a503e] text-white rounded text-[12px] font-semibold transition-colors"
                    >
                      Book appointment
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12.5px] text-[#677472]">
                  No existing client with phone number <span className="font-mono font-bold text-[#202d2d]">{phoneLookup}</span>.
                </span>
                <button
                  onClick={() => onNewClient(phoneLookup)}
                  className="px-3 py-1.5 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded text-[12px] font-semibold transition-colors whitespace-nowrap"
                >
                  Create Client File
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Week Selector, Day Tabs & View Toggle */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white p-3 border border-[#dfe5e3] rounded-xl shadow-2xs">
        {/* Week navigation buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWeekStart((prev) => addDays(prev, -7))}
            className="p-1.5 bg-[#f4f6f5] hover:bg-[#e8ecea] border border-[#cbd5d1] rounded text-[#202d2d]"
            title="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekStart('2026-10-05')}
            className="px-3 py-1.5 bg-[#f4f6f5] hover:bg-[#e8ecea] border border-[#cbd5d1] rounded text-[13px] font-semibold text-[#202d2d]"
          >
            This week
          </button>
          <button
            onClick={() => setWeekStart((prev) => addDays(prev, 7))}
            className="p-1.5 bg-[#f4f6f5] hover:bg-[#e8ecea] border border-[#cbd5d1] rounded text-[#202d2d]"
            title="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-[13px] font-bold text-[#12382e] ml-1 sm:ml-2">
            {formatDueDate(weekStart)} – {formatDueDate(weekDays[4])}, 2026
          </span>
        </div>

        {/* View Toggle & Status Filter */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-[#8a9895] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter sheet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 bg-[#f4f6f5] border border-[#cbd5d1] rounded-md text-[12.5px] text-[#202d2d] w-full sm:w-36 sm:focus:w-44 transition-all outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2 bg-white border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] outline-none"
          >
            <option value="All">All statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No-show">No-show</option>
          </select>

          <div className="flex p-0.5 bg-[#edf1ef] rounded-lg border border-[#dfe5e3]">
            <button
              onClick={() => setViewMode('Sheet')}
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold transition-all ${
                viewMode === 'Sheet'
                  ? 'bg-white text-[#12382e] shadow-2xs'
                  : 'text-[#677472] hover:text-[#202d2d]'
              }`}
            >
              Spreadsheet
            </button>
            <button
              onClick={() => setViewMode('Calendar')}
              className={`px-3 py-1 rounded-md text-[12.5px] font-semibold transition-all ${
                viewMode === 'Calendar'
                  ? 'bg-white text-[#12382e] shadow-2xs'
                  : 'text-[#677472] hover:text-[#202d2d]'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Strip Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedDay('Week')}
          className={`flex-1 min-w-[110px] p-2.5 rounded-lg border text-left transition-all ${
            selectedDay === 'Week'
              ? 'bg-[#12382e] text-white border-[#12382e] shadow-xs'
              : 'bg-white text-[#202d2d] border-[#dfe5e3] hover:bg-[#f8faf9]'
          }`}
        >
          <div className="font-bold text-[13.5px]">Whole week</div>
          <div className={`text-[11px] ${selectedDay === 'Week' ? 'text-[#cbd4d1]' : 'text-[#677472]'}`}>
            {totalBookedThisWeek} bookings
          </div>
        </button>

        {weekDays.map((d) => {
          const dateObj = new Date(d + 'T12:00:00Z')
          const weekdayName = dateObj.toLocaleDateString('en-CA', { weekday: 'short', timeZone: 'UTC' })
          const count = appointments.filter((a) => a.date === d).length
          const isToday = d === TODAY
          const isSelected = selectedDay === d

          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex-1 min-w-[110px] p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#12382e] text-white border-[#12382e] shadow-xs'
                  : 'bg-white text-[#202d2d] border-[#dfe5e3] hover:bg-[#f8faf9]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[13.5px]">{weekdayName}</span>
                {isToday && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-[#d5a17e] text-white' : 'bg-[#246b54] text-white'
                  }`}>
                    Today
                  </span>
                )}
              </div>
              <div className={`text-[11px] ${isSelected ? 'text-[#cbd4d1]' : 'text-[#677472]'}`}>
                {formatDueDate(d)} · {count} booked
              </div>
            </button>
          )
        })}
      </div>

      {/* View Mode: Spreadsheet Reception Sheet */}
      {viewMode === 'Sheet' && (
        <div className="appointment-sheet-scroll shadow-xs">
          <table className="appointment-sheet">
            <colgroup>
              <col style={{ width: '160px' }} />
              <col style={{ width: '110px' }} />
              <col style={{ width: '135px' }} />
              <col style={{ width: '175px' }} />
              <col style={{ width: '380px' }} />
              <col style={{ width: '100px' }} />
              <col style={{ width: '130px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '130px' }} />
            </colgroup>
            <thead>
              <tr>
                <th>Names</th>
                <th>Date Called</th>
                <th>Contact No.</th>
                <th>Service requested</th>
                <th>Client situation / Notes</th>
                <th>Time</th>
                <th>Reference</th>
                <th>Confirmation</th>
                <th className="follow-header">Follow Up</th>
              </tr>
            </thead>
            <tbody>
              {activeDates.map((dateStr) => {
                const dateObj = new Date(dateStr + 'T12:00:00Z')
                const fullDateTitle = dateObj.toLocaleDateString('en-CA', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC'
                })

                const sections: Array<{ id: 'Clients' | 'Staff' | 'Follow-ups'; label: string; bandClass?: string }> = [
                  { id: 'Clients', label: 'Clients' },
                  { id: 'Staff', label: 'STAFF', bandClass: 'staff-band' },
                  { id: 'Follow-ups', label: 'FOLLOW-UPS', bandClass: 'follow-band' }
                ]

                return (
                  <React.Fragment key={dateStr}>
                    {/* Date Band Header */}
                    <tr className="date-band">
                      <td colSpan={9}>
                        <div className="flex items-center justify-between">
                          <span>{fullDateTitle}</span>
                          <button
                            onClick={() => onBookAppointment(dateStr)}
                            className="text-[11.5px] font-semibold bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded cursor-pointer"
                          >
                            + Add appointment
                          </button>
                        </div>
                      </td>
                    </tr>

                    {sections.map((sec) => {
                      const records = filteredAppointments.filter(
                        (a) => a.date === dateStr && (a.section || 'Clients') === sec.id
                      )

                      return (
                        <React.Fragment key={sec.id}>
                          {sec.id !== 'Clients' && (
                            <tr className={`section-band ${sec.bandClass}`}>
                              <td colSpan={9}>{sec.label}</td>
                            </tr>
                          )}

                          {records.map((a) => {
                            const client = clients.find((c) => c.id === a.client)
                            return (
                              <tr key={a.id}>
                                {/* Name column */}
                                <td>
                                  <button
                                    onClick={() => onEditAppointment(a)}
                                    className={`font-bold text-left block text-[#12382e] hover:text-[#a7653b] hover:underline ${
                                      a.status === 'Cancelled' ? 'line-through text-red-600' : ''
                                    }`}
                                  >
                                    {client?.name || 'Unnamed Client'}
                                  </button>
                                  <div className="text-[11px] text-[#677472]">{a.consultant}</div>
                                  {a.retainedMatterId ? (
                                    <button
                                      onClick={() => onOpenMatter(a.retainedMatterId!)}
                                      className="retained-link"
                                    >
                                      Retained · Open file
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => onMarkRetained(a)}
                                      className="retain-action"
                                    >
                                      Mark retained
                                    </button>
                                  )}
                                </td>

                                {/* Date Called */}
                                <td>
                                  <input
                                    type="date"
                                    value={a.called || ''}
                                    onChange={(e) => onUpdateCell(a.id, 'called', e.target.value)}
                                  />
                                </td>

                                {/* Contact No. */}
                                <td>
                                  <input
                                    type="text"
                                    value={a.phone || ''}
                                    onChange={(e) => onUpdateCell(a.id, 'phone', e.target.value)}
                                  />
                                </td>

                                {/* Service requested */}
                                <td>
                                  <select
                                    value={a.service || 'Spousal Sponsorship'}
                                    onChange={(e) => onUpdateCell(a.id, 'service', e.target.value)}
                                  >
                                    {APPLICATION_TYPES.map((t) => (
                                      <option key={t} value={t}>
                                        {t}
                                      </option>
                                    ))}
                                  </select>
                                </td>

                                {/* Client situation / Notes */}
                                <td>
                                  <textarea
                                    rows={1}
                                    value={a.notes || ''}
                                    onChange={(e) => onUpdateCell(a.id, 'notes', e.target.value)}
                                    placeholder="Enter situation notes..."
                                  />
                                </td>

                                {/* Time */}
                                <td>
                                  <button
                                    onClick={() => onEditAppointment(a)}
                                    className="font-semibold text-[#12382e] hover:underline text-left block"
                                  >
                                    {formatClock(a.time)}
                                  </button>
                                  <div className="text-[11px] text-[#677472]">{a.duration} min</div>
                                </td>

                                {/* Reference / Source */}
                                <td>
                                  <input
                                    type="text"
                                    value={a.source || ''}
                                    onChange={(e) => onUpdateCell(a.id, 'source', e.target.value)}
                                  />
                                </td>

                                {/* Confirmation select */}
                                <td>
                                  <select
                                    value={a.confirmation || a.status}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      onUpdateCell(a.id, 'confirmation', val)
                                      if (['Scheduled', 'Confirmed', 'Waiting', 'In Consultation', 'Completed', 'Cancelled', 'No-show'].includes(val)) {
                                        onUpdateCell(a.id, 'status', val)
                                      }
                                    }}
                                    className={`font-semibold ${
                                      a.confirmation === 'Confirmed'
                                        ? 'text-emerald-700'
                                        : a.confirmation === 'Not answered'
                                        ? 'text-amber-700'
                                        : ''
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Not answered">Not answered</option>
                                    <option value="Left message">Left message</option>
                                    <option value="Waiting">Waiting</option>
                                    <option value="In Consultation">In Consultation</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="No-show">No-show</option>
                                  </select>
                                </td>

                                {/* Follow Up */}
                                <td>
                                  <input
                                    type="date"
                                    value={a.followup || ''}
                                    onChange={(e) => onUpdateCell(a.id, 'followup', e.target.value)}
                                  />
                                  <div className="text-[11px] text-[#677472] mt-0.5">
                                    {a.reminder || 'Pending'} reminder
                                  </div>
                                </td>
                              </tr>
                            )
                          })}

                          {records.length === 0 && (
                            <tr className="empty-sheet-row">
                              <td colSpan={9} className="text-center py-2 text-[#8ba79b]">
                                <button
                                  onClick={() => onBookAppointment(dateStr)}
                                  className="text-[12px] text-[#677472] hover:text-[#12382e] hover:underline"
                                >
                                  + Add {sec.label.toLowerCase()} appointment
                                </button>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Mode: Calendar View */}
      {viewMode === 'Calendar' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-3 sm:p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-5 gap-3">
            {weekDays.map((d) => {
              const dateObj = new Date(d + 'T12:00:00Z')
              const weekday = dateObj.toLocaleDateString('en-CA', { weekday: 'long', timeZone: 'UTC' })
              const daysAppts = filteredAppointments.filter((a) => a.date === d)
              const isToday = d === TODAY

              return (
                <div
                  key={d}
                  className={`border rounded-lg p-3 min-h-[320px] flex flex-col ${
                    isToday ? 'bg-[#f8fbf9] border-[#246b54]' : 'bg-white border-[#dfe5e3]'
                  }`}
                >
                  <div className="border-b border-[#edf0ee] pb-2 mb-2 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[13px] text-[#12382e]">{weekday}</div>
                      <div className="text-[11px] text-[#677472]">{formatDueDate(d)}</div>
                    </div>
                    {isToday && (
                      <span className="badge green text-[10px]">Today</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    {daysAppts.map((a) => {
                      const client = clients.find((c) => c.id === a.client)
                      return (
                        <div
                          key={a.id}
                          onClick={() => onEditAppointment(a)}
                          className="p-2 rounded bg-[#edf4ff] border-l-4 border-l-[#356c8d] text-[12px] cursor-pointer hover:shadow-xs transition-all"
                        >
                          <div className="font-bold text-[#12382e] truncate">
                            {client?.name || 'Client'}
                          </div>
                          <div className="text-[11px] text-[#356c8d] font-semibold">
                            {formatClock(a.time)} · {a.duration}m
                          </div>
                          <div className="text-[11px] text-[#677472] truncate">
                            {a.service}
                          </div>
                        </div>
                      )
                    })}

                    {daysAppts.length === 0 && (
                      <div className="text-center py-8 text-[11px] text-[#8ba79b]">
                        No bookings
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onBookAppointment(d)}
                    className="mt-2 w-full py-1 text-[11px] font-semibold text-[#a7653b] hover:bg-[#faf4ee] rounded border border-dashed border-[#d5a17e] transition-colors"
                  >
                    + Book slot
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
