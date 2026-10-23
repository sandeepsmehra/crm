import React, { useState } from 'react'
import { Appointment, Client } from '@/types/crm'
import { PotentialActionModal } from './PotentialActionModal'
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
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                {/* 4 Distinct Color Bands matching SCR-016 */}
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wider">
                    {/* Zone 1: Mint / Teal */}
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">TIME</th>
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CLIENT</th>
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CONTACT</th>
                    {/* Zone 2: Soft Purple */}
                    <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">MEETING WITH</th>
                    <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">COMING FOR</th>
                    {/* Zone 3: Soft Blue */}
                    <th className="py-2.5 px-4 bg-[#edf5fd] text-[#1e4d7b]">NOTES</th>
                    {/* Zone 4: Soft Peach */}
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">STATUS</th>
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">CLIENT TYPE</th>
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">REFERRED BY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  <tr 
                    className="hover:bg-[#fbfcfb] cursor-pointer"
                    onClick={() => {
                      if (appointments[0]) onEditAppointment(appointments[0])
                    }}
                  >
                    <td className="py-3.5 px-4 font-normal text-[#1c2826]">1:00 p.m.</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Gurdeep Sin...</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">604-555-0212</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Tejinder</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Work Permit</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">Discuss Work Permit</td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        defaultValue="Confirmed"
                        onChange={(e) => {
                          if (appointments[0]) {
                            onUpdateCell(appointments[0].id, 'status', e.target.value as any)
                          }
                        }}
                        className="bg-[#e6f4ea] text-[#137333] border border-[#b7e1cd] rounded-md px-2.5 py-1 text-xs font-medium outline-none cursor-pointer"
                      >
                        <option value="Confirmed">Confirmed ▾</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Waiting">Waiting</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-[#1a56db] font-medium">Existing Client</td>
                    <td className="py-3.5 px-4 text-[#6b7280]">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-[#6b7280]">
            Vancouver time · Click an appointment to open notes, reschedule or view the client profile. Counts include cancelled appointments and imported entries awaiting confirmation.
          </p>
        </div>
      )}

      {/* Content for Staff Appointments (SCR-017) */}
      {activeTab === 'Staff Appointments' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">TIME</th>
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CLIENT</th>
                    <th className="py-2.5 px-4 bg-[#e6f4f1] text-[#135a4e]">CONTACT</th>
                    <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">MEETING WITH</th>
                    <th className="py-2.5 px-4 bg-[#f0ebfa] text-[#4b2882]">COMING FOR</th>
                    <th className="py-2.5 px-4 bg-[#edf5fd] text-[#1e4d7b]">NOTES</th>
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">STATUS</th>
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">CLIENT TYPE</th>
                    <th className="py-2.5 px-4 bg-[#fdf0e7] text-[#8a5327]">REFERRED BY</th>
                  </tr>
                </thead>
              </table>
              <div className="py-12 text-center text-sm text-[#6b7280]">
                No staff appointments scheduled for this date.
              </div>
            </div>
          </div>
          <p className="text-xs text-[#6b7280]">
            Vancouver time · Click an appointment to open notes, reschedule or view the client profile.
          </p>
        </div>
      )}

      {/* Content for Potential Clients (SCR-018) */}
      {activeTab === 'Potential Clients' && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#fef3e2] text-[#8a5327] text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-4">CLIENT</th>
                    <th className="py-2.5 px-4">FOLLOW-UP</th>
                    <th className="py-2.5 px-4">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {/* Row 1 matching SCR-018 */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Chloe Tremblay</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#f3f4f6] text-[#374151] rounded px-2.5 py-0.5 text-xs font-medium">
                        Oct 26
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenPotentialAction('Chloe Tremblay')}
                        className="bg-[#fff8ee] border border-[#fed7aa] text-[#8a5327] rounded-md px-3 py-1 text-xs font-medium hover:bg-[#fde8cb] cursor-pointer shadow-2xs"
                      >
                        Action ▾
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 matching SCR-018 */}
                  <tr className="hover:bg-[#fbfcfb]">
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">Harmanpreet Kaur</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#f3f4f6] text-[#374151] rounded px-2.5 py-0.5 text-xs font-medium">
                        Oct 30
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleOpenPotentialAction('Harmanpreet Kaur')}
                        className="bg-[#fff8ee] border border-[#fed7aa] text-[#8a5327] rounded-md px-3 py-1 text-xs font-medium hover:bg-[#fde8cb] cursor-pointer shadow-2xs"
                      >
                        Action ▾
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
