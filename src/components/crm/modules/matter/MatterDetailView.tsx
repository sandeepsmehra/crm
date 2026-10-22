import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { MATTER_STAGES } from '@/data/mockData'
import { formatDueDate, getHealthStatus } from '@/lib/crmUtils'
import { 
  ArrowLeft, 
  Clock, 
  Eye 
} from 'lucide-react'

interface MatterDetailViewProps {
  matter: Matter
  client?: Client
  onBack: () => void
  onUpdateMatter: (updated: Matter) => void
  onEditAssignment: () => void
  onRecordSubmission: () => void
  onRecordContact: () => void
  onAddDeadline: () => void
  onAddGovtRequest: () => void
  onPreviewClientPortal: (matterId: string) => void
}

export function MatterDetailView({
  matter,
  client,
  onBack,
  onUpdateMatter,
  onEditAssignment,
  onRecordSubmission,
  onRecordContact,
  onAddDeadline,
  onAddGovtRequest,
  onPreviewClientPortal
}: MatterDetailViewProps) {
  const [activeTab, setActiveTab] = useState<
    'Overview' | 'Strategy' | 'Checklist & Documents' | 'Case Work' | 'Communication & Notes' | 'Timeline'
  >('Overview')
  const [communicationSection, setCommunicationSection] = useState<'Last Contact' | 'Notes & Messages'>('Last Contact')

  // Form states
  const [strategyText, setStrategyText] = useState(matter.strategy)
  const [riskText, setRiskText] = useState(matter.risk)
  const [newNoteText, setNewNoteText] = useState('')
  const [newNoteType, setNewNoteType] = useState('Internal Note')
  const [demoMessageText, setDemoMessageText] = useState('')
  const [correctionLines, setCorrectionLines] = useState('')

  const health = getHealthStatus(matter)

  // Save Strategy
  const handleSaveStrategy = () => {
    onUpdateMatter({
      ...matter,
      strategy: strategyText,
      risk: riskText,
      events: ['Case strategy and risk flags updated', ...matter.events]
    })
  }

  // Document actions
  const handleSimulateUpload = (index: number) => {
    const updatedDocs = [...matter.docs]
    const doc = updatedDocs[index]
    const nextVer = doc.version + 1
    updatedDocs[index] = {
      ...doc,
      version: nextVer,
      status: 'Uploaded — Review Required',
      history: [`v${nextVer} — Uploaded in demo session`, ...doc.history]
    }
    onUpdateMatter({
      ...matter,
      docs: updatedDocs,
      events: [`Document uploaded: ${doc.name} (v${nextVer})`, ...matter.events]
    })
  }

  const handleDocStatusChange = (index: number, newStatus: any) => {
    if (!newStatus) return
    const updatedDocs = [...matter.docs]
    const doc = updatedDocs[index]
    updatedDocs[index] = {
      ...doc,
      status: newStatus,
      history: [`v${doc.version || 1} — ${newStatus} by ${matter.owner}`, ...doc.history]
    }
    onUpdateMatter({
      ...matter,
      docs: updatedDocs,
      events: [`Document status updated: ${doc.name} -> ${newStatus}`, ...matter.events]
    })
  }

  const handleMarkDocumentsComplete = () => {
    onUpdateMatter({
      ...matter,
      stage: 2,
      ball: 'Case Manager',
      next: 'Prepare forms and application package',
      events: [`Document collection complete; preparation assigned to ${matter.owner}`, ...matter.events]
    })
  }

  // Task checklist actions
  const handleToggleTask = (taskIndex: number, done: boolean) => {
    const updatedTasks = [...matter.tasks]
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], done }
    onUpdateMatter({
      ...matter,
      tasks: updatedTasks,
      events: [`Task ${done ? 'completed' : 'reopened'}: ${updatedTasks[taskIndex].name}`, ...matter.events]
    })
  }

  const handleFormStatusChange = (formIndex: number, status: 'Not Started' | 'In Progress' | 'Complete') => {
    const updatedForms = [...matter.forms]
    updatedForms[formIndex] = { ...updatedForms[formIndex], status }
    onUpdateMatter({
      ...matter,
      forms: updatedForms,
      events: [`Form updated: ${updatedForms[formIndex].name} -> ${status}`, ...matter.events]
    })
  }

  const handleSendForReview = () => {
    onUpdateMatter({
      ...matter,
      stage: 3,
      ball: 'RCIC',
      next: 'Review application and evidence',
      events: ['Application package sent to Tejinder for RCIC review', ...matter.events]
    })
  }

  const handleReturnCorrections = () => {
    const lines = correctionLines.split('\n').map((s) => s.trim()).filter(Boolean)
    if (!lines.length) return
    const newTasks = lines.map((name) => ({ name: `Correction: ${name}`, done: false, owner: matter.owner, due: matter.due }))
    onUpdateMatter({
      ...matter,
      tasks: [...matter.tasks, ...newTasks],
      corrections: [...matter.corrections, ...lines],
      stage: 2,
      ball: 'Case Manager',
      next: 'Complete RCIC corrections',
      events: [`Returned for changes by RCIC: ${lines.join('; ')}`, ...matter.events]
    })
    setCorrectionLines('')
  }

  const handleApproveFinalPreparation = () => {
    onUpdateMatter({
      ...matter,
      stage: 4,
      ball: 'Case Manager',
      next: 'Collect signatures and finalize package',
      events: ['RCIC approved final preparation package', ...matter.events]
    })
  }

  const handleToggleFinalCheck = (key: string) => {
    const checks = { ...(matter.finalChecks || {}) }
    checks[key] = !checks[key]
    onUpdateMatter({
      ...matter,
      finalChecks: checks,
      ready: Object.values(checks).length >= 4 && Object.values(checks).every(Boolean)
    })
  }

  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const newEntry = {
      type: newNoteType,
      text: newNoteText.trim(),
      date: '2026-10-07'
    }
    onUpdateMatter({
      ...matter,
      notes: [newEntry, ...matter.notes],
      events: [`Note added (${newNoteType}): ${newNoteText.slice(0, 30)}...`, ...matter.events]
    })
    setNewNoteText('')
  }

  const handleSendPortalMessage = () => {
    if (!demoMessageText.trim()) return
    const newMsg = {
      from: 'Staff',
      text: demoMessageText.trim()
    }
    onUpdateMatter({
      ...matter,
      messages: [...(matter.messages || []), newMsg],
      events: [`Client portal message sent`, ...matter.events]
    })
    setDemoMessageText('')
  }

  const allDocsApproved = matter.docs.every((d) => ['Approved', 'Not Applicable'].includes(d.status))
  const allTasksDone = matter.tasks.every((t) => t.done)
  const allFormsComplete = matter.forms.every((f) => f.status === 'Complete')

  return (
    <div className="space-y-5">
      {/* Back button & top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#677472] hover:text-[#12382e] transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to To-Do List</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`badge ${health.colorClass}`}>{health.label}</span>
          <button
            onClick={onEditAssignment}
            className="px-3 py-1.5 bg-white border border-[#cbd5d1] rounded-md text-[12.5px] font-semibold text-[#202d2d] hover:bg-[#f4f6f5] transition-colors shadow-2xs"
          >
            Edit assignment
          </button>
          <button
            onClick={() => onPreviewClientPortal(matter.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#12382e] text-white rounded-md text-[12.5px] font-semibold hover:bg-[#1a503e] transition-colors shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Client preview</span>
          </button>
        </div>
      </div>

      {/* Title & Eyebrow */}
      <div>
        <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
          {matter.id} · {matter.type}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#202d2d] mt-0.5">
          {matter.name}
        </h1>
        {client && (
          <div className="text-[13px] text-[#677472] mt-0.5">
            {client.phone} · {client.email} · {client.address || 'Surrey, BC'}
          </div>
        )}
      </div>

      {/* Summary Dark Green Banner */}
      <div className="case-summary-banner">
        <div>
          <small>Current stage</small>
          <strong>{MATTER_STAGES[matter.stage]}</strong>
        </div>
        <div>
          <small>Who has the ball?</small>
          <strong className="text-[#d5a17e]">{matter.ball}</strong>
        </div>
        <div>
          <small>Next action</small>
          <strong className="truncate block" title={matter.next}>{matter.next}</strong>
        </div>
        <div>
          <small>Next action due / owner</small>
          <strong>{formatDueDate(matter.due)} · {matter.owner}</strong>
          {matter.hard && (
            <div className="mt-1">
              <span className="badge red text-[10.5px]">Hard: {formatDueDate(matter.hard)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {MATTER_STAGES.map((s, idx) => {
          const isDone = idx < matter.stage
          const isCurrent = idx === matter.stage
          return (
            <div
              key={s}
              className={`step ${isDone ? 'done' : isCurrent ? 'current' : ''}`}
            >
              {s}
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-[#dfe5e3] overflow-x-auto scrollbar-none pb-0.5">
        {(['Overview', 'Strategy', 'Checklist & Documents', 'Case Work', 'Communication & Notes', 'Timeline'] as const).map(
          (t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === t
                  ? 'border-[#a7653b] text-[#a7653b]'
                  : 'border-transparent text-[#677472] hover:text-[#202d2d]'
              }`}
            >
              {t}
            </button>
          )
        )}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Next Step Card */}
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#202d2d] mb-1">What happens next?</h2>
              <p className="text-xl font-bold text-[#12382e] my-3 leading-snug">
                {matter.next}
              </p>

              <div className="flex flex-wrap items-center gap-2.5 mt-4">
                {matter.stage < 2 && (
                  <button
                    onClick={() => setActiveTab('Checklist & Documents')}
                    className="px-4 py-2 bg-[#202d2d] text-white rounded-md text-[13px] font-semibold hover:bg-black transition-colors"
                  >
                    Open checklist & documents
                  </button>
                )}
                {matter.stage === 2 && (
                  <button
                    onClick={() => setActiveTab('Case Work')}
                    className="px-4 py-2 bg-[#202d2d] text-white rounded-md text-[13px] font-semibold hover:bg-black transition-colors"
                  >
                    Continue preparation case work
                  </button>
                )}
                {matter.stage === 3 && (
                  <button
                    onClick={() => setActiveTab('Case Work')}
                    className="px-4 py-2 bg-[#7359a6] text-white rounded-md text-[13px] font-semibold hover:bg-[#5f468d] transition-colors"
                  >
                    Review file (RCIC queue)
                  </button>
                )}
                {matter.stage === 4 && (
                  <button
                    onClick={() => setActiveTab('Case Work')}
                    className="px-4 py-2 bg-[#246b54] text-white rounded-md text-[13px] font-semibold hover:bg-[#1a503e] transition-colors"
                  >
                    Final preparation & submission
                  </button>
                )}
                {matter.stage === 5 && (
                  <button
                    onClick={onAddGovtRequest}
                    className="px-4 py-2 bg-[#a7653b] text-white rounded-md text-[13px] font-semibold hover:bg-[#8f532d] transition-colors"
                  >
                    Add government request / PFL
                  </button>
                )}
              </div>

              {/* Snapshot details */}
              <div className="mt-6 pt-5 border-t border-[#edf0ee] space-y-2.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#677472]">Assigned Case Manager:</span>
                  <strong className="text-[#202d2d]">{matter.owner}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#677472]">Responsible RCIC:</span>
                  <strong className="text-[#202d2d]">Tejinder Bhatthal (RCIC-IRB)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#677472]">Accepted Documents:</span>
                  <strong className="text-[#202d2d]">
                    {matter.docs.filter((d) => ['Approved', 'Not Applicable'].includes(d.status)).length} of {matter.docs.length}
                  </strong>
                </div>
                {matter.submission && (
                  <div className="p-3 bg-[#e8f3ed] rounded-lg border border-[#b9dfbf] text-[#176328] mt-2">
                    <div className="font-bold">Submitted to {matter.submission.portal}</div>
                    <div className="text-[11.5px] mt-0.5">
                      Ref: {matter.submission.ref} · Date: {formatDueDate(matter.submission.date)} · By: {matter.submission.by}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Important Dates */}
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[16px] font-bold text-[#202d2d]">Important Dates</h3>
                <button
                  onClick={onAddDeadline}
                  className="text-[12.5px] font-semibold text-[#a7653b] hover:underline"
                >
                  + Add deadline
                </button>
              </div>

              <div className="space-y-2">
                {matter.dates.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#f8faf9] rounded border border-[#edf0ee] text-[13px]">
                    <span className="text-[#677472]">{d.label}</span>
                    <strong className="text-[#202d2d]">{formatDueDate(d.date)}</strong>
                  </div>
                ))}
                {matter.hard && (
                  <div className="flex items-center justify-between p-2 bg-[#fee2e2] rounded border border-[#fca5a5] text-[13px]">
                    <span className="font-bold text-[#991b1b]">Hard Legal Deadline</span>
                    <strong className="text-[#991b1b]">{formatDueDate(matter.hard)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Case Summary & Strategy */}
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#202d2d] mb-3">Case Strategy & Risk Flags</h2>
              
              <div className="space-y-4 text-[13.5px]">
                <div>
                  <label className="block text-[12px] font-semibold uppercase text-[#677472] mb-1">
                    Recommended Case Strategy
                  </label>
                  <textarea
                    rows={4}
                    value={strategyText}
                    onChange={(e) => setStrategyText(e.target.value)}
                    className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[#202d2d] outline-none focus:border-[#246b54]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-semibold uppercase text-[#677472] mb-1">
                    Risks & Important Facts
                  </label>
                  <input
                    type="text"
                    value={riskText}
                    onChange={(e) => setRiskText(e.target.value)}
                    className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[#202d2d] outline-none focus:border-[#246b54]"
                  />
                </div>

                <button
                  onClick={handleSaveStrategy}
                  className="px-4 py-2 bg-[#12382e] hover:bg-[#1a503e] text-white text-[13px] font-semibold rounded-md transition-colors"
                >
                  Save strategy & risks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STRATEGY */}
      {activeTab === 'Strategy' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 sm:p-6 shadow-xs max-w-4xl 2xl:max-w-5xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-[#202d2d]">Case Strategy & Consultant Instructions</h2>
            <p className="text-[13px] text-[#677472] mt-0.5">
              Internal only · Hidden from client portal view.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-[13.5px] text-[#202d2d] mb-1">
                Client Situation, Objective and Evidence Plan
              </label>
              <textarea
                rows={6}
                value={strategyText}
                onChange={(e) => setStrategyText(e.target.value)}
                className="w-full p-3 border border-[#cbd5d1] rounded-md text-[13.5px] text-[#202d2d] outline-none focus:border-[#246b54]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[13.5px] text-[#202d2d] mb-1">
                Risk Factors to Review
              </label>
              <input
                type="text"
                value={riskText}
                onChange={(e) => setRiskText(e.target.value)}
                className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[13.5px] text-[#202d2d] outline-none focus:border-[#246b54]"
              />
            </div>

            <button
              onClick={handleSaveStrategy}
              className="px-5 py-2.5 bg-[#12382e] hover:bg-[#1a503e] text-white text-[13.5px] font-semibold rounded-md transition-colors shadow-xs"
            >
              Save Strategy
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CHECKLIST & DOCUMENTS */}
      {activeTab === 'Checklist & Documents' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edf0ee] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#202d2d]">Client Document Checklist</h2>
              <p className="text-[13px] text-[#677472] mt-0.5">
                {matter.docs.filter((d) => d.status === 'Approved' || d.status === 'Not Applicable').length} of {matter.docs.length} accepted · Uploaded does not mean approved.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const docName = prompt('Enter document requirement name:')
                  if (docName) {
                    onUpdateMatter({
                      ...matter,
                      docs: [...matter.docs, { name: docName.trim(), status: 'Requested', version: 0, history: [] }]
                    })
                  }
                }}
                className="px-3 py-1.5 bg-white border border-[#cbd5d1] rounded-md text-[13px] font-semibold text-[#202d2d] hover:bg-[#f4f6f5]"
              >
                + Add requirement
              </button>
              <button
                onClick={() => alert('Checklist sent to client in demo session!')}
                className="px-3.5 py-1.5 bg-[#12382e] text-white rounded-md text-[13px] font-semibold hover:bg-[#1a503e]"
              >
                Send checklist
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#edf0ee]">
            {matter.docs.map((doc, idx) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-[14px] text-[#202d2d]">{doc.name}</div>
                  <div className="text-[12px] text-[#677472]">
                    {doc.version ? `Version ${doc.version}` : 'Awaiting first upload'}
                  </div>
                  {doc.history.length > 0 && (
                    <div className="text-[11px] text-[#8a9895] mt-0.5">
                      Latest: {doc.history[0]}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span
                    className={`badge ${
                      doc.status === 'Approved'
                        ? 'green'
                        : doc.status === 'Correction Required'
                        ? 'red'
                        : 'amber'
                    }`}
                  >
                    {doc.status}
                  </span>

                  <button
                    onClick={() => handleSimulateUpload(idx)}
                    className="px-2.5 py-1 bg-[#f4f6f5] hover:bg-[#e8ecea] border border-[#cbd5d1] rounded text-[12px] font-semibold text-[#202d2d] whitespace-nowrap"
                  >
                    Simulate upload
                  </button>

                  <select
                    value={doc.status}
                    onChange={(e) => handleDocStatusChange(idx, e.target.value)}
                    className="py-1 px-2 border border-[#cbd5d1] rounded text-[12px] font-medium bg-white text-[#202d2d] outline-none"
                  >
                    <option value="Requested">Requested</option>
                    <option value="Uploaded — Review Required">Uploaded</option>
                    <option value="Approved">Approved</option>
                    <option value="Correction Required">Correction Required</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#edf0ee] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-[13px] text-[#677472] cursor-pointer">
              <input
                type="checkbox"
                checked={matter.noChase}
                onChange={(e) => onUpdateMatter({ ...matter, noChase: e.target.checked })}
              />
              <span>Do not chase client (pause reminders)</span>
            </label>

            <button
              disabled={!allDocsApproved}
              onClick={handleMarkDocumentsComplete}
              className={`px-4 py-2 rounded-md text-[13.5px] font-semibold transition-colors ${
                allDocsApproved
                  ? 'bg-[#a7653b] hover:bg-[#8f532d] text-white shadow-xs cursor-pointer'
                  : 'bg-[#e5ebe7] text-[#8a9895] cursor-not-allowed'
              }`}
            >
              Documents complete → Unlock Preparation
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CASE WORK */}
      {activeTab === 'Case Work' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Internal Tasks & Forms */}
          <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#edf0ee] pb-3">
              <h2 className="text-[17px] font-bold text-[#202d2d]">Internal Preparation Checklist</h2>
              <button
                onClick={() => {
                  const taskName = prompt('Enter new task name:')
                  if (taskName) {
                    onUpdateMatter({
                      ...matter,
                      tasks: [...matter.tasks, { name: taskName.trim(), done: false, owner: matter.owner, due: matter.due }]
                    })
                  }
                }}
                className="text-[12.5px] font-semibold text-[#a7653b] hover:underline"
              >
                + Add task
              </button>
            </div>

            <div className="space-y-2.5">
              {matter.tasks.map((task, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-[#f8faf9] rounded-lg border border-[#edf0ee] text-[13px]"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) => handleToggleTask(i, e.target.checked)}
                      className="w-4 h-4 text-[#246b54] rounded"
                    />
                    <span className={task.done ? 'line-through text-[#677472]' : 'font-medium text-[#202d2d]'}>
                      {task.name}
                    </span>
                  </label>
                  <span className={`badge ${task.done ? 'green' : ''}`}>
                    {task.done ? 'Complete' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#edf0ee]">
              <h3 className="font-bold text-[15px] text-[#202d2d] mb-3">Forms & Submissions</h3>
              <div className="space-y-2.5">
                {matter.forms.map((form, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-[#f8faf9] rounded-lg border border-[#edf0ee] text-[13px]"
                  >
                    <span className="font-medium text-[#202d2d]">{form.name}</span>
                    <select
                      value={form.status}
                      onChange={(e) => handleFormStatusChange(i, e.target.value as any)}
                      className="py-1 px-2 border border-[#cbd5d1] rounded text-[12px] font-semibold bg-white"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Complete">Complete</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#edf0ee]">
              <button
                disabled={matter.stage !== 2 || !allTasksDone || !allFormsComplete}
                onClick={handleSendForReview}
                className={`w-full py-2.5 rounded-md text-[13.5px] font-semibold transition-colors ${
                  matter.stage === 2 && allTasksDone && allFormsComplete
                    ? 'bg-[#a7653b] hover:bg-[#8f532d] text-white shadow-xs cursor-pointer'
                    : 'bg-[#e5ebe7] text-[#8a9895] cursor-not-allowed'
                }`}
              >
                Send for RCIC Review
              </button>
              {(!allTasksDone || !allFormsComplete) && matter.stage === 2 && (
                <p className="text-[11.5px] text-[#8a9895] text-center mt-1.5">
                  Complete all tasks and forms before sending to review.
                </p>
              )}
            </div>
          </div>

          {/* RCIC Review & Final Preparation */}
          <div className="space-y-6">
            {/* RCIC Review Gate */}
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#202d2d] mb-1">RCIC Professional Review</h2>
              <p className="text-[13px] text-[#677472] mb-4">
                Tejinder Bhatthal (RCIC-IRB) review gate. Approve package or return specific corrections.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold uppercase text-[#677472] mb-1">
                    Corrections Required (one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Missing address history line&#10;Clarify prior UK refusal"
                    value={correctionLines}
                    onChange={(e) => setCorrectionLines(e.target.value)}
                    className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[13px] outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <button
                    disabled={matter.stage !== 3 || !correctionLines.trim()}
                    onClick={handleReturnCorrections}
                    className={`px-3 py-2 rounded-md text-[13px] font-semibold transition-colors ${
                      matter.stage === 3 && correctionLines.trim()
                        ? 'bg-red-700 hover:bg-red-800 text-white cursor-pointer'
                        : 'bg-[#e5ebe7] text-[#8a9895] cursor-not-allowed'
                    }`}
                  >
                    Return for changes
                  </button>

                  <button
                    disabled={matter.stage !== 3}
                    onClick={handleApproveFinalPreparation}
                    className={`px-4 py-2 rounded-md text-[13px] font-semibold transition-colors ${
                      matter.stage === 3
                        ? 'bg-[#246b54] hover:bg-[#1a503e] text-white shadow-xs cursor-pointer'
                        : 'bg-[#e5ebe7] text-[#8a9895] cursor-not-allowed'
                    }`}
                  >
                    Approve final preparation
                  </button>
                </div>
              </div>
            </div>

            {/* Final Preparation & Submission */}
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs">
              <h2 className="text-[17px] font-bold text-[#202d2d] mb-1">Final Preparation & Filing</h2>
              <p className="text-[13px] text-[#677472] mb-3">
                Collect client signatures and conduct final package quality checks.
              </p>

              <div className="space-y-2 text-[13px]">
                {[
                  ['signatures', 'Client and representative signatures obtained'],
                  ['pdfs', 'Final PDF package compiled and bookmarked'],
                  ['naming', 'File naming standards verified'],
                  ['check', 'Final package check completed against checklist']
                ].map(([key, label]) => {
                  const isChecked = Boolean(matter.finalChecks && matter.finalChecks[key])
                  return (
                    <label key={key} className="flex items-center gap-2.5 p-2 bg-[#f8faf9] rounded border border-[#edf0ee] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleFinalCheck(key)}
                        className="w-4 h-4 text-[#246b54] rounded"
                      />
                      <span className="font-medium text-[#202d2d]">{label}</span>
                    </label>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#edf0ee] flex items-center justify-between">
                <span className={`badge ${matter.ready ? 'green' : 'amber'}`}>
                  {matter.ready ? 'Ready to Submit' : 'Checks in progress'}
                </span>

                <button
                  onClick={onRecordSubmission}
                  className="px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13px] font-semibold transition-colors shadow-xs"
                >
                  Record Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMMUNICATION & NOTES */}
      {activeTab === 'Communication & Notes' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-[#dfe5e3] pb-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setCommunicationSection('Last Contact')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold whitespace-nowrap ${
                communicationSection === 'Last Contact'
                  ? 'bg-[#12382e] text-white'
                  : 'text-[#677472] hover:bg-[#edf2ef]'
              }`}
            >
              Last Contact Logs
            </button>
            <button
              onClick={() => setCommunicationSection('Notes & Messages')}
              className={`px-3 py-1.5 rounded-md text-[13px] font-semibold whitespace-nowrap ${
                communicationSection === 'Notes & Messages'
                  ? 'bg-[#12382e] text-white'
                  : 'text-[#677472] hover:bg-[#edf2ef]'
              }`}
            >
              Internal Notes & Messages
            </button>
          </div>

          {communicationSection === 'Last Contact' ? (
            <div className="bg-white border border-[#dfe5e3] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-[17px] font-bold text-[#202d2d]">Last Contact History</h2>
                  <p className="text-[12.5px] text-[#677472]">
                    Record when you last spoke with the client and summary of what was discussed.
                  </p>
                </div>
                <button
                  onClick={onRecordContact}
                  className="px-3.5 py-1.5 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[12.5px] font-semibold self-start sm:self-auto"
                >
                  + Record contact
                </button>
              </div>

              <div className="space-y-3">
                {(matter.contactsLog || []).map((c) => (
                  <div key={c.id} className="p-3 bg-[#f8faf9] rounded-lg border border-[#edf0ee] text-[13px]">
                    <div className="flex items-center justify-between font-bold text-[#12382e]">
                      <span>{formatDueDate(c.date)} · {c.time} (Vancouver)</span>
                      <span className="badge blue">{c.method}</span>
                    </div>
                    <div className="text-[12px] text-[#677472] mt-0.5">
                      Contact with {c.person} · Recorded by {c.staff}
                    </div>
                    <p className="mt-2 text-[#202d2d] leading-relaxed whitespace-pre-wrap">
                      {c.explanation}
                    </p>
                  </div>
                ))}

                {(!matter.contactsLog || matter.contactsLog.length === 0) && (
                  <p className="text-[#677472] py-6 text-center text-[13px]">
                    No contact recorded for this file yet. Click "+ Record contact" above.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Internal Notes */}
              <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs space-y-4">
                <h2 className="text-[17px] font-bold text-[#202d2d]">Internal Notes</h2>
                <div className="space-y-3">
                  <select
                    value={newNoteType}
                    onChange={(e) => setNewNoteType(e.target.value)}
                    className="w-full p-2 border border-[#cbd5d1] rounded-md text-[13px] bg-white"
                  >
                    <option value="Internal Note">Internal Note</option>
                    <option value="Client Call">Client Call</option>
                    <option value="Consultation">Consultation</option>
                    <option value="RCIC Instruction">RCIC Instruction</option>
                    <option value="Government Communication">Government Communication</option>
                  </select>

                  <textarea
                    rows={3}
                    placeholder="Record notes. Use @Inderpreet to mention staff..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[13px] outline-none"
                  />

                  <button
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-[#12382e] hover:bg-[#1a503e] text-white rounded-md text-[13px] font-semibold"
                  >
                    Save note
                  </button>
                </div>

                <div className="pt-4 border-t border-[#edf0ee] space-y-3">
                  {matter.notes.map((n, i) => {
                    const isObj = typeof n !== 'string'
                    const noteType = isObj ? n.type : 'Internal Note'
                    const noteText = isObj ? n.text : n
                    const noteDate = isObj ? n.date : 'Recent'

                    return (
                      <div key={i} className="p-2.5 bg-[#f8faf9] rounded border border-[#edf0ee] text-[13px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="badge blue text-[11px]">{noteType}</span>
                          <span className="text-[11px] text-[#8a9895]">{formatDueDate(noteDate)}</span>
                        </div>
                        <p className="text-[#202d2d] leading-normal">{noteText}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Client Messages */}
              <div className="bg-white border border-[#dfe5e3] rounded-xl p-5 shadow-xs space-y-4">
                <h2 className="text-[17px] font-bold text-[#202d2d]">Client Portal Messages</h2>
                <div className="space-y-3">
                  {(matter.messages || []).map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg text-[13px] ${
                        m.from === 'Staff' ? 'bg-[#eaf6f0] border border-[#c6e4d4]' : 'bg-[#f4f6f5] border border-[#dfe5e3]'
                      }`}
                    >
                      <div className="font-bold text-[11.5px] text-[#12382e] mb-1">
                        {m.from === 'Staff' ? 'Nationrise Staff' : 'Client'}
                      </div>
                      <p className="text-[#202d2d]">{m.text}</p>
                    </div>
                  ))}
                  {(!matter.messages || matter.messages.length === 0) && (
                    <p className="text-[#677472] py-4 text-center text-[12.5px]">
                      No messages yet in this client conversation.
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#edf0ee] space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Type message to client in portal..."
                    value={demoMessageText}
                    onChange={(e) => setDemoMessageText(e.target.value)}
                    className="w-full p-2.5 border border-[#cbd5d1] rounded-md text-[13px] outline-none"
                  />
                  <button
                    onClick={handleSendPortalMessage}
                    className="px-4 py-1.5 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md text-[12.5px] font-semibold"
                  >
                    Send demo message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: TIMELINE */}
      {activeTab === 'Timeline' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-xl font-bold text-[#202d2d] mb-4">Audit & Activity Timeline</h2>
          <div className="space-y-3">
            {matter.events.map((evt, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#f8faf9] rounded-lg border border-[#edf0ee]">
                <Clock className="w-4 h-4 text-[#a7653b] shrink-0 mt-0.5" />
                <div className="text-[13px]">
                  <div className="font-medium text-[#202d2d]">{evt}</div>
                  <div className="text-[11px] text-[#8a9895] mt-0.5">Nationrise CaseOS Session Activity</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
