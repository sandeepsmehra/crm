import React, { useState, useEffect } from 'react'
import { 
  CRMView, 
  Matter, 
  Client, 
  Appointment, 
  OfficeTask, 
  PFLRecord, 
  DeadlineItem,
  ContactLogEntry,
  SubmissionRecord
} from '@/types/crm'
import { 
  INITIAL_MATTERS, 
  INITIAL_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_OFFICE_TASKS, 
  INITIAL_PFL_RECORDS,
  STAFF_MEMBERS,
  TODAY
} from '@/data/mockData'
import { hasHardDeadlineSoon } from '@/lib/crmUtils'

// Layout Components
import { NationriseSidebar } from '@/components/crm/layout/NationriseSidebar'
import { NationriseTopBar } from '@/components/crm/layout/NationriseTopBar'
import { DemoBanner } from '@/components/crm/layout/DemoBanner'
import { Toaster, toast } from '@/components/ui/sonner'

// Module Group Components (Views + Related Modals per Module)
import { DashboardView, PflModal } from '@/components/crm/modules/dashboard'
import { TaskManagerView, OfficeTaskModal, CompleteTaskModal } from '@/components/crm/modules/task-manager'
import { AppointmentsView, AppointmentModal } from '@/components/crm/modules/appointments'
import { ClientsView, NewClientModal, ClientProfileModal } from '@/components/crm/modules/clients'
import { TodoListMattersView, NewMatterModal, RecordSubmissionModal } from '@/components/crm/modules/todo-list'
import { MatterDetailView, EditAssignmentModal, RecordContactModal } from '@/components/crm/modules/matter'
import { CaseManagersView } from '@/components/crm/modules/case-managers'
import { RetainersInvoicesView } from '@/components/crm/modules/retainers-invoices'
import { DeadlineCentreView, DeadlineModal } from '@/components/crm/modules/deadline-centre'
import { ClientPortalPreview } from '@/components/crm/modules/client-portal'
import { SettingsView } from '@/components/crm/modules/settings'
import { QuickMenuModal } from '@/components/crm/modules/common'

