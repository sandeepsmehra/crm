import React, { useState } from 'react'
import { Appointment, Client } from '@/types/crm'
import { PotentialActionModal } from './PotentialActionModal'
import { ConsultationsTab, StaffAppointmentsTab, PotentialClientsTab } from './tabs'
import { toast } from '@/components/ui/sonner'

interface AppointmentsViewProps {
  appointments: Appointment[]
  clients: Client[]
  onBookAppointment: (date?: string, time?: string) => void
  onEditAppointment: (appointment: Appointment) => void
  onUpdateCell: (id: number, key: keyof Appointment, value: any) => void
  onMarkRetained: (appointment: Appointment) => void
  onOpenMatter: (matterId: string) => void
  onNewClient: (initialPhone?: string) => void
}

export function AppointmentsView({
  appointments,
  onBookAppointment,
  onEditAppointment,
  onUpdateCell,
  onOpenMatter
}: AppointmentsViewProps) {
  const [activeTab, setActiveTab] = useState<'Consultations' | 'Staff Appointments' | 'Potential Clients'>('Consultations')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('2026-10-22')

  // Potential Client Action Modal State
  const [isPotentialModalOpen, setIsPotentialModalOpen] = useState(false)
  const [selectedPotentialClientName, setSelectedPotentialClientName] = useState('Chloe Tremblay')

  const handleOpenPotentialAction = (clientName: string) => {
    setSelectedPotentialClientName(clientName)
    setIsPotentialModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Page Header matching SCR-016 */}
      <div className="flex items-start justify-between">
        <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826]">
          Appointments
        </h1>

        <button
          onClick={() => onBookAppointment(selectedDate, '13:00')}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + Book Appointment
        </button>
      </div>

      {/* Subtabs matching SCR-016 */}
      <div className="flex items-center gap-2 select-none">
        <button
          onClick={() => setActiveTab('Consultations')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'Consultations'
              ? 'bg-[#134937] text-white'
              : 'bg-[#f0f2f1] text-[#556860] hover:bg-[#e4e7e5]'
          }`}
        >
          <span>Consultations</span>
          <span className="ml-1 text-[11px]">1</span>
        </button>

        <button
          onClick={() => setActiveTab('Staff Appointments')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'Staff Appointments'
              ? 'bg-[#4c2882] text-white'
              : 'bg-[#f3ebfc] text-[#4c2882] hover:bg-[#ebe0f8]'
          }`}
        >
          <span>Staff Appointments</span>
          <span className="ml-1 text-[11px]">0</span>
        </button>

        <button
          onClick={() => setActiveTab('Potential Clients')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'Potential Clients'
              ? 'bg-[#8a5327] text-white'
              : 'bg-[#fef3e2] border border-[#fed7aa] text-[#8a5327] hover:bg-[#fde8cb]'
          }`}
        >
          <span>Potential Clients</span>
          <span className="ml-1 text-[11px]">2</span>
        </button>
      </div>

      {/* Controls Bar: Navigation and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 select-none">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toast.info('Navigated to previous day')}
            className="bg-white border border-[#d1d5db] px-2.5 py-1 rounded text-xs text-[#4b5563] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
          >
            &lt;
          </button>
          <button
            onClick={() => {
              setSelectedDate('2026-10-22')
              toast.info('Viewing Today: Thursday, October 22, 2026')
            }}
            className="bg-white border border-[#d1d5db] px-3 py-1 rounded text-xs text-[#1a56db] font-medium hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
          >
            Today
          </button>
          <button
            onClick={() => {
              setSelectedDate('2026-10-23')
              toast.info('Viewing Tomorrow: Friday, October 23, 2026')
            }}
            className="bg-white border border-[#d1d5db] px-3 py-1 rounded text-xs text-[#1a56db] font-medium hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
          >
            Tomorrow
          </button>
          <button
            onClick={() => toast.info('Navigated to next day')}
            className="bg-white border border-[#d1d5db] px-2.5 py-1 rounded text-xs text-[#4b5563] hover:bg-[#f9fafb] cursor-pointer shadow-2xs"
          >
            &gt;
          </button>

          <div className="bg-[#fff8ee] border border-[#fed7aa] text-[#8a5327] px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <span>📅</span>
            <span>Thursday, October 22, 2026 ▾</span>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search client name or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-[#d1d5db] rounded-md px-3 py-1.5 text-xs text-[#1c2826] placeholder-[#9ca3af] outline-none w-56 sm:w-64 focus:border-[#126b48] shadow-2xs"
          />
        </div>
      </div>

      {/* Meta Text */}
      <div className="text-xs text-[#6b7280]">
        {activeTab === 'Potential Clients'
          ? '2 active · Hidden after 15 days without a recorded action'
          : '1 shown · 1 total entries'}
      </div>

      {/* Content for Consultations (SCR-016) */}
      {activeTab === 'Consultations' && (
        <ConsultationsTab
          appointments={appointments}
          onEditAppointment={onEditAppointment}
          onUpdateCell={onUpdateCell}
        />
      )}

      {/* Content for Staff Appointments (SCR-017) */}
      {activeTab === 'Staff Appointments' && (
        <StaffAppointmentsTab />
      )}

      {/* Content for Potential Clients (SCR-018) */}
      {activeTab === 'Potential Clients' && (
        <PotentialClientsTab
          onOpenPotentialAction={handleOpenPotentialAction}
        />
      )}

      {/* Potential Action Modal (SCR-021) */}
      <PotentialActionModal
        isOpen={isPotentialModalOpen}
        onClose={() => setIsPotentialModalOpen(false)}
        clientName={selectedPotentialClientName}
        onSuccess={() => {
          setIsPotentialModalOpen(false)
        }}
      />
    </div>
  )
}
