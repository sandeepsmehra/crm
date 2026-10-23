import React, { useState } from 'react'
import { APPLICATION_TYPES } from '@/data/mockData'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TemplatesTabProps {
  selectedTemplate: string
  onSelectedTemplateChange: (value: string) => void
  requirementsList: string
  onRequirementsListChange: (value: string) => void
  preparationTasks: string
  onPreparationTasksChange: (value: string) => void
  onSaveTemplate: () => void
}

export function TemplatesTab({
  selectedTemplate,
  onSelectedTemplateChange,
  requirementsList,
  onRequirementsListChange,
  preparationTasks,
  onPreparationTasksChange,
  onSaveTemplate
}: TemplatesTabProps) {
  const [workflowRulesOpen, setWorkflowRulesOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="max-w-xl">
        <label className="block text-sm font-semibold text-[#111827] mb-1.5">
          Service template
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) => onSelectedTemplateChange(e.target.value)}
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
            onChange={(e) => onRequirementsListChange(e.target.value)}
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
            onChange={(e) => onPreparationTasksChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg p-3.5 text-sm text-[#111827] outline-none leading-relaxed"
          />
        </div>
      </div>

      <div>
        <button
          onClick={onSaveTemplate}
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
  )
}
