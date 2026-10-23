import React, { useState } from 'react'
import { Matter, Client } from '@/types/crm'
import { toast } from '@/components/ui/sonner'
import { CustomSelect } from '@/components/ui/custom/custom-select'

interface RetainersInvoicesViewProps {
  matters: Matter[]
  clients: Client[]
  staffList: string[]
  onUpdateMatter: (updated: Matter) => void
  onOpenMatter: (matterId: string) => void
  onOpenClient: (clientId: string) => void
}

export function RetainersInvoicesView({
  matters,
  onOpenMatter
}: RetainersInvoicesViewProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'signed'>('pending')

  const pendingData = [
    {
      id: 'DEMO-MAT-005',
      client: 'Maple Ridge Farms Ltd.',
      application: 'LMIA',
      dateRetained: 'Oct 8',
      assignedTo: 'Amanpreet',
      retainer: 'Signed',
      invoice: 'Prepared'
    },
    {
      id: 'DEMO-MAT-004',
      client: 'Fraser Valley Construction Inc.',
      application: 'LMIA',
      dateRetained: 'Oct 8',
      assignedTo: 'Amanpreet',
      retainer: 'Sent',
      invoice: 'Prepared'
    },
    {
      id: 'DEMO-MAT-001',
      client: 'Aarav Sharma',
      application: 'Work Permit',
      dateRetained: 'Oct 8',
      assignedTo: 'Sukhman',
      retainer: 'Prepared',
      invoice: 'Not prepared'
    },
    {
      id: 'DEMO-MAT-003',
      client: 'Sofia Rodriguez',
      application: 'TRV',
      dateRetained: 'Oct 8',
      assignedTo: 'Inderpreet',
      retainer: 'Sent',
      invoice: 'Prepared'
    },
    {
      id: 'DEMO-MAT-002',
      client: 'Fatima Haddad',
      application: 'BCPNP',
      dateRetained: 'Oct 8',
      assignedTo: 'Inderpreet',
      retainer: 'Prepared',
      invoice: 'Not prepared'
    }
  ]

  const signedData = [
    {
      id: 'DEMO-MAT-006',
      client: 'Maple Ridge Farms Ltd.',
      application: 'LMIA',
      dateRetained: 'Oct 8',
      assignedTo: 'Amanpreet',
      retainer: 'Signed',
      invoice: 'Paid'
    },
    {
      id: 'DEMO-MAT-007',
      client: 'Fraser Valley Construction Inc.',
      application: 'LMIA',
      dateRetained: 'Oct 8',
      assignedTo: 'Amanpreet',
      retainer: 'Signed',
      invoice: 'Paid'
    }
  ]

  const handleOpenDoc = (matterId: string) => {
    toast('Save the current changes before opening documents.')
    onOpenMatter(matterId)
  }

  return (
    <div className="space-y-4">
      {/* Eyebrow and Header matching SCR-048 */}
      <div>
        <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
          RETAINED FILES ADDED AUTOMATICALLY AFTER INTAKE IS MOVED TO THE TO-DO LIST
        </div>
        <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
          Retainers and Invoices
        </h1>
      </div>

      {/* Tabs matching SCR-048 */}
      <div className="flex items-center gap-1 border-b border-[#e5e7eb] pb-0 text-sm select-none pt-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          Retainers & Invoices (12)
        </button>

        <button
          onClick={() => setActiveTab('signed')}
          className={`px-4 py-2.5 text-[13.5px] font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'signed'
              ? 'bg-[#dcf0e7] text-[#0d4734] border-b-2 border-b-[#126b48] font-semibold'
              : 'text-[#4b5563] hover:text-[#1c2826]'
          }`}
        >
          Signed Retainers (10)
        </button>
      </div>

      {/* Main Table matching SCR-048 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">CLIENT</th>
                <th className="py-3 px-4">APPLICATION</th>
                <th className="py-3 px-4">DATE RETAINED</th>
                <th className="py-3 px-4">ASSIGNED TO</th>
                <th className="py-3 px-4">RETAINER</th>
                <th className="py-3 px-4">INVOICE</th>
                <th className="py-3 px-4">FILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(activeTab === 'pending' ? pendingData : signedData).map((row) => (
                <tr key={row.id} className="hover:bg-[#fbfcfb]">
                  <td className="py-4 px-4 font-bold text-[#1c2826]">{row.client}</td>
                  <td className="py-4 px-4 text-[#1c2826]">{row.application}</td>
                  <td className="py-4 px-4 text-[#1c2826]">{row.dateRetained}</td>
                  <td className="py-4 px-4 text-[#1c2826]">{row.assignedTo}</td>
                  <td className="py-4 px-4">
                    <div className="w-36">
                      <CustomSelect
                        value={row.retainer}
                        options={["Not prepared", "Prepared", "Sent", "Signed"]}
                        onChange={(val) => {
                          toast.success(`Updated retainer status to ${val}`)
                        }}
                        triggerClassName="bg-[#ebf3fc] border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1 text-xs font-medium h-7"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-36">
                      <CustomSelect
                        value={row.invoice}
                        options={["Not prepared", "Prepared", "Sent", "Paid"]}
                        onChange={(val) => {
                          toast.success(`Updated invoice status to ${val}`)
                        }}
                        triggerClassName="bg-[#ebf3fc] border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1 text-xs font-medium h-7"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleOpenDoc(row.id)}
                      className="bg-white border border-[#d1d5db] px-3 py-1.5 rounded-lg text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs whitespace-nowrap block"
                    >
                      Open Application
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
