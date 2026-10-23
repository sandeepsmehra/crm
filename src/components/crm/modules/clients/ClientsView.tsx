import React, { useState } from 'react'
import { Client, Matter } from '@/types/crm'

interface ClientsViewProps {
  clients: Client[]
  matters: Matter[]
  onNewClient: () => void
  onOpenClientProfile: (client: Client) => void
  onOpenMatter: (matterId: string) => void
}

export function ClientsView({
  clients,
  matters,
  onNewClient,
  onOpenClientProfile,
  onOpenMatter
}: ClientsViewProps) {
  const [kindFilter, setKindFilter] = useState<'All' | 'Individuals' | 'Employers'>('All')

  const filteredClients = clients.filter((c) => {
    if (kindFilter === 'Individuals' && c.kind === 'Employer') return false
    if (kindFilter === 'Employers' && c.kind !== 'Employer') return false
    return true
  })

  return (
    <div className="space-y-4">
      {/* Header and Eyebrow matching SCR-022 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-bold tracking-[0.12em] uppercase text-[#a75928]">
            ONE PROFILE · MANY MATTERS
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1c2826] mt-1">
            Clients
          </h1>
        </div>

        <button
          onClick={onNewClient}
          className="bg-[#a75928] hover:bg-[#924c1f] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-2xs cursor-pointer"
        >
          + New client
        </button>
      </div>

      {/* Filter Pills matching SCR-022 */}
      <div className="flex items-center gap-2 select-none">
        <button
          onClick={() => setKindFilter('All')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            kindFilter === 'All'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setKindFilter('Individuals')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            kindFilter === 'Individuals'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
          }`}
        >
          Individuals
        </button>
        <button
          onClick={() => setKindFilter('Employers')}
          className={`px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            kindFilter === 'Employers'
              ? 'bg-[#1f2d29] text-white'
              : 'bg-white border border-[#e5e7eb] text-[#374151] hover:bg-[#f9fafb]'
          }`}
        >
          Employers
        </button>
      </div>

      {/* Clients Directory Table matching SCR-022 */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">CLIENT / EMPLOYER</th>
                <th className="py-3 px-4">CONTACT</th>
                <th className="py-3 px-4">CURRENT STATUS</th>
                <th className="py-3 px-4">MATTERS</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredClients.map((c) => {
                const clientMatters = matters.filter((m) => m.clientId === c.id)

                return (
                  <tr key={c.id} className="hover:bg-[#fbfcfb]">
                    {/* Client / Employer */}
                    <td className="py-4 px-4 align-top">
                      <div className="font-bold text-[#1c2826]">{c.name}</div>
                      <div className="text-xs text-[#6b7280] mt-0.5">
                        {c.id} · {c.kind}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-4 align-top">
                      <div className="text-[#1c2826]">{c.phone}</div>
                      <div className="text-xs text-[#6b7280] mt-0.5">{c.email}</div>
                    </td>

                    {/* Current Status */}
                    <td className="py-4 px-4 align-top">
                      <div className="text-[#1c2826]">{c.status || 'Visitor'}</div>
                      <div className="text-xs text-[#6b7280] mt-0.5">
                        {c.expiry ? `Expires ${c.expiry}` : 'Expires Dec 17'}
                      </div>
                    </td>

                    {/* Matters */}
                    <td className="py-4 px-4 align-top">
                      {clientMatters.length > 0 ? (
                        <div className="space-y-1.5">
                          {clientMatters.map((m) => (
                            <div key={m.id}>
                              <button
                                onClick={() => onOpenMatter(m.id)}
                                className="font-medium text-[#1c2826] hover:underline cursor-pointer block text-left"
                              >
                                {m.type}
                              </button>
                              <div className="text-xs text-[#6b7280]">{m.id}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-[#1c2826]">{c.type || 'Work Permit'}</div>
                          <div className="text-xs text-[#6b7280]">NR-demo-01</div>
                        </div>
                      )}
                    </td>

                    {/* Action buttons matching SCR-022 */}
                    <td className="py-4 px-4 align-top space-y-1.5">
                      <button
                        onClick={() => onOpenClientProfile(c)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs block"
                      >
                        Potential
                      </button>
                      <button
                        onClick={() => onOpenClientProfile(c)}
                        className="bg-white border border-[#d1d5db] px-3 py-1 rounded-md text-xs font-medium text-[#374151] hover:bg-[#f9fafb] cursor-pointer shadow-2xs block whitespace-nowrap"
                      >
                        Profile & consultation
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
