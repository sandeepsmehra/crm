import React, { useState } from 'react'
import { staffAccessZodSchema, staffAccessYupSchema } from './settings.validation'
import { toast } from '@/components/ui/sonner'
import {
  AccessTab,
  ImportTab,
  AuditHistoryTab,
  RecoveryPointsTab,
  TemplatesTab,
  DeveloperGuideTab,
  UserAccessItem
} from './tabs'

type SettingsTab = 'Access' | 'Import' | 'Audit History' | 'Recovery Points' | 'Templates' | 'Developer guide'

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Access')
  const [staffEmail, setStaffEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [staffRole, setStaffRole] = useState<'case_manager' | 'reception' | 'viewer' | 'owner'>('case_manager')
  const [usersList, setUsersList] = useState<UserAccessItem[]>([
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

  // Import Tab state
  const [needsReviewOnly, setNeedsReviewOnly] = useState(true)
  const [importSearch, setImportSearch] = useState('')

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffEmail.trim()) {
      setEmailError('Staff email is required')
      toast.error('Staff email is required')
      return
    }

    const candidate = {
      email: staffEmail.trim(),
      name: staffEmail.split('@')[0],
      role: staffRole
    }

    // Zod validation
    const zodResult = staffAccessZodSchema.safeParse(candidate)
    if (!zodResult.success) {
      const msg = zodResult.error.issues[0]?.message || 'Invalid email address'
      setEmailError(msg)
      toast.error(msg)
      return
    }

    // Yup validation
    try {
      staffAccessYupSchema.validateSync(candidate, { abortEarly: false })
    } catch (err: any) {
      if (err.errors) {
        setEmailError(err.errors[0])
        toast.error(err.errors[0])
        return
      }
    }

    setEmailError('')
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

      {/* Render Active Tab */}
      {activeTab === 'Access' && (
        <AccessTab
          staffEmail={staffEmail}
          onStaffEmailChange={(val) => {
            setStaffEmail(val)
            if (emailError) setEmailError('')
          }}
          staffRole={staffRole}
          onStaffRoleChange={setStaffRole}
          usersList={usersList}
          onAddStaff={handleAddStaff}
          emailError={emailError}
        />
      )}

      {activeTab === 'Import' && (
        <ImportTab
          needsReviewOnly={needsReviewOnly}
          onNeedsReviewOnlyChange={setNeedsReviewOnly}
          importSearch={importSearch}
          onImportSearchChange={setImportSearch}
        />
      )}

      {activeTab === 'Audit History' && (
        <AuditHistoryTab />
      )}

      {activeTab === 'Recovery Points' && (
        <RecoveryPointsTab
          onExportRecords={handleExportRecords}
          onRestore={handleRestore}
        />
      )}

      {activeTab === 'Templates' && (
        <TemplatesTab
          selectedTemplate={selectedTemplate}
          onSelectedTemplateChange={setSelectedTemplate}
          requirementsList={requirementsList}
          onRequirementsListChange={setRequirementsList}
          preparationTasks={preparationTasks}
          onPreparationTasksChange={setPreparationTasks}
          onSaveTemplate={handleSaveTemplate}
        />
      )}

      {activeTab === 'Developer guide' && (
        <DeveloperGuideTab />
      )}
    </div>
  )
}
