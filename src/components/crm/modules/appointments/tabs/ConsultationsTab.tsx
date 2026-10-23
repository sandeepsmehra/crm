import React from 'react'
import { Appointment } from '@/types/crm'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface ConsultationsTabProps {
  appointments: Appointment[]
  onEditAppointment: (appointment: Appointment) => void
  onUpdateCell: (id: number, key: keyof Appointment, value: any) => void
}

export function ConsultationsTab({
  appointments,
  onEditAppointment,
  onUpdateCell
}: ConsultationsTabProps) {
  return (
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
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="hover:bg-[#fbfcfb] cursor-pointer"
                    onClick={() => onEditAppointment(appt)}
                  >
                    <td className="py-3.5 px-4 font-normal text-[#1c2826]">{appt.time || '1:00 p.m.'}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1c2826]">{appt.client}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{appt.phone}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{appt.consultant}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{appt.service}</td>
                    <td className="py-3.5 px-4 text-[#1c2826]">{appt.notes || '—'}</td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="w-32">
                        <CustomSelect
                          value={appt.status || 'Confirmed'}
                          options={["Confirmed", "Scheduled", "Waiting", "Completed", "Cancelled"]}
                          onChange={(val) => {
                            onUpdateCell(appt.id, 'status', val as any)
                          }}
                          triggerClassName="bg-[#e6f4ea] text-[#137333] border-[#b7e1cd] rounded-md px-2 py-1 text-xs font-medium h-7"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#1a56db] font-medium">Existing Client</td>
                    <td className="py-3.5 px-4 text-[#6b7280]">{appt.source || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-sm text-[#6b7280]">
                    No consultations scheduled for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#6b7280]">
        Vancouver time · Click an appointment to open notes, reschedule or view the client profile. Counts include cancelled appointments and imported entries awaiting confirmation.
      </p>
    </div>
  )
}
