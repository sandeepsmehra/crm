import React, { useState } from 'react'
import { Matter, Appointment, PFLRecord, OfficeTask, ClientUpdate, NewsArticle, PersonalReminder } from '@/types/crm'
import { INITIAL_CLIENT_UPDATES, INITIAL_NEWS_ARTICLES, INITIAL_PERSONAL_REMINDERS } from '@/data/mockData'
import { toast } from '@/components/ui/sonner'
import { ClientUpdateModal } from './ClientUpdateModal'
import { PflModal } from './PflModal'
import { PersonalReminderModal } from './PersonalReminderModal'
import {
  FileSubmissionDeadlinesTab,
  LmiaDeadlinesTab,
  UpdatesTab,
  PflTab,
  NewsTab,
  PersonalRemindersTab
} from './tabs'

interface DashboardViewProps {
  matters: Matter[]
  appointments: Appointment[]
  officeTasks: OfficeTask[]
  pflRecords: PFLRecord[]
  staffList: string[]
  onOpenMatter: (matterId: string) => void
  onNavigate: (view: any, filter?: string) => void
  onNewMatter: () => void
  onNewPfl: () => void
  onAssignTask?: () => void
}

type DashboardTab = 
  | 'File Submission Deadlines' 
  | 'LMIA Deadlines' 
  | 'Updates' 
  | 'PFL / Request Letters' 
  | 'News' 
  | 'Personal Reminders'

export function DashboardView({
  matters,
  onOpenMatter,
  onNavigate
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('File Submission Deadlines')
  
  // Dashboard Specific States
  const [clientUpdates, setClientUpdates] = useState<ClientUpdate[]>(INITIAL_CLIENT_UPDATES)
  const [newsArticles] = useState<NewsArticle[]>(INITIAL_NEWS_ARTICLES)
  const [personalReminders, setPersonalReminders] = useState<PersonalReminder[]>(INITIAL_PERSONAL_REMINDERS)
  
  // Subfilters
  const [updatesFilter, setUpdatesFilter] = useState<'Updates' | 'UpdateSent'>('Updates')
  const [pflTab, setPflTab] = useState<'Open' | 'Completed'>('Open')
  const [remindersUrgency, setRemindersUrgency] = useState<string>('All')
  const [reminderManagerFilter, setReminderManagerFilter] = useState<string>('All')

  // Modals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedUpdateForEdit, setSelectedUpdateForEdit] = useState<ClientUpdate | null>(null)
  const [isPflModalOpen, setIsPflModalOpen] = useState(false)
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  // Handlers
  const handleSaveUpdate = (update: ClientUpdate) => {
    setClientUpdates((prev) => {
      const exists = prev.some((u) => u.id === update.id)
      if (exists) {
        return prev.map((u) => (u.id === update.id ? update : u))
      }
      return [update, ...prev]
    })
  }

  const handleSaveReminder = (reminder: PersonalReminder) => {
    setPersonalReminders([reminder, ...personalReminders])
  }

  const handleToggleReminder = (id: string) => {
    setPersonalReminders(
      personalReminders.map((r) => {
        if (r.id === id) {
          const nextState = !r.completed
          toast.success(nextState ? 'Reminder marked completed' : 'Reminder restored to active')
          return { ...r, completed: nextState }
        }
        return r
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title matching SCR-001/002/003 */}
      <div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] leading-none">
          Dashboard
        </h1>
      </div>

      {/* The 6 Main Tabs matching SCR-001 */}
      <div className="flex items-center gap-1 border-b border-[#e5e7eb] pb-0 overflow-x-auto scrollbar-none select-none">
        <button
          onClick={() => setActiveTab('File Submission Deadlines')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'File Submission Deadlines'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>File Submission Deadlines</span>
          <span className="w-5 h-5 rounded-full bg-[#b91c1c] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            1
          </span>
        </button>

        <button
          onClick={() => setActiveTab('LMIA Deadlines')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'LMIA Deadlines'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>LMIA Deadlines</span>
        </button>

        <button
          onClick={() => setActiveTab('Updates')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'Updates'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>Updates</span>
        </button>

        <button
          onClick={() => setActiveTab('PFL / Request Letters')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'PFL / Request Letters'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>PFL / Request Letters</span>
        </button>

        <button
          onClick={() => setActiveTab('News')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'News'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>News</span>
        </button>

        <button
          onClick={() => setActiveTab('Personal Reminders')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
            activeTab === 'Personal Reminders'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          <span>Personal Reminders</span>
          <span className="w-5 h-5 rounded-full bg-[#b91c1c] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            1
          </span>
        </button>
      </div>

      {/* Render Active Tab */}
      {activeTab === 'File Submission Deadlines' && (
        <FileSubmissionDeadlinesTab onNavigate={onNavigate} />
      )}

      {activeTab === 'LMIA Deadlines' && (
        <LmiaDeadlinesTab />
      )}

      {activeTab === 'Updates' && (
        <UpdatesTab
          clientUpdates={clientUpdates}
          updatesFilter={updatesFilter}
          onFilterChange={setUpdatesFilter}
          onCreateUpdate={() => {
            setSelectedUpdateForEdit(null)
            setIsUpdateModalOpen(true)
          }}
          onOpenUpdate={(update) => {
            setSelectedUpdateForEdit(update)
            setIsUpdateModalOpen(true)
          }}
        />
      )}

      {activeTab === 'PFL / Request Letters' && (
        <PflTab
          pflTab={pflTab}
          onTabChange={setPflTab}
          onCreatePfl={() => setIsPflModalOpen(true)}
          onOpenMatter={onOpenMatter}
        />
      )}

      {activeTab === 'News' && (
        <NewsTab
          newsArticles={newsArticles}
          onSelectArticle={(article) => setSelectedArticle(article)}
        />
      )}

      {activeTab === 'Personal Reminders' && (
        <PersonalRemindersTab
          personalReminders={personalReminders}
          remindersUrgency={remindersUrgency}
          onUrgencyChange={setRemindersUrgency}
          reminderManagerFilter={reminderManagerFilter}
          onManagerFilterChange={setReminderManagerFilter}
          onCreateReminder={() => setIsReminderModalOpen(true)}
          onEditReminder={() => setIsReminderModalOpen(true)}
          onToggleReminder={handleToggleReminder}
        />
      )}

      {/* Modals for Dashboard Views */}
      <ClientUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setSelectedUpdateForEdit(null)
        }}
        onSave={handleSaveUpdate}
        matters={matters}
        initialUpdate={selectedUpdateForEdit}
      />

      <PflModal
        isOpen={isPflModalOpen}
        onClose={() => setIsPflModalOpen(false)}
        onSave={() => {}}
        matters={matters}
      />

      <PersonalReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleSaveReminder}
        matters={matters}
      />

      {/* News Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-lg p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#12382e] bg-[#eef4f1] px-2 py-0.5 rounded">
                {selectedArticle.category}
              </span>
              <span className="text-[#677472]">{selectedArticle.date}</span>
            </div>
            <h2 className="text-lg font-bold text-[#12382e]">{selectedArticle.title}</h2>
            <p className="text-[13.5px] text-[#33423d] leading-relaxed">{selectedArticle.summary}</p>
            <div className="pt-4 border-t border-[#edf0ee] flex items-center justify-between">
              <span className="text-xs text-[#677472]">Official Government Release</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-1.5 bg-[#a75928] hover:bg-[#924c1f] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
