import React, { useState } from 'react'
import { Matter } from '@/types/crm'
import { Upload, Send } from 'lucide-react'

interface ClientPortalPreviewProps {
  matters: Matter[]
  selectedMatterId?: string
  onSelectMatter: (matterId: string) => void
  onSimulateUpload: (matterId: string, docIndex: number) => void
  onSendMessage: (matterId: string, text: string) => void
  onSaveQuestionnaire: (matterId: string, q: any) => void
}

export function ClientPortalPreview({
  matters,
  selectedMatterId,
  onSelectMatter,
  onSimulateUpload,
  onSendMessage,
  onSaveQuestionnaire
}: ClientPortalPreviewProps) {
  const currentMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]
  const [messageText, setMessageText] = useState('')
  const [qHistory, setQHistory] = useState(currentMatter.questionnaire?.history || '')
  const [qMarried, setQMarried] = useState(currentMatter.questionnaire?.married || 'No')

  const stageStatuses = [
    'Getting started',
    'Collecting your documents',
    'Preparing your application',
    'Preparing your application',
    'Finalizing your application',
    'Application submitted',
    'Matter completed'
  ]

  const statusLabel = stageStatuses[currentMatter.stage] || 'Under review'

  const pendingDocs = currentMatter.docs.filter(
    (d) => !['Approved', 'Not Applicable'].includes(d.status)
  )

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    onSendMessage(currentMatter.id, messageText.trim())
    setMessageText('')
  }

  const handleSaveQ = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveQuestionnaire(currentMatter.id, {
      ...currentMatter.questionnaire,
      history: qHistory,
      married: qMarried
    })
    alert('Your questionnaire answers have been saved for your legal team to verify.')
  }

  return (
    <div className="max-w-4xl 2xl:max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header & Client switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Client Experience · Portal Simulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Your Application
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[12px] font-semibold text-[#677472]">Preview client:</label>
          <select
            value={currentMatter.id}
            onChange={(e) => onSelectMatter(e.target.value)}
            className="py-1.5 px-3 bg-white border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] font-semibold outline-none"
          >
            {matters.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-[#263934] text-white rounded-2xl p-5 sm:p-7 lg:p-8 shadow-sm">
        <span className="text-[12px] font-semibold text-[#bfcec7] tracking-wider uppercase">
          {currentMatter.type} · File {currentMatter.id}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-white">
          {statusLabel}
        </h2>
        <p className="text-[14px] text-[#d3ded8] mt-2 max-w-xl">
          Hello {currentMatter.name.split(' ')[0]}, your Nationrise legal team is preparing your file.
        </p>
      </div>

      {/* Action Required: Upload Documents */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#202d2d]">Things You Need to Provide</h3>
        <p className="text-[13px] text-[#677472]">
          Please upload clear, legible copies of the requested documents below.
        </p>

        <div className="divide-y divide-[#edf0ee]">
          {pendingDocs.map((doc) => {
            const originalIndex = currentMatter.docs.findIndex((d) => d.name === doc.name)
            return (
              <div key={doc.name} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="font-bold text-[14px] text-[#202d2d]">{doc.name}</div>
                  <div className="text-[12px] text-[#677472]">
                    {doc.status === 'Correction Required'
                      ? 'Please provide a clear, complete replacement.'
                      : doc.status === 'Uploaded — Review Required'
                      ? 'Received — under review by your team.'
                      : 'Please provide a complete copy.'}
                  </div>
                </div>

                <button
                  onClick={() => onSimulateUpload(currentMatter.id, originalIndex)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f4f6f5] hover:bg-[#e8ecea] border border-[#cbd5d1] rounded-md text-[12.5px] font-semibold text-[#202d2d] transition-colors self-start sm:self-auto"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{doc.version ? 'Replace sample' : 'Upload sample'}</span>
                </button>
              </div>
            )
          })}

          {pendingDocs.length === 0 && (
            <div className="py-6 text-center text-[#246b54] font-semibold text-[13.5px]">
              ✓ No documents are currently requested from you. Your checklist is complete.
            </div>
          )}
        </div>
      </div>

      {/* Questionnaire Form */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#202d2d]">Background Questionnaire</h3>
        <form onSubmit={handleSaveQ} className="space-y-4 text-[13.5px]">
          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Previous applications or refusals
            </label>
            <textarea
              rows={3}
              value={qHistory}
              onChange={(e) => setQHistory(e.target.value)}
              placeholder="List any prior visas, permits, or refused applications..."
              className="w-full p-2.5 border border-[#cbd5d1] rounded-md outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#202d2d] mb-1">
              Have you been married before?
            </label>
            <select
              value={qMarried}
              onChange={(e) => setQMarried(e.target.value)}
              className="p-2 border border-[#cbd5d1] rounded-md bg-white outline-none"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#12382e] hover:bg-[#1a503e] text-white rounded-md font-semibold text-[13px] transition-colors"
          >
            Save answers
          </button>
        </form>
      </div>

      {/* Messages */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#202d2d]">Messages with Your Legal Team</h3>

        <div className="space-y-2.5 max-h-60 overflow-y-auto">
          {(currentMatter.messages || []).map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-[13px] ${
                m.from === 'Client' ? 'bg-[#edf4ff] ml-8' : 'bg-[#f4f6f5] mr-8'
              }`}
            >
              <div className="font-bold text-[11px] text-[#677472] mb-0.5">
                {m.from === 'Client' ? 'You' : 'Nationrise Team'}
              </div>
              <div className="text-[#202d2d]">{m.text}</div>
            </div>
          ))}

          {(!currentMatter.messages || currentMatter.messages.length === 0) && (
            <div className="text-center py-4 text-[#8ba79b] text-[13px]">
              No messages exchanged yet.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message to your case manager..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-3 py-2 border border-[#cbd5d1] rounded-md text-[13px] outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-[#246b54] hover:bg-[#1a503e] text-white rounded-md text-[13px] font-semibold flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 bg-[#f0e7dd] border border-[#e2d2be] rounded-lg text-[12.5px] text-[#78522e]">
        <strong>Confidentiality Notice:</strong> Internal legal strategy, review notes, risk ratings, and staff tasks are strictly isolated and never rendered in the client portal.
      </div>
    </div>
  )
}
