import React, { useState } from 'react'
import { APPLICATION_TYPES } from '@/data/mockData'
import { staffAccessZodSchema, staffAccessYupSchema } from '@/lib/validations'
import { toast } from '@/components/ui/sonner'
import { ChevronRight, ChevronDown } from 'lucide-react'

type SettingsTab = 'Access' | 'Import' | 'Audit History' | 'Recovery Points' | 'Templates' | 'Developer guide'

const AUDIT_ROWS = [
  { time: '2026-10-22T04:55:13.765Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed matters/NR-demo-18' },
  { time: '2026-10-22T04:53:35.019Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-demo-03' },
  { time: '2026-10-22T04:50:22.015Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed officeTasks/T-demo-4' },
  { time: '2026-10-22T04:49:34.020Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed personalReminders/R-demo-2' },
  { time: '2026-10-19T08:05:49.808Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-22; Changed matters/NR-26020' },
  { time: '2026-10-19T08:04:55.392Z', staff: 'seedy@sites.test', action: 'save', changes: 'Created officeTasks/T-944776d6-02ef-40da-bd9e-72ea052c2709' },
  { time: '2026-10-19T08:04:26.711Z', staff: 'seedy@sites.test', action: 'save', changes: 'Changed clients/C-demo-E1' }
]

const RECOVERY_ROWS = [
  { version: '48', time: '2026-10-22T04:55:13.765Z', savedBy: 'seedy@sites.test' },
  { version: '47', time: '2026-10-22T04:53:35.019Z', savedBy: 'seedy@sites.test' },
  { version: '46', time: '2026-10-22T04:50:22.015Z', savedBy: 'seedy@sites.test' },
  { version: '45', time: '2026-10-22T04:49:34.020Z', savedBy: 'seedy@sites.test' },
  { version: '44', time: '2026-10-19T08:05:49.808Z', savedBy: 'seedy@sites.test' },
  { version: '43', time: '2026-10-19T08:04:55.392Z', savedBy: 'seedy@sites.test' }
]

