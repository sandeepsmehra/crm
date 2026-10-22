import React, { useState } from 'react'
import { APPLICATION_TYPES, DOCUMENT_TEMPLATES, TASK_TEMPLATES } from '@/data/mockData'
import { Download, Shield, FileText, CheckCircle, Clock } from 'lucide-react'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'Templates' | 'Permissions' | 'Developer Guide' | 'Reports'>('Templates')
  const [selectedTemplate, setSelectedTemplate] = useState('Spousal Sponsorship')
  const [docsList, setDocsList] = useState(
    (DOCUMENT_TEMPLATES[selectedTemplate] || DOCUMENT_TEMPLATES.default).join('\n')
  )
  const [tasksList, setTasksList] = useState(
    (TASK_TEMPLATES.default).join('\n')
  )

  const handleTemplateChange = (tmpl: string) => {
    setSelectedTemplate(tmpl)
    setDocsList((DOCUMENT_TEMPLATES[tmpl] || DOCUMENT_TEMPLATES.default).join('\n'))
  }

  const handleSaveTemplate = () => {
    alert(`Template for ${selectedTemplate} saved for new matters!`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
          Administration & Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
          Settings & Workflows
        </h1>
        <p className="text-[14px] text-[#677472] mt-0.5">
          Configure service templates, review access policies, and audit practice turnaround metrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#dfe5e3] overflow-x-auto scrollbar-none pb-0.5">
        {(['Templates', 'Permissions', 'Developer Guide', 'Reports'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t
                ? 'border-[#a7653b] text-[#a7653b]'
                : 'border-transparent text-[#677472] hover:text-[#202d2d]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 1. Templates Tab */}
      {activeTab === 'Templates' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-4 sm:p-6 shadow-xs space-y-5 max-w-4xl 2xl:max-w-6xl">
          <div>
            <label className="block text-[13px] font-bold text-[#202d2d] mb-1.5">
              Service Workflow Template
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full sm:w-72 p-2.5 border border-[#cbd5d1] rounded-md text-[13.5px] font-semibold bg-white"
            >
              {APPLICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12.5px] font-bold text-[#677472] uppercase mb-1.5">
                Standard Client Document Requirements (One per line)
              </label>
              <textarea
                rows={9}
                value={docsList}
                onChange={(e) => setDocsList(e.target.value)}
                className="w-full p-3 border border-[#cbd5d1] rounded-md font-mono text-[12.5px] outline-none"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-bold text-[#677472] uppercase mb-1.5">
                Standard Staff Checklist Tasks (One per line)
              </label>
              <textarea
                rows={9}
                value={tasksList}
                onChange={(e) => setTasksList(e.target.value)}
                className="w-full p-3 border border-[#cbd5d1] rounded-md font-mono text-[12.5px] outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <button
              onClick={handleSaveTemplate}
              className="px-5 py-2.5 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto"
            >
              Save Template Changes
            </button>
            <span className="text-[12px] text-[#677472]">
              Applies automatically to newly opened matters.
            </span>
          </div>
        </div>
      )}

      {/* 2. Permissions Tab */}
      {activeTab === 'Permissions' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-4 sm:p-6 shadow-xs max-w-4xl 2xl:max-w-6xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#246b54]" />
            <h2 className="text-xl font-bold text-[#202d2d]">Role-Based Access Design</h2>
          </div>
          <p className="text-[13px] text-[#677472]">
            Nationrise CaseOS strictly enforces authorization boundaries between management, caseworkers, reception, and clients.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px] border-collapse mt-4 min-w-[540px]">
              <thead>
                <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase">
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">System Scope & Responsibilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf0ee]">
                {[
                  ['Owner / Admin', 'Full practice overview, all matters, billing confirmation, staff configuration and audit history.'],
                  ['RCIC-IRB', 'Responsible legal strategy, review gates, correction return, approve final preparation, hard deadlines.'],
                  ['Manager', 'Operational caseload distribution, overdue action tracking, performance reporting.'],
                  ['Case Manager', 'Assigned files, document review/approval, questionnaire verification, forms preparation.'],
                  ['Reception', 'Telephone enquiries, appointments sheet, client intake, contact lookup, task dispatch.'],
                  ['Client Portal', 'Restricted to own requested documents, background questionnaire, and communication with assigned team.']
                ].map(([role, desc]) => (
                  <tr key={role}>
                    <td className="py-3 px-4 font-bold text-[#12382e] whitespace-nowrap">{role}</td>
                    <td className="py-3 px-4 text-[#202d2d]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Developer Guide Tab */}
      {activeTab === 'Developer Guide' && (
        <div className="bg-white border border-[#dfe5e3] rounded-xl p-4 sm:p-6 shadow-xs max-w-4xl 2xl:max-w-6xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#edf0ee] pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#202d2d]">Developer Handoff & Architecture</h2>
              <p className="text-[13px] text-[#677472] mt-0.5">
                Core operating principles and acceptance walkthrough.
              </p>
            </div>
            <button
              onClick={() => alert('Download demo configuration package triggered!')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13px] font-semibold self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download sample</span>
            </button>
          </div>

          <div className="space-y-4 text-[13.5px] text-[#202d2d] leading-relaxed">
            <h3 className="font-bold text-[16px] text-[#12382e]">Five Non-Negotiable Rules</h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-[#202d2d]">
              <li><strong>Every active matter has a named case owner.</strong></li>
              <li><strong>Every active matter has a dated next action.</strong></li>
              <li><strong>Stage and action holder are separate fields</strong> (e.g. Stage 3 RCIC Review, held by RCIC).</li>
              <li><strong>Completion triggers the next predictable work</strong> (e.g. Documents complete unlocks Preparation).</li>
              <li><strong>Management can identify delays without asking staff</strong> (visible overdue count, stalled files).</li>
            </ol>
          </div>
        </div>
      )}

      {/* 4. Reports Tab */}
      {activeTab === 'Reports' && (
        <div className="space-y-6 max-w-4xl 2xl:max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="stat-card">
              <span className="label">Total Active Matters</span>
              <span className="num text-[#12382e]">8</span>
              <span className="foot text-[#677472]">In sample practice</span>
            </div>
            <div className="stat-card">
              <span className="label">Submitted Applications</span>
              <span className="num text-[#246b54]">1</span>
              <span className="foot text-[#677472]">Government processing</span>
            </div>
            <div className="stat-card">
              <span className="label">Hard Deadlines</span>
              <span className="num text-[#ae4343]">3</span>
              <span className="foot text-[#677472]">Time-sensitive</span>
            </div>
            <div className="stat-card">
              <span className="label">Average Turnaround</span>
              <span className="num text-[#356c8d]">3.2d</span>
              <span className="foot text-[#677472]">RCIC review gate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
