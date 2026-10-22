import React, { useState } from 'react'
import { Client, Matter, Appointment } from '@/types/crm'
import { formatDueDate } from '@/lib/crmUtils'
import { X, User, Building2, Plus } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'Contact' | 'Consultations' | 'Applications' | 'History'>('Contact')

  // Edit fields
  const [name, setName] = useState(client?.name || '')
  const [phone, setPhone] = useState(client?.phone || '')
  const [email, setEmail] = useState(client?.email || '')
  const [dob, setDob] = useState(client?.dob || '')
  const [uci, setUci] = useState(client?.uci || '')
  const [address, setAddress] = useState(client?.address || '')
  const [status, setStatus] = useState(client?.status || 'Work permit')
  const [expiry, setExpiry] = useState(client?.expiry || '')
  const [receptionAlert, setReceptionAlert] = useState(client?.receptionAlert || '')
  const [historyNotes, setHistoryNotes] = useState(client?.history || '')
  const [consultNotes, setConsultNotes] = useState(client?.notes || '')
  const [risks, setRisks] = useState(client?.risks || '')
  const [strategy, setStrategy] = useState(client?.strategy || '')

  // Employer fields
  const [contacts, setContacts] = useState(client?.contacts || '')
  const [locations, setLocations] = useState(client?.locations || '')
  const [workers, setWorkers] = useState(client?.workers || '')

  // Consultation outcome
  const [consultationOutcome, setConsultationOutcome] = useState<'No Change' | 'Retained' | 'Potential' | 'Closed'>('No Change')
  const [outcomeReason, setOutcomeReason] = useState('')
  const [followupDate, setFollowupDate] = useState('')

  if (!isOpen || !client) return null

  const clientMatters = matters.filter((m) => m.clientId === client.id)
  const clientAppointments = appointments.filter((a) => a.client === client.id)

  const handleSave = (openMatterAfter: boolean = false) => {
    const updated: Client = {
      ...client,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      dob: client.kind === 'Individual' ? dob : undefined,
      uci: uci.trim(),
      address: address.trim(),
      status: client.kind === 'Individual' ? status : undefined,
      expiry: client.kind === 'Individual' ? expiry : undefined,
      receptionAlert: receptionAlert.trim(),
      history: historyNotes.trim(),
      notes: consultNotes.trim(),
      risks: risks.trim(),
      strategy: strategy.trim(),
      contacts: client.kind === 'Employer' ? contacts.trim() : undefined,
      locations: client.kind === 'Employer' ? locations.trim() : undefined,
      workers: client.kind === 'Employer' ? workers.trim() : undefined
    }

    onSaveClient(updated)
    if (openMatterAfter) {
      onNewMatterForClient(client.id)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-2xl 2xl:max-w-3xl overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#12382e] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {client.kind === 'Employer' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-[#12382e]">{client.name}</h2>
                <span className="badge blue text-[11px]">{client.kind}</span>
                <span className="text-[12px] text-[#8ba79b]">({client.id})</span>
              </div>
              <div className="text-[11.5px] sm:text-[12px] text-[#677472]">
                {client.phone} · {client.email || 'No email'} · {client.uci || 'UCI: Pending'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8a9895] hover:text-[#202d2d] rounded-md shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-6 bg-[#f8faf9] border-b border-[#edf0ee] flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none">
          {[
            ['Contact', 'Profile Info'],
            ['Consultations', 'Consultation & Strategy'],
            ['Applications', `Applications (${clientMatters.length})`],
            ['History', 'Visits & Appointments']
          ].map(([tabKey, label]) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey as any)}
              className={`py-3 px-2 sm:px-3 text-[12.5px] sm:text-[13px] font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tabKey
                  ? 'border-[#a7653b] text-[#a7653b]'
                  : 'border-transparent text-[#677472] hover:text-[#202d2d]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-[13.5px] space-y-4">
          {/* TAB 1: CONTACT */}
          {activeTab === 'Contact' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">
                  {client.kind === 'Employer' ? 'Company Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                  />
                </div>
              </div>

              {client.kind === 'Individual' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#202d2d] mb-1">UCI Number</label>
                      <input
                        type="text"
                        value={uci}
                        onChange={(e) => setUci(e.target.value)}
                        className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#202d2d] mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#202d2d] mb-1">Current Immigration Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                      >
                        <option value="Work permit">Work permit</option>
                        <option value="Study permit">Study permit</option>
                        <option value="Visitor">Visitor</option>
                        <option value="Permanent resident">Permanent resident</option>
                        <option value="Refugee Claimant">Refugee Claimant</option>
                        <option value="Out of status">Out of status</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-[#202d2d] mb-1">Status Expiry Date</label>
                      <input
                        type="date"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#202d2d] mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, City, Postal Code"
                      className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-[#202d2d] mb-1">Company Contacts</label>
                    <input
                      type="text"
                      value={contacts}
                      onChange={(e) => setContacts(e.target.value)}
                      className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202d2d] mb-1">Work Locations</label>
                    <input
                      type="text"
                      value={locations}
                      onChange={(e) => setLocations(e.target.value)}
                      className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#202d2d] mb-1">Foreign Workers</label>
                    <input
                      type="text"
                      value={workers}
                      onChange={(e) => setWorkers(e.target.value)}
                      placeholder="e.g. 1 foreign worker Carpenter"
                      className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Reception Warning Alert (Optional)</label>
                <input
                  type="text"
                  value={receptionAlert}
                  onChange={(e) => setReceptionAlert(e.target.value)}
                  placeholder="Notes shown to reception during booking calls..."
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none text-[#ae4343]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONSULTATIONS */}
          {activeTab === 'Consultations' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">
                  Immigration History / Previous Refusals
                </label>
                <textarea
                  rows={2}
                  value={historyNotes}
                  onChange={(e) => setHistoryNotes(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#202d2d] mb-1">Consultation Discussion Notes</label>
                <textarea
                  rows={3}
                  value={consultNotes}
                  onChange={(e) => setConsultNotes(e.target.value)}
                  className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">Risks & Important Facts</label>
                  <textarea
                    rows={2}
                    value={risks}
                    onChange={(e) => setRisks(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202d2d] mb-1">Recommended Legal Strategy</label>
                  <textarea
                    rows={2}
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
                  />
                </div>
              </div>

              {/* Consultation Outcome Section */}
              <div className="p-3.5 bg-[#f0f5f2] border border-[#c5ddd0] rounded-lg space-y-3">
                <div className="font-bold text-[#12382e] text-[13px]">Consultation Decision & Outcome</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#677472] mb-1">Outcome Status</label>
                    <select
                      value={consultationOutcome}
                      onChange={(e) => setConsultationOutcome(e.target.value as any)}
                      className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                    >
                      <option value="No Change">No Change / In Review</option>
                      <option value="Retained">Retained (Proceed to Open Matter)</option>
                      <option value="Potential">Potential Client (Follow-up scheduled)</option>
                      <option value="Closed">Closed / Not Proceeding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#677472] mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={followupDate}
                      onChange={(e) => setFollowupDate(e.target.value)}
                      className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
                    />
                  </div>
                </div>

                {['Potential', 'Closed'].includes(consultationOutcome) && (
                  <div>
                    <label className="block text-[12px] font-semibold text-[#677472] mb-1">
                      Reason / Solution Discussed *
                    </label>
                    <input
                      type="text"
                      value={outcomeReason}
                      onChange={(e) => setOutcomeReason(e.target.value)}
                      placeholder="e.g. Needs to obtain IELTS result first; follow-up scheduled"
                      className="w-full p-2 border border-[#cbd5d1] rounded-md bg-white outline-none text-[13px]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: APPLICATIONS */}
          {activeTab === 'Applications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[15px] text-[#202d2d]">Associated Matters</h3>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onNewMatterForClient(client.id)
                  }}
                  className="px-3 py-1.5 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded text-[12.5px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start New Application</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {clientMatters.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 bg-[#f8faf9] border border-[#edf0ee] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#12382e]">{m.type}</div>
                      <div className="text-[11.5px] text-[#677472]">
                        {m.id} · Case Manager: {m.owner} · Stage {m.stage} ({m.ball})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onOpenMatter(m.id)
                      }}
                      className="px-3 py-1 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded text-[12px] font-semibold text-[#202d2d]"
                    >
                      Open matter
                    </button>
                  </div>
                ))}

                {clientMatters.length === 0 && (
                  <div className="text-center py-8 text-[#8ba79b]">
                    No open matters for this client. Click "Start New Application" above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'History' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[15px] text-[#202d2d]">Appointment & Visit History</h3>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onBookAppointmentForClient(client.id)
                  }}
                  className="text-[12.5px] font-semibold text-[#a7653b] hover:underline"
                >
                  + Book new appointment
                </button>
              </div>

              <div className="space-y-2">
                {clientAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="p-2.5 bg-[#f8faf9] border border-[#edf0ee] rounded-lg text-[13px] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#12382e]">
                        {formatDueDate(a.date)} · {a.time} ({a.duration}m)
                      </div>
                      <div className="text-[11.5px] text-[#677472]">{a.notes || a.service}</div>
                    </div>
                    <span className="badge green">{a.status}</span>
                  </div>
                ))}

                {clientAppointments.length === 0 && (
                  <div className="text-center py-6 text-[#8ba79b]">
                    No past appointments recorded for this profile.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#edf0ee] bg-[#fcfdfd] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-3.5 py-2 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md text-[13px] font-semibold shadow-xs"
          >
            Save & Open Matter
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#cbd5d1] text-[#202d2d] hover:bg-[#f4f6f5] rounded-md font-semibold text-[13px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md font-semibold text-[13px] shadow-xs"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