const DEV_GUIDE_ROWS = [
  {
    observed: 'Appointment sheet with weekday filters and client details',
    decision: 'Keep. Give it one dedicated Appointments page, default to whole week and retain notes, reference, confirmation and follow-up.'
  },
  {
    observed: 'Appointment board repeated on Dashboard and Appointments',
    decision: 'Simplify. Owner dashboard becomes operational priorities; show only a short today summary.'
  },
  {
    observed: 'Nine client sections: Overview, Consultation, Follow-Up, Appointments, Email History, Transcript, Documents, Notes, Activity',
    decision: 'Reduce to five matter sections. Put consultation in the client profile; combine email, calls, transcripts and notes in Communication & Notes.'
  },
  {
    observed: 'Personalized Document Required list, received/pending summary, internal notes and Prepared by',
    decision: 'Keep and strengthen. Use assigned case manager, linked requirements and distinct review/approval states.'
  },
  {
    observed: 'Verified Language Test and Passport uploads while matching requirements remained Pending',
    decision: 'Investigate linkage. A document approval must update its requirement in the same matter. Existing data may need reconciliation.'
  },
  {
    observed: 'Consultation records, case notes, audio and transcript entry points',
    decision: 'Keep useful capability. Make strategy available immediately; verify recording consent and client notifications.'
  }
]

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Access')
  const [staffEmail, setStaffEmail] = useState('')
  const [staffRole, setStaffRole] = useState<'case_manager' | 'reception' | 'viewer' | 'owner'>('case_manager')
  const [usersList, setUsersList] = useState([
    { email: 'seedy@sites.test', role: 'owner', status: 'Enabled', signedIn: true }
  ])

  // Template Tab state
  const [selectedTemplate, setSelectedTemplate] = useState('Spousal Sponsorship')
  const [requirementsList, setRequirementsList] = useState(
    'Passport\nMarriage certificate\nSponsor PR card / status document\nPolice certificate\nPhotos\nRelationship evidence\nTravel history'
  )
  const [preparationTasks, setPreparationTasks] = useState(
    'Review client information\nComplete forms\nCheck address and travel history\nReview previous refusals\nDraft explanations and submissions\nOrganize evidence and final package'
  )
  const [workflowRulesOpen, setWorkflowRulesOpen] = useState(false)

  // Import Tab state
  const [needsReviewOnly, setNeedsReviewOnly] = useState(true)
  const [importSearch, setImportSearch] = useState('')

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffEmail.trim()) return

    const candidate = {
      email: staffEmail.trim(),
      name: staffEmail.split('@')[0],
      role: staffRole
    }

    // Zod validation
    const zodResult = staffAccessZodSchema.safeParse(candidate)
    if (!zodResult.success) {
      toast.error(zodResult.error.issues[0]?.message || 'Invalid email')
      return
    }

    // Yup validation
    try {
      staffAccessYupSchema.validateSync(candidate, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        toast.error(err.errors[0])
        return
      }
    }

    setUsersList([...usersList, { email: candidate.email, role: candidate.role, status: 'Enabled', signedIn: false }])
    setStaffEmail('')
    toast.success(`Staff access updated for ${candidate.email}`)
  }

  const handleExportRecords = () => {
    toast.success('Records and document index exported successfully')
  }

  const handleRestore = (ver: string) => {
    toast.success(`Restored to recovery point v${ver}`)
  }

  const handleSaveTemplate = () => {
    toast.success('Template saved successfully')
  }

  return (
    <div className="space-y-6">
      {/* Eyebrow & Page Title (SCR-051) */}
      <div>
        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
          WORKSPACE ADMINISTRATION
        </div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#111827] mt-1">
          Settings
        </h1>
      </div>

      {/* Tabs Row (SCR-051 to SCR-056) */}
      <div className="border-b border-[#e5e7eb] flex items-center gap-8 text-sm">
        {(['Access', 'Import', 'Audit History', 'Recovery Points', 'Templates', 'Developer guide'] as SettingsTab[]).map(
          (tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-[#a75928] border-b-2 border-[#a75928]'
                    : 'text-[#4b5563] hover:text-[#111827]'
                }`}
              >
                {tab}
              </button>
            )
          }
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ACCESS (SCR-051)                                  */}
      {/* ======================================================== */}
      {activeTab === 'Access' && (
        <div className="space-y-6">
          <div className="text-[13.5px] text-[#374151] space-y-3 leading-relaxed max-w-4xl">
            <p>
              Each person signs in with their own ChatGPT account. Roles below control CRM actions. Site sharing must also allow that person to open the site.
            </p>
            <p>
              Case manager: edit case records and upload documents. Reception: edit clients, appointments and office tasks. Viewer: read-only. All enabled roles can read the shared workspace.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12 pt-2">
            {/* Form */}
            <form onSubmit={handleAddStaff} className="w-full max-w-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Staff email
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none focus:border-[#126b48]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                  Role
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as any)}
                  className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="case_manager">case_manager</option>
                  <option value="reception">reception</option>
                  <option value="viewer">viewer</option>
                  <option value="owner">owner</option>
                </select>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2.5 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
                >
                  Add / update staff access
                </button>
              </div>
            </form>

            {/* Existing user status card */}
            <div className="space-y-4 pt-1">
              {usersList.map((u) => (
                <div key={u.email} className="text-sm">
                  <div className="font-bold text-[#111827] text-base">{u.email}</div>
                  <div className="text-[#4b5563] text-sm mt-0.5">
                    {u.role} · {u.status} {u.signedIn && '· Signed in'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: IMPORT (SCR-052)                                  */}
      {/* ======================================================== */}
      {activeTab === 'Import' && (
        <div className="space-y-5">
          <p className="text-[13.5px] text-[#374151] leading-relaxed max-w-4xl">
            Choose the prepared Nationrise import JSON. Original rows and notes are saved, including entries needing review. Uploading the same prepared file again skips rows already saved.
          </p>

          <div className="border border-[#d1d5db] rounded-lg p-3 w-fit bg-white flex items-center gap-3">
            <label className="bg-[#f3f4f6] hover:bg-[#e5e7eb] border border-[#d1d5db] text-[#111827] text-xs font-semibold px-3 py-1.5 rounded cursor-pointer">
              Choose File
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={() => toast.info('Prepared JSON verified: ready for import')}
              />
            </label>
            <span className="text-xs text-[#6b7280]">No file chosen</span>
          </div>

          <div className="pt-2">
            <h2 className="text-base font-bold text-[#111827]">Imported history (0 rows)</h2>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="needsReview"
              checked={needsReviewOnly}
              onChange={(e) => setNeedsReviewOnly(e.target.checked)}
              className="w-4 h-4 text-[#126b48] rounded border-gray-300 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="needsReview" className="text-sm font-semibold text-[#111827] cursor-pointer">
              Needs review only (0)
            </label>
          </div>

          <div>
            <label className="block text-sm text-[#374151] mb-1">Search name, phone or notes</label>
            <input
              type="text"
              value={importSearch}
              onChange={(e) => setImportSearch(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#111827] outline-none"
            />
          </div>

          <p className="text-xs text-[#6b7280] pt-1">
            Showing 0 of 0 matching rows. Narrow your search to find a specific record.
          </p>

          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">CLIENT</th>
                  <th className="py-3 px-4">PHONE</th>
                  <th className="py-3 px-4">SOURCE</th>
                  <th className="py-3 px-4">REVIEW</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-8 text-center text-xs text-[#6b7280]">
                    No imported rows found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AUDIT HISTORY (SCR-053)                           */}
      {/* ======================================================== */}
      {activeTab === 'Audit History' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4">STAFF</th>
                    <th className="py-3 px-4">ACTION</th>
                    <th className="py-3 px-4">CHANGES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {AUDIT_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-[#fbfcfb]">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#374151] whitespace-nowrap">
                        {row.time}
                      </td>
                      <td className="py-3.5 px-4 text-[#111827]">{row.staff}</td>
                      <td className="py-3.5 px-4 text-[#111827]">{row.action}</td>
                      <td className="py-3.5 px-4 text-[#111827]">{row.changes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: RECOVERY POINTS (SCR-054)                         */}
      {/* ======================================================== */}
      {activeTab === 'Recovery Points' && (
        <div className="space-y-4">
          <p className="text-[13.5px] text-[#374151] leading-relaxed max-w-4xl">
            Every saved set of record changes creates a recovery point. Uploaded documents are retained separately and are not removed by a record restore.
          </p>

          <button
            onClick={handleExportRecords}
            className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
          >
            Export records and document index
          </button>

          <p className="text-xs text-[#6b7280]">
            The JSON export contains records and a document index; download document files from their client profiles.
          </p>

          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">VERSION</th>
                    <th className="py-3 px-4">TIME</th>
                    <th className="py-3 px-4">SAVED BY</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {RECOVERY_ROWS.map((row) => (
                    <tr key={row.version} className="hover:bg-[#fbfcfb]">
                      <td className="py-3.5 px-4 font-bold text-[#111827]">{row.version}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#374151]">{row.time}</td>
                      <td className="py-3.5 px-4 text-[#111827]">{row.savedBy}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleRestore(row.version)}
                          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: TEMPLATES (SCR-055)                               */}
      {/* ======================================================== */}
      {activeTab === 'Templates' && (
        <div className="space-y-5">
          <div className="max-w-xl">
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Service template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
            >
              {APPLICATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {/* Left Box: Client requirements */}
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                Standard client requirements — one per line
              </label>
              <textarea
                rows={9}
                value={requirementsList}
                onChange={(e) => setRequirementsList(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg p-3.5 text-sm text-[#111827] outline-none leading-relaxed"
              />
            </div>

            {/* Right Box: Internal tasks */}
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">
                Internal preparation tasks — one per line
              </label>
              <textarea
                rows={9}
                value={preparationTasks}
                onChange={(e) => setPreparationTasks(e.target.value)}
                className="w-full bg-white border border-[#d1d5db] rounded-lg p-3.5 text-sm text-[#111827] outline-none leading-relaxed"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleSaveTemplate}
              className="bg-[#a75928] hover:bg-[#924c1f] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-2xs cursor-pointer"
            >
              Save template
            </button>
          </div>

          <p className="text-xs text-[#6b7280]">
            Changes apply to new demo matters only. Existing cases retain their personalized requirements. These are illustrative templates, not official program checklists.
          </p>

          <div className="pt-2 border-t border-[#e5e7eb] max-w-5xl">
            <button
              onClick={() => setWorkflowRulesOpen(!workflowRulesOpen)}
              className="flex items-center gap-2 text-sm font-bold text-[#111827] hover:text-[#a75928] cursor-pointer"
            >
              {workflowRulesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Shared workflow and automation rules</span>
            </button>

            {workflowRulesOpen && (
              <div className="mt-3 p-4 bg-white border border-[#e5e7eb] rounded-lg text-xs text-[#374151] space-y-2">
                <p>• Automated PFL countdown flags on 7, 5, and 3 days before IRCC expiry.</p>
                <p>• Retainers moved to to-do list automatically lock intake and notify assigned case manager.</p>
                <p>• Verified document changes link directly to requirements and update status badge.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: DEVELOPER GUIDE (SCR-056)                         */}
      {/* ======================================================== */}
      {activeTab === 'Developer guide' && (
        <div className="space-y-6 max-w-5xl">
          {/* Top banner callout matching SCR-056 */}
          <div className="bg-[#fffdfb] border-l-4 border-[#a75928] border border-[#e5e7eb] rounded-r-lg p-4 text-[13.5px] text-[#374151] leading-relaxed">
            <span className="font-bold text-[#111827]">Updated navigation:</span> Dashboard, Task Manager, Appointments, Clients, To-Do List, Settings. Task Manager handles staff-to-staff messages and completion. Appointments includes Service requested and Mark retained. To-Do List contains the seven retained-file columns requested.
          </div>

          {/* Heading */}
          <div>
            <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
              REVIEW FINDINGS & INTERACTIVE REDESIGN
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#111827] mt-1">
              Developer guide
            </h2>
          </div>

          {/* Card with Comparison Table matching SCR-056 */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#111827]">
              Review of the original Nationrise CRM
            </h3>
            <p className="text-xs text-[#6b7280] leading-relaxed">
              Inspected signed-in manager screens on 7 October 2026: dashboard, appointments, client directory, a representative client profile, consultation, documents, intake and reports. No live records were changed. Features not seen are marked unverified rather than assumed absent.
            </p>

            <div className="border border-[#e5e7eb] rounded-lg overflow-hidden mt-3">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-1/2">OBSERVED IN ORIGINAL CRM</th>
                    <th className="py-3 px-4 w-1/2">DECISION FOR REDESIGN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {DEV_GUIDE_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-[#fbfcfb]">
                      <td className="py-4 px-4 text-[#111827] align-top leading-relaxed">
                        {row.observed}
                      </td>
                      <td className="py-4 px-4 text-[#374151] align-top leading-relaxed">
                        {row.decision}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
