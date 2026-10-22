import React, { useState } from 'react'
import { Client, Matter } from '@/types/crm'
import { formatDueDate } from '@/lib/crmUtils'
import { Plus, Search, Building2, User } from 'lucide-react'

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
  const [kindFilter, setKindFilter] = useState<'All' | 'Individual' | 'Employer'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredClients = clients.filter((c) => {
    if (kindFilter !== 'All' && c.kind !== kindFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const hay = [
        c.name,
        c.phone,
        c.email,
        c.uci || '',
        c.status || '',
        c.type,
        c.address || '',
        c.contacts || ''
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Permanent Records · Individual & Employer
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Clients & Consultations
          </h1>
          <p className="text-[14px] text-[#677472] mt-0.5">
            One permanent client profile can hold multiple applications and consultation records.
          </p>
        </div>

        <button
          onClick={onNewClient}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#a7653b] hover:bg-[#8f532d] text-white rounded-md text-[13.5px] font-semibold transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New client</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 border border-[#dfe5e3] rounded-xl shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['All', 'Individual', 'Employer'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKindFilter(k)}
              className={`px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all whitespace-nowrap ${
                kindFilter === k
                  ? 'bg-[#12382e] text-white font-semibold shadow-xs'
                  : 'text-[#677472] hover:bg-[#edf2ef] hover:text-[#202d2d]'
              }`}
            >
              {k === 'All' ? 'All Profiles' : k === 'Individual' ? 'Individuals' : 'Employers'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8a9895] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, email, UCI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#f4f6f5] border border-[#cbd5d1] rounded-md text-[13px] text-[#202d2d] focus:border-[#246b54] outline-none"
          />
        </div>
      </div>

      {/* Client Directory Table */}
      <div className="bg-white border border-[#dfe5e3] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#f9faf9] border-b border-[#edf0ee] text-[11px] font-semibold text-[#677472] uppercase tracking-wider">
                <th className="py-3 px-4">Client / Employer</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status / Expiry</th>
                <th className="py-3 px-4">Matters</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ee]">
              {filteredClients.map((c) => {
                const clientMatters = matters.filter((m) => m.clientId === c.id)

                return (
                  <tr key={c.id} className="hover:bg-[#f8faf9] transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4 align-top">
                      <div className="flex items-center gap-2">
                        {c.kind === 'Employer' ? (
                          <Building2 className="w-4 h-4 text-[#a7653b] shrink-0" />
                        ) : (
                          <User className="w-4 h-4 text-[#246b54] shrink-0" />
                        )}
                        <button
                          onClick={() => onOpenClientProfile(c)}
                          className="font-bold text-[#12382e] hover:text-[#a7653b] hover:underline text-left block"
                        >
                          {c.name}
                        </button>
                      </div>
                      <div className="text-[11.5px] text-[#677472] ml-6">
                        {c.id} · {c.kind} {c.uci && `· UCI: ${c.uci}`}
                      </div>
                      {c.receptionAlert && (
                        <div className="text-[11px] text-[#ae4343] font-semibold mt-0.5 ml-6">
                          Alert: {c.receptionAlert}
                        </div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      <div className="font-semibold text-[#202d2d]">{c.phone}</div>
                      <div className="text-[11.5px] text-[#677472]">{c.email}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 align-top">
                      {c.kind === 'Employer' ? (
                        <div>
                          <span className="badge amber">{c.locations || 'Surrey, BC'}</span>
                          <div className="text-[11px] text-[#677472] mt-0.5">{c.contacts || 'Contact'}</div>
                        </div>
                      ) : (
                        <div>
                          <span className="badge blue">{c.status || 'Client'}</span>
                          {c.expiry && (
                            <div className="text-[11px] text-[#677472] mt-0.5">
                              Expires: {formatDueDate(c.expiry)}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Matters */}
                    <td className="py-3 px-4 align-top">
                      {clientMatters.length > 0 ? (
                        <div className="space-y-1">
                          {clientMatters.map((m) => (
                            <div key={m.id} className="flex items-center gap-1.5 text-[12px]">
                              <button
                                onClick={() => onOpenMatter(m.id)}
                                className="font-semibold text-[#246b54] hover:underline"
                              >
                                {m.type}
                              </button>
                              <span className="text-[11px] text-[#8a9895]">({m.id})</span>
                              <span className="badge green text-[10px]">Stage {m.stage}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[12px] text-[#8ba79b] italic">No active matter</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 align-top text-right">
                      <button
                        onClick={() => onOpenClientProfile(c)}
                        className="px-3 py-1 bg-white hover:bg-[#edf2ef] border border-[#cbd5d1] rounded text-[12.5px] font-semibold text-[#202d2d] transition-colors shadow-2xs whitespace-nowrap"
                      >
                        {c.kind === 'Employer' ? 'Employer profile' : 'Profile & consultation'}
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#677472]">
                    No client profiles match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