export function App() {
  // Persistent State
  const [matters, setMatters] = useState<Matter[]>(() => {
    const saved = localStorage.getItem('nationrise_matters')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* use initial */ }
    }
    return INITIAL_MATTERS
  })

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('nationrise_clients')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* use initial */ }
    }
    return INITIAL_CLIENTS
  })

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('nationrise_appointments')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* use initial */ }
    }
    return INITIAL_APPOINTMENTS
  })

  const [officeTasks, setOfficeTasks] = useState<OfficeTask[]>(() => {
    const saved = localStorage.getItem('nationrise_tasks')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* use initial */ }
    }
    return INITIAL_OFFICE_TASKS
  })

  const [pflRecords, setPflRecords] = useState<PFLRecord[]>(() => {
    const saved = localStorage.getItem('nationrise_pfl')
    if (saved) {
      try { return JSON.parse(saved) } catch { /* use initial */ }
    }
    return INITIAL_PFL_RECORDS
  })

  // Navigation and Search State
  const [currentView, setCurrentView] = useState<CRMView>('Dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [staffList, setStaffList] = useState<string[]>(STAFF_MEMBERS)
  const [selectedMatterId, setSelectedMatterId] = useState<string>(INITIAL_MATTERS[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals Visibility State
  const [isNewClientOpen, setIsNewClientOpen] = useState(false)
  const [newClientPhonePrefill, setNewClientPhonePrefill] = useState('')

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState<Appointment | null>(null)
  const [apptDefaultDate, setApptDefaultDate] = useState<string | undefined>()
  const [apptDefaultTime, setApptDefaultTime] = useState<string | undefined>()

  const [isNewMatterOpen, setIsNewMatterOpen] = useState(false)
  const [newMatterInitialClientId, setNewMatterInitialClientId] = useState<string | undefined>()

  const [isOfficeTaskOpen, setIsOfficeTaskOpen] = useState(false)
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<OfficeTask | null>(null)

  const [isCompleteTaskOpen, setIsCompleteTaskOpen] = useState(false)
  const [taskToComplete, setTaskToComplete] = useState<OfficeTask | null>(null)

  const [isPflOpen, setIsPflOpen] = useState(false)
  const [isDeadlineOpen, setIsDeadlineOpen] = useState(false)
  const [deadlineMatterId, setDeadlineMatterId] = useState<string | undefined>()

  const [isRecordContactOpen, setIsRecordContactOpen] = useState(false)
  const [isRecordSubmissionOpen, setIsRecordSubmissionOpen] = useState(false)

  const [isClientProfileOpen, setIsClientProfileOpen] = useState(false)
  const [selectedClientForProfile, setSelectedClientForProfile] = useState<Client | null>(null)

  const [isEditAssignmentOpen, setIsEditAssignmentOpen] = useState(false)
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('nationrise_matters', JSON.stringify(matters))
  }, [matters])

  useEffect(() => {
    localStorage.setItem('nationrise_clients', JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem('nationrise_appointments', JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem('nationrise_tasks', JSON.stringify(officeTasks))
  }, [officeTasks])

  useEffect(() => {
    localStorage.setItem('nationrise_pfl', JSON.stringify(pflRecords))
  }, [pflRecords])

  // Toast Helper
  const showToast = (msg: string) => {
    toast.success(msg)
  }

  // Reset Demo Session
  const handleResetDemo = () => {
    if (confirm('Reset fictional changes and restore initial sample practice records?')) {
      localStorage.clear()
      setMatters(INITIAL_MATTERS)
      setClients(INITIAL_CLIENTS)
      setAppointments(INITIAL_APPOINTMENTS)
      setOfficeTasks(INITIAL_OFFICE_TASKS)
      setPflRecords(INITIAL_PFL_RECORDS)
      setCurrentView('Dashboard')
      showToast('Fictional sample workspace reset.')
    }
  }

  // Active counts for badges
  const activeTaskCount = officeTasks.filter((t) => t.status !== 'Completed' && t.due <= TODAY).length
  const deadlineCount = matters.filter((m) => hasHardDeadlineSoon(m)).length
  const retainedCount = matters.filter((m) => m.retained && m.stage < 6).length

  // Current matter being viewed
  const currentMatter = matters.find((m) => m.id === selectedMatterId) || matters[0]
  const currentMatterClient = clients.find((c) => c.id === currentMatter.clientId)

  // Handlers for Matters
  const handleOpenMatter = (id: string) => {
    setSelectedMatterId(id)
    setCurrentView('Matter')
  }

  const handleUpdateMatter = (updated: Matter) => {
    setMatters((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    showToast('Matter updated successfully.')
  }

  const handleCreateMatter = (newMatter: Matter) => {
    setMatters((prev) => [newMatter, ...prev])
    setSelectedMatterId(newMatter.id)
    setCurrentView('Matter')
    showToast(`Matter opened and assigned to ${newMatter.owner}.`)
  }

  const handleUpdateSubmissionDeadline = (matterId: string, deadline: string) => {
    setMatters((prev) =>
      prev.map((m) => (m.id === matterId ? { ...m, submissionDue: deadline } : m))
    )
    showToast('File submission deadline updated.')
  }

  const handleChangeStage = (matterId: string, stage: number, stageName?: string) => {
    setMatters((prev) =>
      prev.map((m) =>
        m.id === matterId
          ? {
              ...m,
              stage: stage as any,
              ready: stageName === 'Ready',
              events: [`Stage changed to ${stageName || stage}`, ...m.events]
            }
          : m
      )
    )
    showToast(`File stage changed to ${stageName}.`)
  }

  // Handlers for Clients
  const handleCreateClient = (newClient: Client, consultationDateTime?: string) => {
    setClients((prev) => [...prev, newClient])
    if (consultationDateTime) {
      const datePart = consultationDateTime.slice(0, 10)
      const timePart = consultationDateTime.slice(11, 16)
      const newAppt: Appointment = {
        id: Date.now(),
        client: newClient.id,
        date: datePart,
        time: timePart,
        duration: 30,
        consultant: 'Tejinder',
        status: 'Scheduled',
        confirmation: 'Pending',
        section: 'Clients',
        phone: newClient.phone,
        email: newClient.email,
        source: 'Client Intake',
        called: TODAY,
        notes: `${newClient.type} consultation`,
        service: newClient.type,
        reminder: 'Pending',
        followup: '',
        history: ['Booked during client intake']
      }
      setAppointments((prev) => [...prev, newAppt])
      showToast(`Client ${newClient.name} created and consultation scheduled!`)
    } else {
      showToast(`Client ${newClient.name} created.`)
    }
  }

  const handleUpdateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    showToast(`Client profile for ${updated.name} updated.`)
  }

  // Handlers for Appointments
  const handleSaveAppointment = (appt: Appointment, newClientObj?: Client) => {
    if (newClientObj) {
      setClients((prev) => [...prev, newClientObj])
    }
    setAppointments((prev) => {
      const exists = prev.some((a) => a.id === appt.id)
      if (exists) {
        return prev.map((a) => (a.id === appt.id ? appt : a))
      }
      return [...prev, appt]
    })
    showToast('Appointment saved in the weekly sheet.')
  }

  const handleUpdateAppointmentCell = (id: number, key: keyof Appointment, value: any) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [key]: value } : a))
    )
    showToast('Appointment cell updated.')
  }

  const handleMarkAppointmentRetained = (appt: Appointment) => {
    setNewMatterInitialClientId(appt.client)
    setIsNewMatterOpen(true)
  }

  // Handlers for Tasks
  const handleSaveOfficeTask = (task: OfficeTask) => {
    setOfficeTasks((prev) => {
      const exists = prev.some((t) => t.id === task.id)
      if (exists) {
        return prev.map((t) => (t.id === task.id ? task : t))
      }
      return [task, ...prev]
    })
    showToast(`Task assigned to ${task.assignedTo}.`)
  }

  const handleCompleteOfficeTask = (taskId: string, result: string, completedBy: string) => {
    setOfficeTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'Completed',
              result,
              completedAt: `${TODAY} by ${completedBy}`,
              history: [`Completed by ${completedBy}: ${result}`, ...t.history]
            }
          : t
      )
    )
    showToast('Task marked completed.')
  }

  const handleReassignTask = (taskId: string, newAssignee: string) => {
    setOfficeTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignedTo: newAssignee,
              history: [`Reassigned to ${newAssignee} on ${TODAY}`, ...t.history]
            }
          : t
      )
    )
    showToast(`Task reassigned to ${newAssignee}.`)
  }

  const handleChangeTaskStatus = (
    taskId: string,
    newStatus: 'Pending' | 'In Progress' | 'Completed'
  ) => {
    setOfficeTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              history: [`Status changed to ${newStatus}`, ...t.history]
            }
          : t
      )
    )
    showToast(`Task status changed to ${newStatus}.`)
  }

  // Handlers for PFL & Deadlines
  const handleSavePfl = (pfl: PFLRecord, docsList: string[]) => {
    setPflRecords((prev) => [pfl, ...prev])

    // Update related matter if found
    const targetMatter = matters.find((m) => m.name === pfl.clientName)
    if (targetMatter) {
      const newDocs = docsList.map((name) => ({
        name,
        status: 'Requested' as const,
        version: 0,
        history: []
      }))
      const newDeadlineItem: DeadlineItem = {
        kind: 'Hard Deadline',
        label: `${pfl.category}: ${pfl.actionRequired}`,
        date: pfl.deadline,
        time: '16:00',
        zone: 'America/Vancouver',
        source: pfl.fileNumber,
        status: 'Open'
      }

      handleUpdateMatter({
        ...targetMatter,
        hard: pfl.deadline,
        stage: 2,
        ball: 'Case Manager',
        next: `Respond to ${pfl.category}`,
        docs: [...targetMatter.docs, ...newDocs],
        deadlineItems: [...targetMatter.deadlineItems, newDeadlineItem],
        tasks: [
          { name: `Prepare response to ${pfl.category}`, done: false, owner: pfl.owner, due: pfl.deadline },
          ...targetMatter.tasks
        ],
        events: [`Government request recorded: ${pfl.category} due ${pfl.deadline}`, ...targetMatter.events]
      })
    }

    showToast('Government request and response workflow created.')
  }

  const handleSaveDeadline = (matterId: string, deadline: DeadlineItem) => {
    const target = matters.find((m) => m.id === matterId)
    if (target) {
      handleUpdateMatter({
        ...target,
        hard: deadline.kind === 'Hard Deadline' ? deadline.date : target.hard,
        deadlineItems: [...(target.deadlineItems || []), deadline],
        events: [`${deadline.kind} added: ${deadline.label}`, ...target.events]
      })
    }
    showToast('Deadline saved.')
  }

  const handleResolveDeadline = (matterId: string, index: number) => {
    const target = matters.find((m) => m.id === matterId)
    if (target) {
      const updatedDeadlines = [...(target.deadlineItems || [])]
      updatedDeadlines[index] = { ...updatedDeadlines[index], status: 'Resolved' }
      const remainingHard = updatedDeadlines
        .filter((d) => d.kind === 'Hard Deadline' && d.status !== 'Resolved')
        .map((d) => d.date)
        .sort()[0] || ''

      handleUpdateMatter({
        ...target,
        hard: remainingHard,
        deadlineItems: updatedDeadlines,
        events: [`Deadline resolved: ${updatedDeadlines[index].label}`, ...target.events]
      })
    }
    showToast('Deadline resolved.')
  }

  // Handlers for Contact & Submission
  const handleSaveContactLog = (contact: ContactLogEntry) => {
    handleUpdateMatter({
      ...currentMatter,
      contactsLog: [contact, ...(currentMatter.contactsLog || [])],
      events: [`Contact recorded with ${contact.person} (${contact.method})`, ...currentMatter.events]
    })
    showToast('Contact log saved.')
  }

  const handleSaveSubmission = (record: SubmissionRecord) => {
    handleUpdateMatter({
      ...currentMatter,
      stage: 5,
      ball: 'Government',
      next: 'Check for GCMS correspondence and file updates',
      due: '2026-11-07',
      ready: false,
      submission: record,
      events: [`Application submitted to ${record.portal} (Ref: ${record.ref})`, ...currentMatter.events]
    })
    showToast('Submission recorded. Matter moved to Government Processing.')
  }

  // Quick Action Dispatcher
  const handleQuickAction = (actionId: string) => {
    if (actionId === 'newClient') {
      setIsNewClientOpen(true)
    } else if (actionId === 'assignTask') {
      setSelectedTaskForEdit(null)
      setIsOfficeTaskOpen(true)
    } else if (actionId === 'bookAppointment') {
      setSelectedAppointmentForEdit(null)
      setIsAppointmentModalOpen(true)
    } else if (actionId === 'retainedFile') {
      setNewMatterInitialClientId(undefined)
      setIsNewMatterOpen(true)
    } else if (actionId === 'addDeadline') {
      setDeadlineMatterId(undefined)
      setIsDeadlineOpen(true)
    } else if (actionId === 'govtRequest') {
      setIsPflOpen(true)
    }
  }

  const handleReassignFiles = (sourceManager: string, targetManager: string, matterIds: string[]) => {
    setMatters((prev) =>
      prev.map((m) => {
        if (matterIds.includes(m.id)) {
          return {
            ...m,
            owner: targetManager,
            events: [
              `File reassigned from ${sourceManager} to ${targetManager}`,
              ...(m.events || [])
            ]
          }
        }
        return m
      })
    )
    showToast(`Reassigned ${matterIds.length} file(s) to ${targetManager}`)
  }

  const handleAddManager = (name: string) => {
    if (!staffList.includes(name)) {
      setStaffList((prev) => [...prev, name])
      showToast(`Added case manager: ${name}`)
    }
  }

  return (
    <div className="h-screen max-h-screen w-full bg-[#f7f9f8] flex text-[#1c2826] relative overflow-hidden">
      {/* Navigation Sidebar (Responsive drawer on mobile/tablet, fixed column on desktop) */}
      <NationriseSidebar
        currentView={currentView}
        onViewChange={(v) => setCurrentView(v)}
        taskCount={activeTaskCount}
        deadlineCount={deadlineCount}
        retainedCount={retainedCount}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area with independent scroll container */}
      <div className="flex-1 flex flex-col h-screen max-h-screen min-w-0 overflow-hidden">
        <NationriseTopBar
          currentView={currentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        <DemoBanner currentView={currentView} onResetDemo={handleResetDemo} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 w-full mx-auto transition-all page-scroll">
          {/* VIEW ROUTING */}
          {currentView === 'Dashboard' && (
            <DashboardView
              matters={matters}
              appointments={appointments}
              officeTasks={officeTasks}
              pflRecords={pflRecords}
              staffList={STAFF_MEMBERS}
              onOpenMatter={handleOpenMatter}
              onNavigate={(v) => {
                setCurrentView(v)
              }}
              onNewMatter={() => {
                setNewMatterInitialClientId(undefined)
                setIsNewMatterOpen(true)
              }}
              onNewPfl={() => setIsPflOpen(true)}
            />
          )}

          {currentView === 'Task Manager' && (
            <TaskManagerView
              tasks={officeTasks}
              clients={clients}
              staffList={STAFF_MEMBERS}
              onAssignTask={() => {
                setSelectedTaskForEdit(null)
                setIsOfficeTaskOpen(true)
              }}
              onCompleteTask={(task) => {
                setTaskToComplete(task)
                setIsCompleteTaskOpen(true)
              }}
              onReassignTask={handleReassignTask}
              onChangeStatus={handleChangeTaskStatus}
              onOpenClient={(cid) => {
                const c = clients.find((x) => x.id === cid)
                if (c) {
                  setSelectedClientForProfile(c)
                  setIsClientProfileOpen(true)
                }
              }}
            />
          )}

          {currentView === 'Appointments' && (
            <AppointmentsView
              appointments={appointments}
              clients={clients}
              onBookAppointment={(date, time) => {
                setSelectedAppointmentForEdit(null)
                setApptDefaultDate(date)
                setApptDefaultTime(time)
                setIsAppointmentModalOpen(true)
              }}
              onEditAppointment={(appt) => {
                setSelectedAppointmentForEdit(appt)
                setIsAppointmentModalOpen(true)
              }}
              onUpdateCell={handleUpdateAppointmentCell}
              onMarkRetained={handleMarkAppointmentRetained}
              onOpenMatter={handleOpenMatter}
              onNewClient={(prefillPhone) => {
                setNewClientPhonePrefill(prefillPhone || '')
                setIsNewClientOpen(true)
              }}
            />
          )}

          {currentView === 'Clients' && (
            <ClientsView
              clients={clients}
              matters={matters}
              onNewClient={() => {
                setNewClientPhonePrefill('')
                setIsNewClientOpen(true)
              }}
              onOpenClientProfile={(c) => {
                setSelectedClientForProfile(c)
                setIsClientProfileOpen(true)
              }}
              onOpenMatter={handleOpenMatter}
            />
          )}

          {currentView === 'To-Do List' && (
            <TodoListMattersView
              matters={matters}
              clients={clients}
              staffList={STAFF_MEMBERS}
              onOpenMatter={handleOpenMatter}
              onNewMatter={() => {
                setNewMatterInitialClientId(undefined)
                setIsNewMatterOpen(true)
              }}
              onUpdateSubmissionDeadline={handleUpdateSubmissionDeadline}
              onChangeStage={handleChangeStage}
            />
          )}

          {currentView === 'Matter' && (
            <MatterDetailView
              matter={currentMatter}
              client={currentMatterClient}
              onBack={() => setCurrentView('To-Do List')}
              onUpdateMatter={handleUpdateMatter}
              onEditAssignment={() => setIsEditAssignmentOpen(true)}
              onRecordSubmission={() => setIsRecordSubmissionOpen(true)}
              onRecordContact={() => setIsRecordContactOpen(true)}
              onAddDeadline={() => {
                setDeadlineMatterId(currentMatter.id)
                setIsDeadlineOpen(true)
              }}
              onAddGovtRequest={() => setIsPflOpen(true)}
              onPreviewClientPortal={(mid) => {
                setSelectedMatterId(mid)
                setCurrentView('Client Portal')
              }}
            />
          )}

          {currentView === 'Deadline Centre' && (
            <DeadlineCentreView
              matters={matters}
              onOpenMatter={handleOpenMatter}
              onAddDeadline={() => {
                setDeadlineMatterId(undefined)
                setIsDeadlineOpen(true)
              }}
              onAddGovtRequest={() => setIsPflOpen(true)}
              onResolveDeadline={handleResolveDeadline}
            />
          )}

          {currentView === 'Client Portal' && (
            <ClientPortalPreview
              matters={matters}
              selectedMatterId={selectedMatterId}
              onSelectMatter={setSelectedMatterId}
              onSimulateUpload={(mid, docIdx) => {
                const target = matters.find((m) => m.id === mid)
                if (target) {
                  const updatedDocs = [...target.docs]
                  const doc = updatedDocs[docIdx]
                  const nextV = doc.version + 1
                  updatedDocs[docIdx] = {
                    ...doc,
                    version: nextV,
                    status: 'Uploaded — Review Required',
                    history: [`v${nextV} — Uploaded via client portal preview`, ...doc.history]
                  }
                  handleUpdateMatter({
                    ...target,
                    docs: updatedDocs,
                    events: [`Client uploaded sample for ${doc.name} (v${nextV})`, ...target.events]
                  })
                }
              }}
              onSendMessage={(mid, text) => {
                const target = matters.find((m) => m.id === mid)
                if (target) {
                  handleUpdateMatter({
                    ...target,
                    messages: [...(target.messages || []), { from: 'Client', text }]
                  })
                }
                showToast('Message sent to legal team.')
              }}
              onSaveQuestionnaire={(mid, q) => {
                const target = matters.find((m) => m.id === mid)
                if (target) {
                  handleUpdateMatter({
                    ...target,
                    questionnaire: q,
                    events: ['Client updated questionnaire answers', ...target.events]
                  })
                }
                showToast('Questionnaire saved.')
              }}
            />
          )}

          {currentView === 'Case Managers' && (
            <CaseManagersView
              staffList={staffList}
              matters={matters}
              onReassignFiles={handleReassignFiles}
              onAddManager={handleAddManager}
              onOpenMatter={handleOpenMatter}
            />
          )}

          {currentView === 'Retainers and Invoices' && (
            <RetainersInvoicesView
              matters={matters}
              clients={clients}
              staffList={staffList}
              onUpdateMatter={handleUpdateMatter}
              onOpenMatter={handleOpenMatter}
              onOpenClient={(cid) => {
                const c = clients.find((x) => x.id === cid)
                if (c) {
                  setSelectedClientForProfile(c)
                  setIsClientProfileOpen(true)
                }
              }}
            />
          )}

          {currentView === 'Settings' && <SettingsView />}
        </main>
      </div>

      {/* MODALS */}
      <NewClientModal
        isOpen={isNewClientOpen}
        onClose={() => setIsNewClientOpen(false)}
        onSave={handleCreateClient}
        existingClients={clients}
        initialPhone={newClientPhonePrefill}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSave={handleSaveAppointment}
        existingAppointment={selectedAppointmentForEdit}
        clients={clients}
        allAppointments={appointments}
        defaultDate={apptDefaultDate}
        defaultTime={apptDefaultTime}
      />

      <NewMatterModal
        isOpen={isNewMatterOpen}
        onClose={() => setIsNewMatterOpen(false)}
        onSave={handleCreateMatter}
        clients={clients}
        matters={matters}
        initialClientId={newMatterInitialClientId}
      />

      <OfficeTaskModal
        isOpen={isOfficeTaskOpen}
        onClose={() => setIsOfficeTaskOpen(false)}
        onSave={handleSaveOfficeTask}
        clients={clients}
        existingTask={selectedTaskForEdit}
      />

      <CompleteTaskModal
        isOpen={isCompleteTaskOpen}
        onClose={() => setIsCompleteTaskOpen(false)}
        task={taskToComplete}
        onFinish={handleCompleteOfficeTask}
      />

      <PflModal
        isOpen={isPflOpen}
        onClose={() => setIsPflOpen(false)}
        onSave={handleSavePfl}
        matters={matters}
      />

      <DeadlineModal
        isOpen={isDeadlineOpen}
        onClose={() => setIsDeadlineOpen(false)}
        onSave={handleSaveDeadline}
        matters={matters}
        defaultMatterId={deadlineMatterId}
      />

      <RecordContactModal
        isOpen={isRecordContactOpen}
        onClose={() => setIsRecordContactOpen(false)}
        onSave={handleSaveContactLog}
        clientName={currentMatter.name}
        defaultStaff={currentMatter.owner}
      />

      <RecordSubmissionModal
        isOpen={isRecordSubmissionOpen}
        onClose={() => setIsRecordSubmissionOpen(false)}
        onSave={handleSaveSubmission}
        matterName={currentMatter.name}
        defaultOwner={currentMatter.owner}
      />

      <ClientProfileModal
        isOpen={isClientProfileOpen}
        onClose={() => setIsClientProfileOpen(false)}
        client={selectedClientForProfile}
        matters={matters}
        appointments={appointments}
        onSaveClient={handleUpdateClient}
        onOpenMatter={handleOpenMatter}
        onNewMatterForClient={(cid) => {
          setNewMatterInitialClientId(cid)
          setIsNewMatterOpen(true)
        }}
        onBookAppointmentForClient={(cid) => {
          setSelectedAppointmentForEdit(null)
          setNewMatterInitialClientId(cid)
          setIsAppointmentModalOpen(true)
        }}
      />

      <EditAssignmentModal
        isOpen={isEditAssignmentOpen}
        onClose={() => setIsEditAssignmentOpen(false)}
        matter={currentMatter}
        onSave={handleUpdateMatter}
        allMatters={matters}
      />

      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        onClose={() => setIsQuickMenuOpen(false)}
        onAction={handleQuickAction}
      />

      {/* Sonner Toast Notification */}
      <Toaster />
    </div>
  )
}
export default App
