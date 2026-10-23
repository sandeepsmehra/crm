import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { APPLICATION_TYPES, STAFF_MEMBERS } from '@/data/mockData'
import { toast } from '@/components/ui/sonner'

interface MatterDetailViewProps {
  matter: Matter
  client?: Client
  onBack: () => void
  onUpdateMatter: (updated: Matter) => void
  onEditAssignment?: () => void
  onRecordSubmission?: () => void
  onRecordContact?: () => void
  onAddDeadline?: () => void
  onAddGovtRequest?: () => void
  onPreviewClientPortal?: (matterId: string) => void
}

type MatterTab =
  | 'Application Details'
  | 'Client Information'
  | 'Reminders'
  | 'Case Work & Notes'
  | 'Documents Received / Verified'

interface DocRow {
  id: string
  name: string
  receivedDate: string
  reviewDue: string
  status: string
  verifiedBy: string
  notes: string
}

export function MatterDetailView({
  matter,
  client,
  onBack,
  onUpdateMatter
}: MatterDetailViewProps) {
  const [activeTab, setActiveTab] = useState<MatterTab>('Application Details')

  // Application Details fields (SCR-040, SCR-041)
  const [appType, setAppType] = useState(matter.type || 'Spousal Sponsorship')
  const [customAppType, setCustomAppType] = useState('')
  const [caseManager, setCaseManager] = useState(matter.owner || 'Unassigned')
  const [caseOverview, setCaseOverview] = useState(matter.overview || '')
  const [extraNotes, setExtraNotes] = useState(matter.strategy || '')
  const [hasDependants, setHasDependants] = useState('No')
  const [itaDate, setItaDate] = useState('')
  const [deadlineSubmit, setDeadlineSubmit] = useState(matter.due || '')
  const [prNotes, setPrNotes] = useState('')

  // Client Information fields (SCR-042)
  const [clientName, setClientName] = useState(client?.name || 'Mei Lin Chen')
  const [clientPhone, setClientPhone] = useState(client?.phone || '604-555-0202')
  const [clientEmail, setClientEmail] = useState(client?.email || 'mei.lin.chen@example.test')
  const [clientDob, setClientDob] = useState(client?.dob || '1971-02-11')
  const [clientAddress, setClientAddress] = useState(client?.address || '101 Example Street, Surrey, BC')
  const [clientUci, setClientUci] = useState(client?.uci || 'DEMO-20001')
  const [immigrationStatus, setImmigrationStatus] = useState(client?.status || 'Worker')
  const [statusExpiry, setStatusExpiry] = useState(client?.expiry || '2027-01-01')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')

  // Case Work & Notes fields (SCR-044)
  const [newNote, setNewNote] = useState('')
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; text: string; time: string }>>([])

  // Documents fields (SCR-045)
  const [docRows, setDocRows] = useState<DocRow[]>([
    {
      id: 'd-1',
      name: 'PCC',
      receivedDate: '',
      reviewDue: '',
      status: 'Not received',
      verifiedBy: '',
      notes: ''
    },
    {
      id: 'd-2',
      name: 'IELTS',
      receivedDate: '',
      reviewDue: '',
      status: 'Not received',
      verifiedBy: '',
      notes: ''
    },
    {
      id: 'd-3',
      name: 'Experience Letters',
      receivedDate: '',
      reviewDue: '',
      status: 'Not received',
      verifiedBy: '',
      notes: ''
    }
  ])

  const handleSaveNote = () => {
    if (!newNote.trim()) return
    const noteEntry = {
      id: `n-${Date.now()}`,
      text: newNote.trim(),
      time: new Date().toLocaleString()
    }
    setSavedNotes([noteEntry, ...savedNotes])
    setNewNote('')
    toast.success('Note saved with timestamp')
  }

  const handleAddDocumentRow = () => {
    const newDoc: DocRow = {
      id: `d-${Date.now()}`,
      name: 'Passport',
      receivedDate: '',
      reviewDue: '',
      status: 'Not received',
      verifiedBy: '',
      notes: ''
    }
    setDocRows([...docRows, newDoc])
    toast.success('Added document requirement')
  }

  const handleUpdateDoc = (id: string, field: keyof DocRow, value: string) => {
    setDocRows((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    )
  }

  const handleDeleteApplication = () => {
    if (confirm('Are you sure you want to delete this application?')) {
      toast.success('Application deleted')
      onBack()
    }
  }

  const handleCloseFile = () => {
    toast.info('File marked as Closed — Not Proceeding')
    onBack()
  }

  const handleMoveToPR = () => {
    toast.success('Application moved to PR Applications')
    onBack()
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Breadcrumb & Title (SCR-040) */}
      <div>
        <div className="text-xs text-[#6b7280]">
          <span className="hover:underline cursor-pointer" onClick={onBack}>
            To-Do List
          </span>{' '}
          / Retained Clients
        </div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#111827] mt-1">
          Application
        </h1>
      </div>

      {/* Client Info Card Banner (SCR-040) */}
      <div className="bg-[#e9f2ec] border border-[#d2e3d7] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold text-[#111827]">{clientName}</h2>
            <span className="text-xs text-[#166534] font-medium">From client profile</span>
          </div>
          <div className="text-xs text-[#374151] mt-1">
            {clientPhone} · {clientEmail}
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-5 py-2 text-sm font-medium transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          View Client Profile
        </button>
      </div>

      {/* Matter Subtitle */}
      <div className="text-xs text-[#6b7280]">
        {matter.id || 'NR-demo-02'} · Retained
      </div>

      {/* Pill Tabs (SCR-040) */}
      <div className="flex flex-wrap items-center gap-2 select-none pt-1">
        {(
          [
            'Application Details',
            'Client Information',
            'Reminders',
            'Case Work & Notes',
            'Documents Received / Verified'
          ] as MatterTab[]
        ).map((t) => {
          const isActive = activeTab === t
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1f382f] text-white'
                  : 'bg-white border border-[#d1d5db] text-[#374151] hover:bg-[#f9fafb]'
              }`}
            >
              {t}
            </button>
          )
        })}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: APPLICATION DETAILS (SCR-040, SCR-041)           */}
      {/* ======================================================== */}
      {activeTab === 'Application Details' && (
        <div className="space-y-4">
          {/* Main Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-5">
            <h2 className="text-base font-bold text-[#111827]">Application Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Application Type
                </label>
                <select
                  value={appType}
                  onChange={(e) => setAppType(e.target.value)}
                  className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
                >
                  {APPLICATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Your application type
                </label>
                <input
                  type="text"
                  placeholder="e.g. with Restoration"
                  value={customAppType}
                  onChange={(e) => setCustomAppType(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Case Manager
              </label>
              <select
                value={caseManager}
                onChange={(e) => setCaseManager(e.target.value)}
                className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer max-w-md"
              >
                <option value="Unassigned">Unassigned</option>
                {STAFF_MEMBERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Case Overview
              </label>
              <textarea
                rows={7}
                value={caseOverview}
                onChange={(e) => setCaseOverview(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Extra Notes
              </label>
              <textarea
                rows={3}
                placeholder="Additional notes for this application"
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
              />
            </div>
          </div>

          {/* Dependants Card (SCR-041) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-[#111827]">Dependants</h2>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Any dependants?
              </label>
              <select
                value={hasDependants}
                onChange={(e) => setHasDependants(e.target.value)}
                className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>

          {/* PR Tracking Card (SCR-041) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-[#111827]">PR Tracking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  ITA date
                </label>
                <input
                  type="date"
                  value={itaDate}
                  onChange={(e) => setItaDate(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Deadline to Submit
                </label>
                <input
                  type="date"
                  value={deadlineSubmit}
                  onChange={(e) => setDeadlineSubmit(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Notes
              </label>
              <textarea
                rows={4}
                value={prNotes}
                onChange={(e) => setPrNotes(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CLIENT INFORMATION (SCR-042)                      */}
      {/* ======================================================== */}
      {activeTab === 'Client Information' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-5">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Client Information</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Shared with the main client profile and every application. Changes save automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Phone number
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Date of birth
              </label>
              <input
                type="date"
                value={clientDob}
                onChange={(e) => setClientDob(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Address
              </label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                UCI
              </label>
              <input
                type="text"
                value={clientUci}
                onChange={(e) => setClientUci(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Immigration status
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
                className="w-full bg-[#eaf4ee] border border-emerald-300 rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Emergency contact name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Relationship
              </label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: REMINDERS (SCR-043)                               */}
      {/* ======================================================== */}
      {activeTab === 'Reminders' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#111827]">Personal Reminders</h2>
            <button
              onClick={() => toast.info('Create reminder for this matter')}
              className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              + Create Reminder
            </button>
          </div>
          <p className="text-xs text-[#6b7280]">No open reminders for this application.</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CASE WORK & NOTES (SCR-044)                       */}
      {/* ======================================================== */}
      {activeTab === 'Case Work & Notes' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#111827]">Case Work & Notes</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Record last contact, what we are waiting for and progress. Each saved note keeps its own timestamp.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              New note
            </label>
            <textarea
              rows={5}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none leading-relaxed"
            />
          </div>

          <div>
            <button
              onClick={handleSaveNote}
              className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              Save Note
            </button>
          </div>

          <div className="pt-2">
            {savedNotes.length > 0 ? (
              <div className="space-y-3">
                {savedNotes.map((n) => (
                  <div key={n.id} className="p-3 bg-[#fafbfb] border border-[#e5e7eb] rounded-lg text-sm">
                    <div className="text-xs text-[#6b7280] mb-1 font-mono">{n.time}</div>
                    <div className="text-[#111827]">{n.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6b7280]">
                No notes yet. Add the first update for this application.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: DOCUMENTS RECEIVED / VERIFIED (SCR-045)           */}
      {/* ======================================================== */}
      {activeTab === 'Documents Received / Verified' && (
        <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#111827]">Documents Received / Verified</h2>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Edit directly in the list · Changes save automatically
              </p>
            </div>
            <button
              onClick={handleAddDocumentRow}
              className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              + Add Document
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3">DOCUMENT</th>
                  <th className="py-3 px-3">RECEIVED DATE</th>
                  <th className="py-3 px-3">REVIEW DUE</th>
                  <th className="py-3 px-3">COUNTDOWN</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">VERIFIED BY</th>
                  <th className="py-3 px-3">NOTES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {docRows.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#fbfcfb]">
                    {/* Document Dropdown */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={doc.name}
                        onChange={(e) => handleUpdateDoc(doc.id, 'name', e.target.value)}
                        className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer w-44"
                      >
                        <option value="PCC">PCC</option>
                        <option value="IELTS">IELTS</option>
                        <option value="Experience Letters">Experience Letters</option>
                        <option value="Passport">Passport</option>
                        <option value="Marriage certificate">Marriage certificate</option>
                      </select>
                      <div className="text-[11px] text-[#6b7280] mt-1">{clientName}</div>
                    </td>

                    {/* Received Date */}
                    <td className="py-3 px-3 align-top">
                      <input
                        type="date"
                        value={doc.receivedDate}
                        onChange={(e) => handleUpdateDoc(doc.id, 'receivedDate', e.target.value)}
                        className="bg-white border border-[#d1d5db] rounded-md px-2 py-1 text-xs text-[#111827] outline-none"
                      />
                    </td>

                    {/* Review Due */}
                    <td className="py-3 px-3 align-top">
                      <input
                        type="date"
                        value={doc.reviewDue}
                        onChange={(e) => handleUpdateDoc(doc.id, 'reviewDue', e.target.value)}
                        className="bg-white border border-[#d1d5db] rounded-md px-2 py-1 text-xs text-[#111827] outline-none"
                      />
                    </td>

                    {/* Countdown */}
                    <td className="py-3 px-3 align-top">
                      <span className="bg-[#f3f4f6] text-[#6b7280] px-2.5 py-1 rounded text-[11px] font-medium inline-block">
                        Set review due
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={doc.status}
                        onChange={(e) => handleUpdateDoc(doc.id, 'status', e.target.value)}
                        className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Not received">Not received</option>
                        <option value="Received">Received</option>
                        <option value="Verified">Verified</option>
                      </select>
                    </td>

                    {/* Verified By Dropdown */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={doc.verifiedBy}
                        onChange={(e) => handleUpdateDoc(doc.id, 'verifiedBy', e.target.value)}
                        className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="">Select manager</option>
                        {STAFF_MEMBERS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Notes */}
                    <td className="py-3 px-3 align-top">
                      <input
                        type="text"
                        placeholder="Type notes..."
                        value={doc.notes}
                        onChange={(e) => handleUpdateDoc(doc.id, 'notes', e.target.value)}
                        className="bg-white border border-[#d1d5db] rounded-md px-2.5 py-1.5 text-xs text-[#111827] outline-none w-48"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#6b7280] pt-2">
            Countdown updates automatically from Review due and stops when Verified.
          </p>
        </div>
      )}

      {/* Sticky / Fixed Bottom Action Bar matching SCR-040 to SCR-045 */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white/95 backdrop-blur-xs border-t border-[#e5e7eb] px-6 py-3.5 z-40 flex flex-wrap items-center justify-between gap-4">
        {/* Left Status & Delete */}
        <div className="flex items-center gap-4 text-sm">
          {activeTab === 'Documents Received / Verified' ? (
            <span className="text-[#166534] font-medium">
              Not saved — Invalid document review record
            </span>
          ) : (
            <span className="text-[#166534] font-medium">Saving...</span>
          )}
          <button
            onClick={handleDeleteApplication}
            className="text-[#b91c1c] hover:underline font-medium cursor-pointer"
          >
            Delete Application
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCloseFile}
            className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Close File — Not Proceeding
          </button>
          <button
            onClick={onBack}
            className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Back to Client Profile
          </button>
          <button
            onClick={handleMoveToPR}
            className="bg-[#182c23] hover:bg-[#12231c] text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Move to PR Applications
          </button>
        </div>
      </div>
    </div>
  )
}
