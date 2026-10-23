import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Appointments Tabs
import {
  ConsultationsTab,
  StaffAppointmentsTab,
  PotentialClientsTab
} from '@/components/crm/modules/appointments/tabs'

// Dashboard Tabs
import {
  UpdatesTab,
  FileSubmissionDeadlinesTab,
  LmiaDeadlinesTab
} from '@/components/crm/modules/dashboard/tabs'

// Task Manager Tabs
import {
  ClientCallsTab,
  StaffTasksTab,
  RemindersTab
} from '@/components/crm/modules/task-manager/tabs'

// Matter Tabs
import {
  ApplicationDetailsTab,
  ClientInformationTab
} from '@/components/crm/modules/matter/tabs'

// Settings Tabs
import {
  AccessTab,
  DeveloperGuideTab
} from '@/components/crm/modules/settings/tabs'

describe('Modular Tab Components', () => {
  describe('Appointments Tabs', () => {
    it('ConsultationsTab renders table headers and handles appointment click', () => {
      const handleEdit = vi.fn()
      const handleCell = vi.fn()
      const mockAppointments = [
        {
          id: 1,
          time: '10:00 AM',
          client: 'Lucas Martin',
          phone: '604-555-1234',
          consultant: 'Sukhman',
          service: 'Study Permit',
          status: 'Booked' as const,
          type: 'Individual' as const
        }
      ]

      render(
        <ConsultationsTab
          appointments={mockAppointments as any}
          onEditAppointment={handleEdit}
          onUpdateCell={handleCell}
        />
      )

      expect(screen.getByText('Lucas Martin')).toBeInTheDocument()
      expect(screen.getByText('10:00 AM')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Lucas Martin'))
      expect(handleEdit).toHaveBeenCalledWith(mockAppointments[0])
    })

    it('StaffAppointmentsTab renders table headers and empty message', () => {
      render(<StaffAppointmentsTab />)
      expect(screen.getByText(/No staff appointments scheduled for this date/i)).toBeInTheDocument()
      expect(screen.getByText('MEETING WITH')).toBeInTheDocument()
    })

    it('PotentialClientsTab renders potential client table and action trigger', () => {
      const handleAction = vi.fn()
      render(<PotentialClientsTab onOpenPotentialAction={handleAction} />)

      expect(screen.getByText('Chloe Tremblay')).toBeInTheDocument()
      const actionButtons = screen.getAllByRole('button', { name: /Action ▾/i })
      fireEvent.click(actionButtons[0])
      expect(handleAction).toHaveBeenCalledWith('Chloe Tremblay')
    })
  })

  describe('Dashboard Tabs', () => {
    it('UpdatesTab filters client updates and triggers create', () => {
      const handleCreate = vi.fn()
      const handleFilterChange = vi.fn()
      const handleOpenUpdate = vi.fn()

      const updates = [
        {
          id: 'u-1',
          date: '2026-10-22',
          clientName: 'Amandeep Singh',
          applicationType: 'Spousal Sponsorship',
          updateType: 'Documents Requested' as const,
          checkedBy: 'Amanpreet',
          comments: 'Passed medical examination',
          status: 'Not Sent' as const
        }
      ]

      render(
        <UpdatesTab
          clientUpdates={updates}
          updatesFilter="Updates"
          onFilterChange={handleFilterChange}
          onCreateUpdate={handleCreate}
          onOpenUpdate={handleOpenUpdate}
        />
      )

      expect(screen.getByText('Client Updates')).toBeInTheDocument()
      expect(screen.getByText('Amandeep Singh')).toBeInTheDocument()

      const createBtn = screen.getByRole('button', { name: /\+ Create an Update/i })
      fireEvent.click(createBtn)
      expect(handleCreate).toHaveBeenCalledTimes(1)

      const openUpdateBtn = screen.getByText('Open update')
      fireEvent.click(openUpdateBtn)
      expect(handleOpenUpdate).toHaveBeenCalledWith(updates[0])
    })

    it('FileSubmissionDeadlinesTab triggers navigation to Todo List', () => {
      const handleNavigate = vi.fn()
      render(<FileSubmissionDeadlinesTab onNavigate={handleNavigate} />)

      expect(screen.getByText('File submission deadlines')).toBeInTheDocument()
      const navLink = screen.getByText(/Open To-Do List · View all deadlines/i)
      fireEvent.click(navLink)
      expect(handleNavigate).toHaveBeenCalledWith('To-Do List')
    })

    it('LmiaDeadlinesTab renders description and headers', () => {
      render(<LmiaDeadlinesTab />)
      expect(screen.getByText(/LMIA advertisement & submission reminders/i)).toBeInTheDocument()
      expect(screen.getByText(/Overdue/i)).toBeInTheDocument()
    })
  })

  describe('Task Manager Tabs', () => {
    it('ClientCallsTab renders task list and switches active/completed subtabs', () => {
      const handleSubTab = vi.fn()
      const handleComplete = vi.fn()
      const handleChangeStatus = vi.fn()
      const handleManager = vi.fn()

      render(
        <ClientCallsTab
          subTab="Active Tasks"
          onSubTabChange={handleSubTab}
          selectedManager="All"
          onManagerChange={handleManager}
          tasks={[]}
          onCompleteTask={handleComplete}
          onChangeStatus={handleChangeStatus}
        />
      )

      expect(screen.getByText('Mei Lin Chen')).toBeInTheDocument()
      const completedSubTabBtn = screen.getByText(/Completed Tasks/i)
      fireEvent.click(completedSubTabBtn)
      expect(handleSubTab).toHaveBeenCalledWith('Completed Tasks')
    })

    it('StaffTasksTab renders staff assignments', () => {
      render(
        <StaffTasksTab
          subTab="Active Tasks"
          onSubTabChange={vi.fn()}
          selectedManager="All"
          onManagerChange={vi.fn()}
          tasks={[]}
          onCompleteTask={vi.fn()}
          onChangeStatus={vi.fn()}
        />
      )

      expect(screen.getByText('Review LMIA submission proof documents')).toBeInTheDocument()
    })

    it('RemindersTab renders calls waiting badge', () => {
      render(
        <RemindersTab
          selectedManager="All"
          onManagerChange={vi.fn()}
          tasks={[]}
          onCompleteTask={vi.fn()}
          onChangeStatus={vi.fn()}
        />
      )

      expect(screen.getByText(/Calls waiting 3\+ days/i)).toBeInTheDocument()
    })
  })

  describe('Matter Detail Tabs', () => {
    it('ApplicationDetailsTab updates fields on change', () => {
      const handleAppType = vi.fn()
      const handleOverview = vi.fn()

      render(
        <ApplicationDetailsTab
          appType="Spousal Sponsorship"
          onAppTypeChange={handleAppType}
          customAppType=""
          onCustomAppTypeChange={vi.fn()}
          caseManager="Amanpreet"
          onCaseManagerChange={vi.fn()}
          caseOverview="Initial consultation finished"
          onCaseOverviewChange={handleOverview}
          extraNotes=""
          onExtraNotesChange={vi.fn()}
          hasDependants="No"
          onHasDependantsChange={vi.fn()}
          itaDate=""
          onItaDateChange={vi.fn()}
          deadlineSubmit="2026-11-30"
          onDeadlineSubmitChange={vi.fn()}
          prNotes=""
          onPrNotesChange={vi.fn()}
        />
      )

      expect(screen.getByText('Application Details')).toBeInTheDocument()
      const textarea = screen.getByDisplayValue('Initial consultation finished')
      fireEvent.change(textarea, { target: { value: 'Updated overview' } })
      expect(handleOverview).toHaveBeenCalledWith('Updated overview')
    })

    it('ClientInformationTab displays client demographics', () => {
      render(
        <ClientInformationTab
          clientName="Mei Lin Chen"
          onClientNameChange={vi.fn()}
          clientPhone="604-555-0202"
          onClientPhoneChange={vi.fn()}
          clientEmail="mei@example.com"
          onClientEmailChange={vi.fn()}
          clientDob="1985-05-12"
          onClientDobChange={vi.fn()}
          clientAddress="Surrey, BC"
          onClientAddressChange={vi.fn()}
          clientUci="DEMO-20001"
          onClientUciChange={vi.fn()}
          immigrationStatus="Worker"
          onImmigrationStatusChange={vi.fn()}
          statusExpiry="2027-01-01"
          onStatusExpiryChange={vi.fn()}
          emergencyName=""
          onEmergencyNameChange={vi.fn()}
          emergencyRelation=""
          onEmergencyRelationChange={vi.fn()}
        />
      )

      expect(screen.getByDisplayValue('Mei Lin Chen')).toBeInTheDocument()
      expect(screen.getByDisplayValue('604-555-0202')).toBeInTheDocument()
    })
  })

  describe('Settings Tabs', () => {
    it('AccessTab renders staff email input and user list', () => {
      const handleAddStaff = vi.fn((e) => e.preventDefault())
      render(
        <AccessTab
          staffEmail="advisor@nationrise.ca"
          onStaffEmailChange={vi.fn()}
          staffRole="case_manager"
          onStaffRoleChange={vi.fn()}
          usersList={[
            { email: 'admin@nationrise.ca', role: 'owner', status: 'Enabled', signedIn: true }
          ]}
          onAddStaff={handleAddStaff}
        />
      )

      expect(screen.getByDisplayValue('advisor@nationrise.ca')).toBeInTheDocument()
      expect(screen.getByText('admin@nationrise.ca')).toBeInTheDocument()
      const submitBtn = screen.getByRole('button', { name: /Add \/ update staff access/i })
      fireEvent.click(submitBtn)
      expect(handleAddStaff).toHaveBeenCalledTimes(1)
    })

    it('DeveloperGuideTab renders decision findings table', () => {
      render(<DeveloperGuideTab />)
      expect(screen.getByText('Developer guide')).toBeInTheDocument()
      expect(screen.getByText(/Review of the original Nationrise CRM/i)).toBeInTheDocument()
    })
  })
})
