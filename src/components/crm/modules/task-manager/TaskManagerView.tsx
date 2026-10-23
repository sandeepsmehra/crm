import React, { useState } from 'react'
import { OfficeTask, Client } from '@/types/crm'
import { ClientCallsTab, StaffTasksTab, RemindersTab } from './tabs'

interface TaskManagerViewProps {
  tasks: OfficeTask[]
  clients: Client[]
  staffList: string[]
  onAssignTask: () => void
  onCompleteTask: (task: OfficeTask) => void
  onReassignTask: (taskId: string, newAssignee: string) => void
  onChangeStatus: (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void
  onOpenClient?: (clientId: string) => void
}

export function TaskManagerView({
  tasks,
  clients,
  onAssignTask,
  onCompleteTask,
  onChangeStatus
}: TaskManagerViewProps) {
  const [mainTab, setMainTab] = useState<'Client Calls' | 'Staff Tasks' | 'Reminders'>('Client Calls')
  const [subTab, setSubTab] = useState<'Active Tasks' | 'Completed Tasks'>('Active Tasks')
  const [selectedManager, setSelectedManager] = useState<string>('All')

  return (
    <div className="space-y-5">
      {/* Eyebrow & Header matching SCR-011 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
            CALLS, ASSIGNMENTS AND FOLLOW-UPS IN ONE PLACE
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
            Task Manager
          </h1>
        </div>

        <button
          onClick={onAssignTask}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Assign Task
        </button>
      </div>

      {/* Main Tabs matching SCR-011 (Client Calls 5, Staff Tasks 3, Reminders 5) */}
      <div className="flex items-center gap-6 border-b border-[#e5e7eb] pb-2 text-sm select-none">
        <button
          onClick={() => {
            setMainTab('Client Calls')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Client Calls'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Client Calls</span>
          <span className="text-xs text-[#6b7280]">5</span>
        </button>

        <button
          onClick={() => {
            setMainTab('Staff Tasks')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Staff Tasks'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Staff Tasks</span>
          <span className="text-xs text-[#6b7280]">3</span>
        </button>

        <button
          onClick={() => {
            setMainTab('Reminders')
            setSubTab('Active Tasks')
          }}
          className={`pb-1.5 cursor-pointer transition-colors flex items-center gap-1.5 ${
            mainTab === 'Reminders'
              ? 'border-b-2 border-b-[#a75928] font-bold text-[#1c2826]'
              : 'text-[#6b7280] hover:text-[#1c2826]'
          }`}
        >
          <span>Reminders</span>
          <span className="text-xs text-[#6b7280]">5</span>
        </button>
      </div>

      {/* Active Tab Content */}
      {mainTab === 'Client Calls' && (
        <ClientCallsTab
          subTab={subTab}
          onSubTabChange={setSubTab}
          selectedManager={selectedManager}
          onManagerChange={setSelectedManager}
          tasks={tasks}
          onCompleteTask={onCompleteTask}
          onChangeStatus={onChangeStatus}
        />
      )}

      {mainTab === 'Staff Tasks' && (
        <StaffTasksTab
          subTab={subTab}
          onSubTabChange={setSubTab}
          selectedManager={selectedManager}
          onManagerChange={setSelectedManager}
          tasks={tasks}
          onCompleteTask={onCompleteTask}
          onChangeStatus={onChangeStatus}
        />
      )}

      {mainTab === 'Reminders' && (
        <RemindersTab
          selectedManager={selectedManager}
          onManagerChange={setSelectedManager}
          tasks={tasks}
          onCompleteTask={onCompleteTask}
          onChangeStatus={onChangeStatus}
        />
      )}
    </div>
  )
}
