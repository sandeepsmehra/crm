import React, { useState } from 'react'
import { Client, Matter, Appointment } from '@/types/crm'
import { toast } from '@/components/ui/sonner'
import { X, ChevronRight, ChevronDown } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface ClientProfileModalProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  matters: Matter[]
  appointments: Appointment[]
  onSaveClient: (updated: Client) => void
  onOpenMatter: (matterId: string) => void
  onNewMatterForClient: (clientId: string) => void
  onBookAppointmentForClient: (clientId: string) => void
}

type ProfileTab =
  | 'Contact Information'
  | 'Consultation Notes'
  | 'Applications'
  | 'Communication Log'
  | 'Appointments & History'

export function ClientProfileModal({
  isOpen,
  onClose,
  client,
  matters,
  appointments,
  onSaveClient,
  onOpenMatter,
  onNewMatterForClient,
  onBookAppointmentForClient
}: ClientProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Contact Information')

  // Form states (SCR-023)
  const [receptionAlert, setReceptionAlert] = useState(client?.receptionAlert || '')
  const [fullName, setFullName] = useState(client?.name || '')
  const [phone, setPhone] = useState(client?.phone || '')
  const [email, setEmail] = useState(client?.email || '')
  const [dob, setDob] = useState(client?.dob || '1970-01-10')
  const [address, setAddress] = useState(client?.address || '100 Example Street, Surrey, BC')
  const [uci, setUci] = useState(client?.uci || 'DEMO-20000')
  const [immigrationStatus, setImmigrationStatus] = useState(client?.status || 'Visitor')
  const [statusExpiry, setStatusExpiry] = useState(client?.expiry || '')
  const [preferredLanguage, setPreferredLanguage] = useState(client?.preferredLanguage || 'English')

  // Consultation Notes states (SCR-024)
  const [generalBackgroundOpen, setGeneralBackgroundOpen] = useState(false)
  const [consultationNotesText, setConsultationNotesText] = useState(client?.notes || '')

  // Communication Log states (SCR-026)
  const [commType, setCommType] = useState('Phone call')
  const [commDate, setCommDate] = useState('2026-10-22')
  const [commSummary, setCommSummary] = useState('')

  // Appointments History state (SCR-027)
  const [appt1Open, setAppt1Open] = useState(false)
  const [appt2Open, setAppt2Open] = useState(false)

  if (!isOpen || !client) return null

  const clientMatters = matters.filter((m) => m.clientId === client.id)

  const handleSave = () => {
    onSaveClient({
      ...client,
      name: fullName,
      phone,
      email,
      dob,
      address,
      uci,
      status: immigrationStatus,
      expiry: statusExpiry,
      receptionAlert,
      notes: consultationNotesText,
      preferredLanguage
    })
    toast.success('Client profile saved')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#d1d5db] w-full max-w-4xl overflow-hidden my-auto animate-fade-in flex flex-col max-h-[92vh]">
        {/* Modal Header (SCR-023 to SCR-027) */}
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#111827]">
              Client profile · {fullName}
            </h1>
            <div className="text-xs text-[#6b7280] mt-1">
              {client.id} · {phone}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-black/80 flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Pill Tabs Row (SCR-023) */}
        <div className="px-6 flex flex-wrap items-center gap-2 select-none border-b border-[#e5e7eb] pb-4">
          {(
            [
              'Contact Information',
              'Consultation Notes',
              'Applications',
              'Communication Log',
              'Appointments & History'
            ] as ProfileTab[]
          ).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#1f382f] text-white'
                    : 'bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: CONTACT INFORMATION (SCR-023)                     */}
          {/* ======================================================== */}
          {activeTab === 'Contact Information' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111827]">Contact Information</h2>

              {/* Reception Alert Box */}
              <div className="bg-[#fffdf5] border border-[#fde68a] rounded-xl p-4 space-y-2">
                <label className="block text-sm font-bold text-[#111827]">
                  Reception Alert — internal booking instructions
                </label>
                <textarea
                  rows={3}
                  value={receptionAlert}
                  onChange={(e) => setReceptionAlert(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg p-2.5 text-sm text-[#111827] outline-none"
                />
                <p className="text-xs text-[#6b7280]">
                  Shown to reception when this client is selected for booking. Reception must confirm the client was informed and agreed. Leave blank to clear.
                </p>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Phone number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    UCI / reference
                  </label>
                  <input
                    type="text"
                    value={uci}
                    onChange={(e) => setUci(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Current immigration status
                  </label>
                  <input
                    type="text"
                    value={immigrationStatus}
                    onChange={(e) => setImmigrationStatus(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Status expiry
                  </label>
                  <input
                    type="date"
                    value={statusExpiry}
                    onChange={(e) => setStatusExpiry(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Preferred language
                  </label>
                  <input
                    type="text"
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CONSULTATION NOTES (SCR-024)                      */}
          {/* ======================================================== */}
          {activeTab === 'Consultation Notes' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111827]">Consultation Notes</h2>

              <div className="rounded-xl border border-[#e5e7eb] overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1f382f] text-white font-semibold">
                    <tr>
                      <th className="py-3 px-4">Consultation</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Consultation type</th>
                      <th className="py-3 px-4">Brief notes</th>
                      <th className="py-3 px-4 text-right">+</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-[#e5e7eb] hover:bg-[#fafbfb]">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">1st Consultation</td>
                      <td className="py-3.5 px-4 text-[#374151]">2026-09-28</td>
                      <td className="py-3.5 px-4 text-[#a75928] font-medium">Initial consultation</td>
                      <td className="py-3.5 px-4 text-[#374151]">Discuss Work Permit</td>
                      <td className="py-3.5 px-4 text-right text-base text-[#6b7280] font-bold">+</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <button
                  onClick={() => toast.info('New consultation opened')}
                  className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  + Add Consultation
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setGeneralBackgroundOpen(!generalBackgroundOpen)}
                  className="flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#a75928] cursor-pointer"
                >
                  {generalBackgroundOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>General background & previously saved profile notes</span>
                </button>
                {generalBackgroundOpen && (
                  <div className="mt-3">
                    <textarea
                      rows={5}
                      value={consultationNotesText}
                      onChange={(e) => setConsultationNotesText(e.target.value)}
                      placeholder="Add general notes..."
                      className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: APPLICATIONS (SCR-025)                            */}
          {/* ======================================================== */}
          {activeTab === 'Applications' && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-[#111827]">Applications</h2>

              <button
                onClick={() => {
                  onClose()
                  onNewMatterForClient(client.id)
                }}
                className="bg-[#1f382f] hover:bg-[#162a23] text-white px-4 py-2 rounded-lg font-medium text-xs transition-colors shadow-2xs cursor-pointer"
              >
                + Start Application
              </button>

              <div className="space-y-4 pt-1">
                {clientMatters.length > 0 ? (
                  clientMatters.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-5 border border-[#e5e7eb] rounded-xl bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-bold text-[#111827]">{m.type}</h3>
                          <div className="text-xs text-[#6b7280] mt-1">
                            Application No. {idx + 1} · Date created: Oct 8, 2026
                          </div>
                          <div className="text-xs text-[#6b7280]">
                            {m.id} · Submission deadline: {m.due || '2026-11-17'}
                          </div>
                        </div>
                        <span className="bg-[#f3f4f6] text-[#374151] px-3 py-1 rounded-full text-xs font-medium">
                          To-Do / Under Process
                        </span>
                      </div>

                      <p className="text-xs text-[#374151]">
                        {m.overview || `Demo case overview for ${client.name} (${m.type}).`}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() => {
                            onClose()
                            onOpenMatter(m.id)
                          }}
                          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                        >
                          Open application
                        </button>
                        <button
                          onClick={() => {
                            onClose()
                            onOpenMatter(m.id)
                          }}
                          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                        >
                          Case work & documents
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 border border-[#e5e7eb] rounded-xl bg-white shadow-2xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-[#111827]">Work Permit</h3>
                        <div className="text-xs text-[#6b7280] mt-1">
                          Application No. 1 · Date created: Oct 8, 2026
                        </div>
                        <div className="text-xs text-[#6b7280]">
                          NR-demo-01 · Submission deadline: 2026-11-17
                        </div>
                      </div>
                      <span className="bg-[#f3f4f6] text-[#374151] px-3 py-1 rounded-full text-xs font-medium">
                        To-Do / Under Process
                      </span>
                    </div>

                    <p className="text-xs text-[#374151]">
                      Demo case overview for {client.name} (Work Permit).
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => {
                          onClose()
                          onOpenMatter('NR-demo-01')
                        }}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Open application
                      </button>
                      <button
                        onClick={() => {
                          onClose()
                          onOpenMatter('NR-demo-01')
                        }}
                        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        Case work & documents
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: COMMUNICATION LOG (SCR-026)                       */}
          {/* ======================================================== */}
          {activeTab === 'Communication Log' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-[#111827]">Communication Log</h2>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Record a conversation or message. Saving a log entry does not send a message.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Communication type
                  </label>
                  <CustomSelect
                    value={commType}
                    options={["Phone call", "Email", "In-person meeting"]}
                    onChange={(val) => setCommType(val)}
                    triggerClassName="w-full bg-[#ebf3fc] border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    value={commDate}
                    onChange={(e) => setCommDate(e.target.value)}
                    className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Summary / follow-up
                </label>
                <textarea
                  rows={4}
                  value={commSummary}
                  onChange={(e) => setCommSummary(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
                />
              </div>

              <div>
                <button
                  onClick={() => {
                    toast.success('Log entry saved')
                    setCommSummary('')
                  }}
                  className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  Save log entry
                </button>
              </div>

              <p className="text-xs text-[#6b7280]">No communication entries yet.</p>

              <div className="pt-2 border-t border-[#e5e7eb] space-y-3">
                <h3 className="text-sm font-bold text-[#111827]">Calls & tasks already recorded</h3>
                <div className="space-y-0.5">
                  <div className="font-bold text-[#111827] text-sm">
                    {fullName} called asking for a file update. Call back.
                  </div>
                  <div className="text-xs text-[#6b7280]">
                    2026-10-18 · Sukhman · Pending
                  </div>
                </div>

                <button
                  onClick={() => toast.success('Call recorded and task assigned')}
                  className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  Save & record call / assign task
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: APPOINTMENTS & HISTORY (SCR-027)                  */}
          {/* ======================================================== */}
          {activeTab === 'Appointments & History' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#111827]">Appointments & History</h2>

              <div>
                <button
                  onClick={() => {
                    onClose()
                    onBookAppointmentForClient(client.id)
                  }}
                  className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                >
                  Save & book appointment
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <div>
                  <button
                    onClick={() => setAppt1Open(!appt1Open)}
                    className="flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#a75928] cursor-pointer"
                  >
                    {appt1Open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span>2026-10-21 11:00 · Scheduled · Tejinder</span>
                  </button>
                  {appt1Open && (
                    <div className="mt-2 ml-6 p-3 bg-[#fafbfb] border border-[#e5e7eb] rounded-lg text-xs text-[#374151]">
                      Follow-up consultation booked for work permit review.
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => setAppt2Open(!appt2Open)}
                    className="flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#a75928] cursor-pointer"
                  >
                    {appt2Open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span>2026-09-28 10:00 · Completed · Tejinder</span>
                  </button>
                  {appt2Open && (
                    <div className="mt-2 ml-6 p-3 bg-[#fafbfb] border border-[#e5e7eb] rounded-lg text-xs text-[#374151]">
                      Initial consultation completed; client retained Nationrise.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (SCR-023 to SCR-027) */}
        <div className="p-4 px-6 border-t border-[#e5e7eb] flex items-center justify-end gap-3 bg-white">
          {activeTab === 'Consultation Notes' ? (
            <button
              onClick={handleSave}
              className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-5 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              Close and Save
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-5 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#a75928] hover:bg-[#924c1f] text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
              >
                Save profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
