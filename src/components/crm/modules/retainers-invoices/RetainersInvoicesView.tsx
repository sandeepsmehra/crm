import React, { useState, useMemo } from 'react'
import { Matter, Client } from '@/types/crm'
import { 
  FileCheck2, 
  Receipt, 
  Search, 
  Filter, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  DollarSign,
  ShieldCheck
} from 'lucide-react'

interface RetainersInvoicesViewProps {
  matters: Matter[]
  clients: Client[]
  staffList: string[]
  onUpdateMatter: (updated: Matter) => void
  onOpenMatter: (matterId: string) => void
  onOpenClient: (clientId: string) => void
}

type TabType = 'pending' | 'signed'

export function RetainersInvoicesView({
  matters,
  clients,
  staffList,
  onUpdateMatter,
  onOpenMatter,
  onOpenClient
}: RetainersInvoicesViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [managerFilter, setManagerFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewingTermsMatter, setViewingTermsMatter] = useState<Matter | null>(null)

  // Eligible files: Active matters with intake, or any matter not closed (stage < 6)
  const eligibleMatters = useMemo(() => {
    return matters.filter((m) => m.stage < 6 || m.retained)
  }, [matters])

  // Helper to determine if a matter is "signedRetainerComplete" (SCR-049)
  const isSignedComplete = (m: Matter) => {
    const rStatus = m.retainerStatus || (m.retained ? 'Signed' : 'Not prepared')
    const iStatus = m.invoiceStatus || 'Sent'
    return rStatus === 'Signed' && (iStatus === 'Sent' || iStatus === 'Paid')
  }

  // Filtered pending retainers & invoices (SCR-048)
  const pendingList = useMemo(() => {
    return eligibleMatters.filter((m) => {
      if (isSignedComplete(m)) return false
      const rStatus = m.retainerStatus || (m.retained ? 'Prepared' : 'Not prepared')
      if (rStatus === 'Closed') return false

      if (managerFilter !== 'All' && m.owner !== managerFilter) return false
      if (statusFilter !== 'All' && rStatus !== statusFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const clientName = (m.name || '').toLowerCase()
        const matterType = (m.type || '').toLowerCase()
        const matterId = (m.id || '').toLowerCase()
        return clientName.includes(q) || matterType.includes(q) || matterId.includes(q)
      }
      return true
    })
  }, [eligibleMatters, managerFilter, statusFilter, searchQuery])

  // Filtered signed retainers (SCR-049)
  const signedList = useMemo(() => {
    return eligibleMatters.filter((m) => {
      if (!isSignedComplete(m)) return false
      if (managerFilter !== 'All' && m.owner !== managerFilter) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const clientName = (m.name || '').toLowerCase()
        const matterType = (m.type || '').toLowerCase()
        const matterId = (m.id || '').toLowerCase()
        return clientName.includes(q) || matterType.includes(q) || matterId.includes(q)
      }
      return true
    })
  }, [eligibleMatters, managerFilter, searchQuery])

  // Metrics
  const metrics = useMemo(() => {
    const total = eligibleMatters.length
    const signedCount = eligibleMatters.filter(isSignedComplete).length
    const pendingRetainerCount = eligibleMatters.filter((m) => {
      const r = m.retainerStatus || (m.retained ? 'Signed' : 'Not prepared')
      return r === 'Not prepared' || r === 'Prepared' || r === 'Sent'
    }).length
    const pendingInvoiceCount = eligibleMatters.filter((m) => {
      const inv = m.invoiceStatus || 'Not prepared'
      return inv === 'Not prepared' || inv === 'Prepared'
    }).length

    return { total, signedCount, pendingRetainerCount, pendingInvoiceCount }
  }, [eligibleMatters])

  const handleRetainerStatusChange = (
    matter: Matter, 
    newStatus: 'Not prepared' | 'Prepared' | 'Sent' | 'Signed' | 'Closed'
  ) => {
    const updated: Matter = {
      ...matter,
      retainerStatus: newStatus,
      retained: newStatus === 'Signed' ? true : matter.retained,
      events: [
        `Retainer agreement status updated to "${newStatus}"`,
        ...(matter.events || [])
      ]
    }
    onUpdateMatter(updated)
  }

  const handleInvoiceStatusChange = (
    matter: Matter, 
    newStatus: 'Not prepared' | 'Prepared' | 'Sent' | 'Paid'
  ) => {
    const updated: Matter = {
      ...matter,
      invoiceStatus: newStatus,
      events: [
        `Invoice status updated to "${newStatus}"`,
        ...(matter.events || [])
      ]
    }
    onUpdateMatter(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#a7653b]">
            Administrative Compliance · Billing & Engagement
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#202d2d] mt-1">
            Retainers & Invoices
          </h1>
          <p className="text-sm text-[#677472] mt-1">
            SCR-048 & SCR-049: Track retainer preparation, delivery, execution, and client fee settlement.
          </p>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#dfe5e3] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-[#677472] tracking-wider">
            Total Engagements
          </div>
          <div className="text-2xl font-bold text-[#202d2d] mt-1">
            {metrics.total}
          </div>
          <div className="text-xs text-[#677472] mt-0.5">Active matters eligible</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#dfe5e3] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-amber-700 tracking-wider">
            Pending Retainers
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {metrics.pendingRetainerCount}
          </div>
          <div className="text-xs text-amber-700 mt-0.5">Draft / Out for signature</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#dfe5e3] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-blue-700 tracking-wider">
            Pending Invoices
          </div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {metrics.pendingInvoiceCount}
          </div>
          <div className="text-xs text-blue-700 mt-0.5">Preparation or Sent</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#dfe5e3] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
            Signed & Locked
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">
            {metrics.signedCount}
          </div>
          <div className="text-xs text-emerald-700 mt-0.5">Protected contracts</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#dfe5e3] pt-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'pending'
              ? 'border-[#a7653b] text-[#a7653b]'
              : 'border-transparent text-[#677472] hover:text-[#202d2d]'
          }`}
        >
          <Clock className="w-4 h-4 shrink-0" />
          <span>SCR-048: Pending Retainers & Invoices</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {pendingList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('signed')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'signed'
              ? 'border-[#246b54] text-[#246b54]'
              : 'border-transparent text-[#677472] hover:text-[#202d2d]'
          }`}
        >
          <Lock className="w-4 h-4 shrink-0" />
          <span>SCR-049: Signed Retainers (Locked)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {signedList.length}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-lg border border-[#dfe5e3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#677472]" />
            <input
              type="text"
              placeholder="Search by client, file number, or application..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-[#dfe5e3] focus:outline-none focus:ring-1 focus:ring-[#246b54]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#677472]">
            <Filter className="w-3.5 h-3.5" />
            <span>Manager:</span>
          </div>
          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded border border-[#dfe5e3] bg-white text-[#202d2d]"
          >
            <option value="All">All Staff</option>
            {staffList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {activeTab === 'pending' && (
            <>
              <div className="flex items-center gap-1.5 text-xs text-[#677472] ml-2">
                <span>Retainer:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded border border-[#dfe5e3] bg-white text-[#202d2d]"
              >
                <option value="All">All Retainer Statuses</option>
                <option value="Not prepared">Not prepared</option>
                <option value="Prepared">Prepared</option>
                <option value="Sent">Sent</option>
                <option value="Signed">Signed</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-lg border border-[#dfe5e3] shadow-xs overflow-hidden">
        {activeTab === 'pending' ? (
          /* TAB 1: PENDING RETAINERS & INVOICES (SCR-048) */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-[#dfe5e3] text-[11px] font-bold uppercase text-[#677472] tracking-wider">
                  <th className="py-3 px-4">Client & File</th>
                  <th className="py-3 px-4">Application Type</th>
                  <th className="py-3 px-4">Retained Date</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Retainer Agreement Status</th>
                  <th className="py-3 px-4">Invoice / Fee Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe5e3]">
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#677472]">
                      <FileCheck2 className="w-8 h-8 mx-auto text-[#a9bdb2] mb-2" />
                      <div className="font-medium text-[#202d2d]">No pending retainers or invoices matching filters</div>
                      <div className="text-xs text-[#677472] mt-1">All active retainers are signed and settled, or try clearing search filters.</div>
                    </td>
                  </tr>
                ) : (
                  pendingList.map((matter) => {
                    const rStatus = matter.retainerStatus || (matter.retained ? 'Prepared' : 'Not prepared')
                    const iStatus = matter.invoiceStatus || 'Not prepared'
                    return (
                      <tr key={matter.id} className="hover:bg-[#fcfdfd] transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onOpenClient(matter.clientId)}
                            className="font-semibold text-[#202d2d] hover:text-[#246b54] transition-colors text-left block"
                          >
                            {matter.name}
                          </button>
                          <div className="text-xs text-[#677472] font-mono mt-0.5">
                            {matter.id}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[#202d2d]">{matter.type}</span>
                          <div className="text-xs text-[#677472]">Stage {matter.stage}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#677472]">
                          {matter.retainedDate || 'Pending Intake'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#202d2d] bg-slate-100 px-2 py-0.5 rounded-full">
                            {matter.owner}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={rStatus}
                            onChange={(e) => handleRetainerStatusChange(matter, e.target.value as any)}
                            className={`text-xs font-semibold py-1 px-2 rounded-md border focus:outline-none ${
                              rStatus === 'Signed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : rStatus === 'Sent'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : rStatus === 'Prepared'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Not prepared">Not prepared</option>
                            <option value="Prepared">Prepared</option>
                            <option value="Sent">Sent</option>
                            <option value="Signed">Signed</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={iStatus}
                            onChange={(e) => handleInvoiceStatusChange(matter, e.target.value as any)}
                            className={`text-xs font-semibold py-1 px-2 rounded-md border focus:outline-none ${
                              iStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : iStatus === 'Sent'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : iStatus === 'Prepared'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="Not prepared">Not prepared</option>
                            <option value="Prepared">Prepared</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingTermsMatter(matter)}
                              className="text-xs px-2.5 py-1 rounded border border-[#dfe5e3] text-[#202d2d] hover:bg-slate-50 flex items-center gap-1"
                              title="View retainer terms"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#677472]" />
                              <span>Terms</span>
                            </button>
                            <button
                              onClick={() => onOpenMatter(matter.id)}
                              className="text-xs px-2.5 py-1 rounded bg-[#246b54] text-white hover:bg-[#1b5240] flex items-center gap-1 font-medium"
                            >
                              <span>Open App</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* TAB 2: SIGNED RETAINERS (LOCKED) (SCR-049) */
          <div className="overflow-x-auto">
            <div className="bg-emerald-50/50 p-3 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>SCR-049 Invariant:</strong> Once signed agreement and sent/paid invoice are established, the record locks administrative terms. Casework remains active.
              </span>
            </div>

            <table className="w-full text-left border-collapse text-sm min-w-[760px]">
              <thead>
                <tr className="bg-[#f8faf9] border-b border-[#dfe5e3] text-[11px] font-bold uppercase text-[#677472] tracking-wider">
                  <th className="py-3 px-4">Client & File</th>
                  <th className="py-3 px-4">Application Type</th>
                  <th className="py-3 px-4">Retained Date</th>
                  <th className="py-3 px-4">Case Manager</th>
                  <th className="py-3 px-4">Retainer Record</th>
                  <th className="py-3 px-4">Invoice Record</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe5e3]">
                {signedList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#677472]">
                      <Lock className="w-8 h-8 mx-auto text-[#a9bdb2] mb-2" />
                      <div className="font-medium text-[#202d2d]">No locked signed retainers yet</div>
                      <div className="text-xs text-[#677472] mt-1">Move a pending retainer to 'Signed' and invoice to 'Sent' or 'Paid' to complete.</div>
                    </td>
                  </tr>
                ) : (
                  signedList.map((matter) => {
                    const iStatus = matter.invoiceStatus || 'Paid'
                    return (
                      <tr key={matter.id} className="hover:bg-[#fcfdfd] transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onOpenClient(matter.clientId)}
                            className="font-semibold text-[#202d2d] hover:text-[#246b54] transition-colors text-left block"
                          >
                            {matter.name}
                          </button>
                          <div className="text-xs text-[#677472] font-mono mt-0.5">
                            {matter.id}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-[#202d2d]">{matter.type}</span>
                          <div className="text-xs text-[#677472]">Stage {matter.stage} (In Progress)</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-[#677472]">
                          {matter.retainedDate || 'Confirmed'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#202d2d] bg-slate-100 px-2 py-0.5 rounded-full">
                            {matter.owner}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <Lock className="w-3 h-3 text-emerald-700" />
                            <span>Signed & Executed</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                            iStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-300'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{iStatus}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setViewingTermsMatter(matter)}
                              className="text-xs px-2.5 py-1 rounded border border-[#dfe5e3] text-[#202d2d] hover:bg-slate-50 flex items-center gap-1 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#677472]" />
                              <span>View Terms</span>
                            </button>
                            <button
                              onClick={() => onOpenMatter(matter.id)}
                              className="text-xs px-2.5 py-1 rounded bg-[#246b54] text-white hover:bg-[#1b5240] flex items-center gap-1 font-medium"
                            >
                              <span>Open App</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* RETAINER TERMS & FEE SCHEDULE MODAL */}
      {viewingTermsMatter && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-[#dfe5e3] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-[#202d2d] text-white flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#d5a17e]">
                  Retainer Terms Disclosure
                </div>
                <div className="text-base font-bold mt-0.5">
                  {viewingTermsMatter.name} — {viewingTermsMatter.id}
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 font-mono">
                {viewingTermsMatter.type}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-[#dfe5e3] space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-[#dfe5e3]">
                  <span className="text-[#677472]">Retained Date:</span>
                  <span className="font-semibold text-[#202d2d]">{viewingTermsMatter.retainedDate || '2026-10-01'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfe5e3]">
                  <span className="text-[#677472]">Supervising Case Manager:</span>
                  <span className="font-semibold text-[#202d2d]">{viewingTermsMatter.owner}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfe5e3]">
                  <span className="text-[#677472]">Professional Legal Fee:</span>
                  <span className="font-semibold text-[#246b54]">$3,500.00 CAD</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#dfe5e3]">
                  <span className="text-[#677472]">Government Processing Fee (IRCC):</span>
                  <span className="font-semibold text-[#202d2d]">$1,080.00 CAD</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#677472]">Disbursement Deposit:</span>
                  <span className="font-semibold text-[#202d2d]">$250.00 CAD</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-[#677472] tracking-wider mb-1">
                  Scope of Representation
                </h4>
                <p className="text-xs text-[#202d2d] bg-slate-50 p-3 rounded border border-[#dfe5e3] leading-relaxed">
                  Full service legal representation by Nationrise Immigration Practice for {viewingTermsMatter.type}. Includes preparation of forms, submission of document packages, tracking portal inquiries, and handling all government communications until final decision.
                </p>
              </div>

              {isSignedComplete(viewingTermsMatter) && (
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                  <Lock className="w-4 h-4 text-emerald-700" />
                  <span>This retainer agreement has been signed and locked in administrative records.</span>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#dfe5e3] flex justify-end gap-2">
              <button
                onClick={() => setViewingTermsMatter(null)}
                className="px-4 py-2 text-xs font-semibold rounded-md border border-[#dfe5e3] bg-white text-[#202d2d] hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const mid = viewingTermsMatter.id
                  setViewingTermsMatter(null)
                  onOpenMatter(mid)
                }}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-[#246b54] text-white hover:bg-[#1b5240] flex items-center gap-1.5"
              >
                <span>Go to Matter Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
