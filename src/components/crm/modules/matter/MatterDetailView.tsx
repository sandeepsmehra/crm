import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { toast } from '@/components/ui/sonner'
import {
  ApplicationDetailsTab,
  ClientInformationTab,
  MatterRemindersTab,
  CaseWorkNotesTab,
  DocumentsVerifiedTab,
  DocRow
} from './tabs'

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

      {/* Tab Contents */}
      {activeTab === 'Application Details' && (
        <ApplicationDetailsTab
          appType={appType}
          onAppTypeChange={setAppType}
          customAppType={customAppType}
          onCustomAppTypeChange={setCustomAppType}
          caseManager={caseManager}
          onCaseManagerChange={setCaseManager}
          caseOverview={caseOverview}
          onCaseOverviewChange={setCaseOverview}
          extraNotes={extraNotes}
          onExtraNotesChange={setExtraNotes}
          hasDependants={hasDependants}
          onHasDependantsChange={setHasDependants}
          itaDate={itaDate}
          onItaDateChange={setItaDate}
          deadlineSubmit={deadlineSubmit}
          onDeadlineSubmitChange={setDeadlineSubmit}
          prNotes={prNotes}
          onPrNotesChange={setPrNotes}
        />
      )}

      {activeTab === 'Client Information' && (
        <ClientInformationTab
          clientName={clientName}
          onClientNameChange={setClientName}
          clientPhone={clientPhone}
          onClientPhoneChange={setClientPhone}
          clientEmail={clientEmail}
          onClientEmailChange={setClientEmail}
          clientDob={clientDob}
          onClientDobChange={setClientDob}
          clientAddress={clientAddress}
          onClientAddressChange={setClientAddress}
          clientUci={clientUci}
          onClientUciChange={setClientUci}
          immigrationStatus={immigrationStatus}
          onImmigrationStatusChange={setImmigrationStatus}
          statusExpiry={statusExpiry}
          onStatusExpiryChange={setStatusExpiry}
          emergencyName={emergencyName}
          onEmergencyNameChange={setEmergencyName}
          emergencyRelation={emergencyRelation}
          onEmergencyRelationChange={setEmergencyRelation}
        />
      )}

      {activeTab === 'Reminders' && (
        <MatterRemindersTab />
      )}

      {activeTab === 'Case Work & Notes' && (
        <CaseWorkNotesTab
          newNote={newNote}
          onNewNoteChange={setNewNote}
          savedNotes={savedNotes}
          onSaveNote={handleSaveNote}
        />
      )}

      {activeTab === 'Documents Received / Verified' && (
        <DocumentsVerifiedTab
          clientName={clientName}
          docRows={docRows}
          onAddDocumentRow={handleAddDocumentRow}
          onUpdateDoc={handleUpdateDoc}
        />
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
