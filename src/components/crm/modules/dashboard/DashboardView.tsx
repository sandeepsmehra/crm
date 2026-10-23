import React, { useState } from 'react'
import { Matter, Appointment, PFLRecord, OfficeTask, ClientUpdate, NewsArticle, PersonalReminder } from '@/types/crm'
import { INITIAL_CLIENT_UPDATES, INITIAL_NEWS_ARTICLES, INITIAL_PERSONAL_REMINDERS } from '@/data/mockData'
import { toast } from '@/components/ui/sonner'
import { ClientUpdateModal } from './ClientUpdateModal'
import { PflModal } from './PflModal'
import { PersonalReminderModal } from './PersonalReminderModal'

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
            3
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
          <span className="w-5 h-5 rounded-full bg-[#b91c1c] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            1
          </span>
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

      {/* ========================================================= */}
      {/* TAB 1: FILE SUBMISSION DEADLINES (Exact SCR-001)           */}
      {/* ========================================================= */}
      {activeTab === 'File Submission Deadlines' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#1c2826]">File submission deadlines</h2>
            <p className="text-[13px] text-[#6b7280] mt-1">
              Overdue submissions and upcoming submissions for the next 10 calendar days. Each file appears once. Alerts use Vancouver calendar dates, including weekends.
            </p>
            <div className="mt-2 text-[13px] text-[#1c2826] font-medium">
              <button
                onClick={() => onNavigate('To-Do List')}
                className="hover:underline cursor-pointer"
              >
                Open To-Do List · View all deadlines, including overdue
              </button>
            </div>
          </div>

          {/* Card 1: Overdue (1) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#b91c1c] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1c2826]">
                Overdue <span className="text-[#6b7280] font-normal">(1)</span>
              </h3>
              <span className="text-xs text-[#6b7280]">Unsubmitted files stay visible beyond 10 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">SUBMISSION DEADLINE</th>
                    <th className="py-2.5 px-4">DAYS OVERDUE</th>
                    <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-normal text-[#1c2826]">2026-10-16</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#fce8e8] text-[#c53030] rounded px-2.5 py-0.5 text-xs font-semibold">
                        6 days overdue
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Grace Mensah</div>
                      <div className="text-xs text-[#6b7280]">Work Permit</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 2: Within 3 Days (2) matching SCR-001 pink background */}
          <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#dc2626] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  !
                </span>
                <span>Within 3 Days</span>
                <span className="text-[#dc2626] font-normal">(2)</span>
              </h3>
              <span className="text-xs text-[#6b7280]">Today–3 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">DUE DATE</th>
                    <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                    <th className="py-2.5 px-4">ACTION REQUIRED</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#fee2e2]">
                  <tr className="hover:bg-[#ffeded]">
                    <td className="py-3.5 px-4">
                      <span className="bg-[#dc2626] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                        Oct 22
                      </span>
                      <div className="text-[#dc2626] text-xs font-bold mt-1">
                        Due today · File submission
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Omar Siddiqui</div>
                      <div className="text-xs text-[#6b7280]">Express Entry PR Application</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Submit Express Entry PR Application</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                  </tr>
                  <tr className="hover:bg-[#ffeded]">
                    <td className="py-3.5 px-4">
                      <span className="bg-[#dc2626] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                        Oct 23
                      </span>
                      <div className="text-[#dc2626] text-xs font-bold mt-1">
                        Due tomorrow · File submission
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Kenji Watanabe</div>
                      <div className="text-xs text-[#6b7280]">Work Permit</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Submit Work Permit</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Within 5 Days (Week) (1) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#d97706] p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#1c2826]">
                Within 5 Days (Week) <span className="text-[#6b7280] font-normal">(1)</span>
              </h3>
              <span className="text-xs text-[#6b7280]">4–5 days</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">DUE DATE</th>
                    <th className="py-2.5 px-4">CLIENT / APPLICATION</th>
                    <th className="py-2.5 px-4">ACTION REQUIRED</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <span className="bg-[#d97706] text-white rounded px-2.5 py-0.5 text-xs font-bold">
                        Oct 27
                      </span>
                      <div className="text-[#d97706] text-xs font-semibold mt-1">
                        Due in 5 days · File submission
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Amandeep Singh</div>
                      <div className="text-xs text-[#6b7280]">Spousal Sponsorship</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Submit Spousal Sponsorship PR Application</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: LMIA DEADLINES (Exact SCR-002)                      */}
      {/* ========================================================= */}
      {activeTab === 'LMIA Deadlines' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-[20px] font-bold text-[#1c2826]">
              LMIA advertisement & submission reminders
            </h2>
            <p className="text-[13px] text-[#6b7280] mt-1 max-w-4xl">
              Ad expiry prompts preparation; it does not automatically mark an LMIA ready. Advertisement expiry, submission and on-hold review reminders use separate 3-, 5- and 10-day groups. Click a company to open its profile.
            </p>
          </div>

          {/* Card 1: Overdue (0) */}
          <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
                !
              </span>
              <h3 className="text-base font-bold text-[#dc2626]">Overdue <span className="font-normal">(0)</span></h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">COMPANY NAME</th>
                    <th className="py-2.5 px-4">POSITION</th>
                    <th className="py-2.5 px-4">REMINDER</th>
                    <th className="py-2.5 px-4">DEADLINE</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                    <th className="py-2.5 px-4">STATUS / REMINDER</th>
                  </tr>
                </thead>
              </table>
              <div className="py-10 text-center text-sm text-[#6b7280]">
                No reminders in this section.
              </div>
            </div>
          </div>

          {/* Card 2: Within 3 Days (0) */}
          <div className="bg-[#fff5f5] rounded-xl border border-[#dc2626]/20 border-l-4 border-l-[#dc2626] p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-5 h-5 rounded-full bg-[#dc2626] text-white text-xs font-bold flex items-center justify-center shrink-0">
                !
              </span>
              <h3 className="text-base font-bold text-[#dc2626]">Within 3 Days <span className="font-normal">(0)</span></h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fff0f0] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">COMPANY NAME</th>
                    <th className="py-2.5 px-4">POSITION</th>
                    <th className="py-2.5 px-4">REMINDER</th>
                    <th className="py-2.5 px-4">DEADLINE</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                    <th className="py-2.5 px-4">STATUS / REMINDER</th>
                  </tr>
                </thead>
              </table>
              <div className="py-10 text-center text-sm text-[#6b7280]">
                No reminders in this section.
              </div>
            </div>
          </div>

          {/* Card 3: Within 5 Days (Week) (0) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] border-l-4 border-l-[#d97706] p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-base font-bold text-[#1c2826]">Within 5 Days (Week) <span className="text-[#6b7280] font-normal">(0)</span></h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">COMPANY NAME</th>
                    <th className="py-2.5 px-4">POSITION</th>
                    <th className="py-2.5 px-4">REMINDER</th>
                    <th className="py-2.5 px-4">DEADLINE</th>
                    <th className="py-2.5 px-4">CASE MANAGER</th>
                    <th className="py-2.5 px-4">STATUS / REMINDER</th>
                  </tr>
                </thead>
              </table>
              <div className="py-10 text-center text-sm text-[#6b7280]">
                No reminders in this section.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: UPDATES (Exact SCR-003)                             */}
      {/* ========================================================= */}
      {activeTab === 'Updates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#1c2826]">Client Updates</h2>
            <button
              onClick={() => {
                setSelectedUpdateForEdit(null)
                setIsUpdateModalOpen(true)
              }}
              className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              + Create an Update
            </button>
          </div>

          {/* Subfilter Pills */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUpdatesFilter('Updates')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                updatesFilter === 'Updates'
                  ? 'bg-[#1f2d29] text-white'
                  : 'bg-white border border-[#e5e7eb] text-[#374151]'
              }`}
            >
              Updates ({clientUpdates.length})
            </button>
            <button
              onClick={() => setUpdatesFilter('UpdateSent')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                updatesFilter === 'UpdateSent'
                  ? 'bg-[#1f2d29] text-white'
                  : 'bg-white border border-[#e5e7eb] text-[#374151]'
              }`}
            >
              Update Sent ({clientUpdates.filter((u) => u.status === 'Sent' || u.actionStatus === 'Sent').length})
            </button>
          </div>

          {/* Updates Table Card matching SCR-003 */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">CLIENT NAME</th>
                    <th className="py-3 px-4">TYPE OF APPLICATION</th>
                    <th className="py-3 px-4">UPDATE</th>
                    <th className="py-3 px-4">CHECKED BY</th>
                    <th className="py-3 px-4">COMMENTS</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {clientUpdates.map((item) => (
                    <tr key={item.id} className="hover:bg-[#fbfcfb]">
                      <td className="py-3.5 px-4 text-[#1c2826]">{item.date}</td>
                      <td className="py-3.5 px-4 font-bold text-[#1c2826]">{item.clientName}</td>
                      <td className="py-3.5 px-4 text-[#1c2826]">{item.applicationType}</td>
                      <td className="py-3.5 px-4 text-[#1c2826]">{item.updateType}</td>
                      <td className="py-3.5 px-4 text-[#1c2826]">{item.checkedBy}</td>
                      <td className="py-3.5 px-4 text-[#1c2826] max-w-xs whitespace-pre-line">{item.comments}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1c2826]">
                          {item.status === 'Sent' || item.actionStatus === 'Sent' ? 'Sent' : 'Not Sent'}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUpdateForEdit(item)
                            setIsUpdateModalOpen(true)
                          }}
                          className="text-[12px] text-[#1c2826] hover:underline cursor-pointer block mt-0.5"
                        >
                          Open update
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

      {/* ========================================================= */}
      {/* TAB 4: PFL / REQUEST LETTERS (Exact SCR-005)               */}
      {/* ========================================================= */}
      {activeTab === 'PFL / Request Letters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#1c2826]">PFL / Request Letters</h2>
            <button
              onClick={() => setIsPflModalOpen(true)}
              className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              + Create a PFL / Request
            </button>
          </div>

          {/* Subtabs with Terracotta underline */}
          <div className="flex items-center gap-6 border-b border-[#e5e7eb] pb-2">
            <button
              onClick={() => setPflTab('Open')}
              className={`text-sm pb-1.5 cursor-pointer transition-colors ${
                pflTab === 'Open'
                  ? 'border-b-2 border-b-[#a75928] text-[#1c2826] font-semibold'
                  : 'text-[#6b7280] hover:text-[#1c2826]'
              }`}
            >
              Open Requests (3)
            </button>
            <button
              onClick={() => setPflTab('Completed')}
              className={`text-sm pb-1.5 cursor-pointer transition-colors ${
                pflTab === 'Completed'
                  ? 'border-b-2 border-b-[#a75928] text-[#1c2826] font-semibold'
                  : 'text-[#6b7280] hover:text-[#1c2826]'
              }`}
            >
              Completed (0)
            </button>
          </div>

          <div className="pt-2">
            <h3 className="text-base font-bold text-[#1c2826]">Open requests (3)</h3>
            <p className="text-xs text-[#6b7280] mt-0.5">
              Nearest deadline first · Countdown updates daily
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Application</th>
                    <th className="py-3 px-4">Request</th>
                    <th className="py-3 px-4">Case Manager</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Days Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {/* Row 1 matching SCR-005 */}
                  <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-002')}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Omar Siddiqui →</div>
                      <div className="text-xs text-[#6b7280]">File: DEMO-E654321</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Express Entry PR Application</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Documents Requested</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">2026-10-22</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#b91c1c] text-white rounded-full px-3 py-1 text-xs font-semibold">
                        Due today
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 matching SCR-005 */}
                  <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-001')}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Amandeep Singh →</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Spousal Sponsorship</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">PFL</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Inderpreet</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">2026-10-27</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#b91c1c] text-white rounded-full px-3 py-1 text-xs font-semibold">
                        5 days left
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 matching SCR-005 */}
                  <tr className="hover:bg-[#fbfcfb] cursor-pointer" onClick={() => onOpenMatter('DEMO-MAT-003')}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#1c2826]">Lucas Martin →</div>
                      <div className="text-xs text-[#6b7280]">File: DEMO-W123456</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">PRRA</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">PFL</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">2026-10-30</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#eab308] text-white rounded-full px-3 py-1 text-xs font-semibold">
                        8 days left
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-[#6b7280]">
            Click a client name to open, edit or complete the request.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: NEWS (Exact SCR-010)                                */}
      {/* ========================================================= */}
      {activeTab === 'News' && (
        <div className="space-y-4">
          <h2 className="text-[20px] font-bold text-[#1c2826]">Canada Immigration News</h2>

          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 shadow-2xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#1c2826]">Canada Immigration News</h3>
              <p className="text-xs text-[#6b7280] mt-1">
                Selected official IRCC updates · Checked October 8, 2026. This sample is a dated snapshot, not an automatic live feed.
              </p>
            </div>

            <div className="space-y-5 divide-y divide-[#f3f4f6]">
              <div className="pt-2">
                <div className="text-xs text-[#6b7280]">October 7, 2026 · IRCC</div>
                <button
                  onClick={() => {
                    setSelectedArticle(newsArticles[0])
                    toast.info('Opened IRCC bulletin')
                  }}
                  className="text-[15px] font-bold text-[#a75928] underline hover:text-[#924c1f] cursor-pointer mt-1 text-left block"
                >
                  IRCC surveys Ukrainian temporary residents
                </button>
              </div>

              <div className="pt-4">
                <div className="text-xs text-[#6b7280]">September 29, 2026 · IRCC</div>
                <button
                  onClick={() => {
                    setSelectedArticle(newsArticles[1])
                    toast.info('Opened IRCC bulletin')
                  }}
                  className="text-[15px] font-bold text-[#a75928] underline hover:text-[#924c1f] cursor-pointer mt-1 text-left block"
                >
                  PRRA eligibility update: Israel and Palestine
                </button>
              </div>

              <div className="pt-4">
                <div className="text-xs text-[#6b7280]">September 9, 2026 · IRCC</div>
                <button
                  onClick={() => {
                    setSelectedArticle(newsArticles[2])
                    toast.info('Opened IRCC bulletin')
                  }}
                  className="text-[15px] font-bold text-[#a75928] underline hover:text-[#924c1f] cursor-pointer mt-1 text-left block"
                >
                  Short-term study measure for eligible work permit holders
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#f3f4f6] text-xs text-[#a75928] space-x-2 font-medium">
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('IRCC notices feed opened'); }} className="underline hover:text-[#924c1f]">
                See current IRCC notices
              </a>
              <span className="text-[#6b7280]">·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('IRCC newsroom feed opened'); }} className="underline hover:text-[#924c1f]">
                IRCC newsroom
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: PERSONAL REMINDERS (Exact SCR-008)                  */}
      {/* ========================================================= */}
      {activeTab === 'Personal Reminders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#1c2826]">Personal Reminders</h2>
            <button
              onClick={() => setIsReminderModalOpen(true)}
              className="px-4 py-2 bg-[#a75928] hover:bg-[#924c1f] text-white rounded-md text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              + Create Reminder
            </button>
          </div>

          {/* Urgency Tabs */}
          <div className="flex items-center gap-4 border-b border-[#e5e7eb] pb-2 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setRemindersUrgency('All')}
              className={`pb-1 cursor-pointer whitespace-nowrap ${
                remindersUrgency === 'All'
                  ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
                  : 'text-[#6b7280]'
              }`}
            >
              All Reminders (2)
            </button>
            <button
              onClick={() => setRemindersUrgency('Overdue')}
              className={`pb-1 cursor-pointer whitespace-nowrap ${
                remindersUrgency === 'Overdue'
                  ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
                  : 'text-[#6b7280]'
              }`}
            >
              Overdue (1)
            </button>
            <button
              onClick={() => setRemindersUrgency('Within 3 Days')}
              className="bg-[#fff5f5] text-[#dc2626] border border-[#fca5a5] rounded-md px-3 py-1 font-semibold text-xs cursor-pointer whitespace-nowrap"
            >
              Within 3 Days (0)
            </button>
            <button
              onClick={() => setRemindersUrgency('Within 5 Days')}
              className={`pb-1 cursor-pointer whitespace-nowrap ${
                remindersUrgency === 'Within 5 Days'
                  ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
                  : 'text-[#6b7280]'
              }`}
            >
              Within 5 Days (Week) (0)
            </button>
            <button
              onClick={() => setRemindersUrgency('Within 10 Days')}
              className={`pb-1 cursor-pointer whitespace-nowrap ${
                remindersUrgency === 'Within 10 Days'
                  ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
                  : 'text-[#6b7280]'
              }`}
            >
              Within 10 Days (2 Weeks) (1)
            </button>
            <button
              onClick={() => setRemindersUrgency('Later')}
              className={`pb-1 cursor-pointer whitespace-nowrap ${
                remindersUrgency === 'Later'
                  ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
                  : 'text-[#6b7280]'
              }`}
            >
              Later (0)
            </button>
          </div>

          {/* Case Manager Dropdown Filter */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#1c2826] font-medium">Case manager</span>
            <select
              value={reminderManagerFilter}
              onChange={(e) => setReminderManagerFilter(e.target.value)}
              className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-3 py-1.5 text-xs font-medium outline-none cursor-pointer"
            >
              <option value="All">All case managers</option>
              <option value="Amanpreet">Amanpreet</option>
              <option value="Inderpreet">Inderpreet</option>
              <option value="Sukhman">Sukhman</option>
              <option value="Tejinder">Tejinder</option>
            </select>
          </div>

          <p className="text-xs text-[#6b7280]">
            Date-based reminders use Vancouver dates. Each reminder belongs to one date group. Later contains reminders more than 10 days away. Shared workspace reminders are visible to your team.
          </p>

          {/* Reminders Table matching SCR-008 */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">REMINDER DATE</th>
                    <th className="py-3 px-4">REMINDER</th>
                    <th className="py-3 px-4">REMINDER FOR</th>
                    <th className="py-3 px-4">RELATED APPLICATION</th>
                    <th className="py-3 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {/* Row 1 */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1c2826]">Oct 19</div>
                      <span className="bg-[#dc2626] text-white rounded px-2 py-0.5 text-[11px] font-bold mt-1 inline-block">
                        Overdue by 3 days
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">
                      Check abd IRCC news for TRV processing changes
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Sukhman</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">General reminder</td>
                    <td className="py-3.5 px-4 space-x-2">
                      <button
                        onClick={() => setIsReminderModalOpen(true)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleReminder(personalReminders[0]?.id || '1')}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Mark Complete
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#1c2826]">Oct 28</div>
                      <span className="bg-[#e0f2fe] text-[#0284c7] rounded px-2 py-0.5 text-[11px] font-semibold mt-1 inline-block">
                        6 days left
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">
                      Renew office professional insurance
                    </td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Amanpreet</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">General reminder</td>
                    <td className="py-3.5 px-4 space-x-2">
                      <button
                        onClick={() => setIsReminderModalOpen(true)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleReminder(personalReminders[1]?.id || '2')}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
                      >
                        Mark Complete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
