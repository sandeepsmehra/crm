import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { APPLICATION_TYPES, STAFF_MEMBERS, TODAY, docsFor, TASK_TEMPLATES } from '@/data/mockData'
import { newMatterZodSchema, newMatterYupSchema } from './todoList.validation'
import { toast } from '@/components/ui/sonner'
import { X, AlertCircle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface NewMatterModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (matter: Matter) => void
  clients: Client[]
  matters: Matter[]
  initialClientId?: string
}

export function NewMatterModal({
  isOpen,
  onClose,
  onSave,
  clients,
  matters,
  initialClientId
}: NewMatterModalProps) {
  const [clientId, setClientId] = useState(initialClientId || (clients[0]?.id || ''))
  const [type, setType] = useState('Spousal Sponsorship')
  const [owner, setOwner] = useState(STAFF_MEMBERS[0])
  const [firstActionDue, setFirstActionDue] = useState('2026-10-14')
  const [retainedDate, setRetainedDate] = useState(TODAY)
  const [hardDeadline, setHardDeadline] = useState('')
  const [hardSource, setHardSource] = useState('')
  const [hardVerified, setHardVerified] = useState(false)
  const [overview, setOverview] = useState('')
  const [engagementConfirmed, setEngagementConfirmed] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const selectedClient = clients.find((c) => c.id === clientId) || clients[0]

  // Workload count per staff
  const getWorkload = (staff: string) => {
    return matters
      .filter((m) => m.owner === staff && m.stage < 6)
      .reduce((sum, m) => sum + m.tasks.filter((t) => !t.done).length, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationErrors([])
    setFieldErrors({})

    const candidateData = {
      clientId,
      type,
      owner,
      retainedDate: retainedDate.trim(),
      firstActionDue: firstActionDue.trim()
    }

    // 1. Zod Validation
    const zodResult = newMatterZodSchema.safeParse(candidateData)
    if (!zodResult.success) {
      const errMap: Record<string, string> = {}
      zodResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        if (key && !errMap[key]) {
          errMap[key] = issue.message
        }
      })
      if (!engagementConfirmed) {
        errMap.engagement = 'Please confirm client engagement'
      }
      if (hardDeadline && (!hardSource.trim() || !hardVerified)) {
        errMap.hardDeadline = 'Please provide the deadline source correspondence and confirm verification'
      }
      setFieldErrors(errMap)
      const errMsgs = zodResult.error.issues.map((i) => i.message)
      if (errMap.engagement && !errMsgs.includes(errMap.engagement)) errMsgs.push(errMap.engagement)
      if (errMap.hardDeadline && !errMsgs.includes(errMap.hardDeadline)) errMsgs.push(errMap.hardDeadline)
      setValidationErrors(errMsgs)
      toast.error(errMsgs[0] || 'Please complete all required fields')
      return
    }

    if (!engagementConfirmed) {
      setFieldErrors({ engagement: 'Please confirm client engagement before opening the matter' })
      setValidationErrors(['Please confirm client engagement before opening the matter'])
      toast.error('Please confirm client engagement')
      return
    }

    if (hardDeadline && (!hardSource.trim() || !hardVerified)) {
      setFieldErrors({ hardDeadline: 'Please provide the deadline source correspondence and confirm verification' })
      setValidationErrors(['Please provide the deadline source correspondence and confirm verification'])
      toast.error('Please verify the legal deadline')
      return
    }

    // 2. Yup Validation
    try {
      newMatterYupSchema.validateSync(candidateData, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setValidationErrors(err.errors)
        toast.error(err.errors[0])
        return
      }
    }

    const newId = `NR-260${String(matters.length + 1).padStart(2, '0')}`
    const standardDocs = docsFor(type)
    const standardTasks = (TASK_TEMPLATES[type] || TASK_TEMPLATES.default).map((t) => ({
      name: t,
      done: false,
      owner,
      due: firstActionDue
    }))

    const newMatter: Matter = {
      id: newId,
      clientId: selectedClient.id,
      name: selectedClient.name,
      type,
      owner,
      stage: 0,
      ball: 'Case Manager',
      next: 'Personalize checklist and verify requirements',
      due: firstActionDue,
      hard: hardDeadline,
      risk: selectedClient.risks || 'Standard background verification',
      strategy: overview.trim() || selectedClient.strategy || 'Prepare and review application package.',
      docs: standardDocs,
      tasks: standardTasks,
      forms: [
        { name: 'Principal application form', status: 'Not Started' },
        { name: 'Family information', status: 'Not Started' },
        { name: 'Representative authorization', status: 'In Progress' }
      ],
      verified: false,
      signature: false,
      final: false,
      ready: false,
      corrections: [],
      submission: null,
      noChase: false,
      events: ['Matter opened; workflow, checklist and internal tasks created'],
      notes: [],
      dates: selectedClient.expiry ? [{ label: 'Status expiry', date: selectedClient.expiry, kind: 'Status date' }] : [],
      deadlineItems: hardDeadline
        ? [
            {
              kind: 'Hard Deadline',
              label: 'Verified legal deadline',
              date: hardDeadline,
              time: '17:00',
              zone: 'America/Vancouver',
              source: hardSource.trim(),
              status: 'Open'
            }
          ]
        : [],
      retained: true,
      retainedDate,
      caseOverview: overview.trim() || selectedClient.notes || 'Retained client application work.'
    }

    onSave(newMatter)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg 2xl:max-w-xl overflow-hidden animate-fade-in max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Add Retained Client to To-Do List</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Assign case manager, create workflow, and schedule first action.
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
        <form noValidate onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-[13.5px]">
          {/* Client Selection */}
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Client</label>
            <CustomSelect
              value={clientId}
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.name} · ${c.phone}`
              }))}
              onChange={(val) => {
                setClientId(val)
                if (fieldErrors.clientId) setFieldErrors((p) => ({ ...p, clientId: '' }))
              }}
              invalid={!!fieldErrors.clientId}
              triggerClassName={`w-full bg-white ${
                fieldErrors.clientId ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1]'
              }`}
            />
            {fieldErrors.clientId && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.clientId}
              </p>
            )}
          </div>

          {/* Matter Type & Case Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Matter Type</label>
              <CustomSelect
                value={type}
                options={APPLICATION_TYPES}
                onChange={(val) => setType(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Case Manager</label>
              <CustomSelect
                value={owner}
                options={STAFF_MEMBERS.map((s) => ({
                  value: s,
                  label: `${s} (${getWorkload(s)} open tasks)`
                }))}
                onChange={(val) => setOwner(val)}
                triggerClassName="w-full border-[#cbd5d1] bg-white font-medium"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">Date Retained</label>
              <input
                type="date"
                value={retainedDate}
                onChange={(e) => {
                  setRetainedDate(e.target.value)
                  if (fieldErrors.retainedDate) setFieldErrors((p) => ({ ...p, retainedDate: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.retainedDate ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1]'
                }`}
              />
              {fieldErrors.retainedDate && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.retainedDate}
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold text-[#202d2d] mb-1">First Action Due</label>
              <input
                type="date"
                value={firstActionDue}
                onChange={(e) => {
                  setFirstActionDue(e.target.value)
                  if (fieldErrors.firstActionDue) setFieldErrors((p) => ({ ...p, firstActionDue: '' }))
                }}
                className={`w-full p-2 border rounded-md outline-none transition-colors ${
                  fieldErrors.firstActionDue ? 'border-red-500 bg-red-50/20' : 'border-[#cbd5d1]'
                }`}
              />
              {fieldErrors.firstActionDue && (
                <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>•</span> {fieldErrors.firstActionDue}
                </p>
              )}
            </div>
          </div>

          {/* Optional Hard Deadline */}
          <div className={`p-3 border rounded-lg space-y-2.5 transition-colors ${fieldErrors.hardDeadline ? 'border-red-300 bg-red-50/30' : 'bg-[#fffaf5] border-[#f3d9c3]'}`}>
            <div className="text-[12.5px] font-bold text-[#8a4e26]">Hard Legal Deadline (if verified)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-[#677472] mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={hardDeadline}
                  onChange={(e) => {
                    setHardDeadline(e.target.value)
                    if (fieldErrors.hardDeadline) setFieldErrors((p) => ({ ...p, hardDeadline: '' }))
                  }}
                  className="w-full p-1.5 border border-[#cbd5d1] rounded-md bg-white text-[12.5px]"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-[#677472] mb-1">Source Correspondence</label>
                <input
                  type="text"
                  placeholder="e.g. Officer letter, notice of appeal"
                  value={hardSource}
                  onChange={(e) => {
                    setHardSource(e.target.value)
                    if (fieldErrors.hardDeadline) setFieldErrors((p) => ({ ...p, hardDeadline: '' }))
                  }}
                  className="w-full p-1.5 border border-[#cbd5d1] rounded-md bg-white text-[12.5px]"
                />
              </div>
            </div>
            {hardDeadline && (
              <label className="flex items-center gap-2 text-[12px] text-[#784722] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hardVerified}
                  onChange={(e) => {
                    setHardVerified(e.target.checked)
                    if (fieldErrors.hardDeadline) setFieldErrors((p) => ({ ...p, hardDeadline: '' }))
                  }}
                />
                <span>Hard deadline checked and verified against source correspondence</span>
              </label>
            )}
            {fieldErrors.hardDeadline && (
              <p className="text-[12px] text-red-600 mt-1 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.hardDeadline}
              </p>
            )}
          </div>

          {/* Case Overview */}
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">Case Overview</label>
            <textarea
              rows={3}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Client instructions, background facts, and application pathway..."
              className="w-full p-2 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          {/* Engagement confirmed check */}
          <div className="space-y-1">
            <label className="flex items-center gap-2 text-[12.5px] text-[#202d2d] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={engagementConfirmed}
                onChange={(e) => {
                  setEngagementConfirmed(e.target.checked)
                  if (fieldErrors.engagement) setFieldErrors((p) => ({ ...p, engagement: '' }))
                }}
              />
              <span>Engagement confirmed & retainer executed in separate system</span>
            </label>
            {fieldErrors.engagement && (
              <p className="text-[12px] text-red-600 font-medium flex items-center gap-1">
                <span>•</span> {fieldErrors.engagement}
              </p>
            )}
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
              Create Retained File
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
