import React from 'react'
import { CRMView } from '@/types/crm'
import { NationriseLogo } from './NationriseLogo'
import { toast } from '@/components/ui/sonner'
import { X } from 'lucide-react'

// Authentic SCR-001 Pixel-Accurate Icons
function WaffleGridIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
      <rect x="2" y="2" width="12" height="12" rx="0.5" />
      <line x1="5" y1="2" x2="5" y2="14" />
      <line x1="8" y1="2" x2="8" y2="14" />
      <line x1="11" y1="2" x2="11" y2="14" />
      <line x1="2" y1="5" x2="14" y2="5" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="11" x2="14" y2="11" />
    </svg>
  )
}

function CheckmarkIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 8.5 6.5 12 13 4.5" />
    </svg>
  )
}

function PawnIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="4" r="2.2" />
      <line x1="5.5" y1="8" x2="10.5" y2="8" />
      <path d="M6 8c-.6 2.2-1.2 3.6-1.8 4.5h7.6c-.6-.9-1.2-2.3-1.8-4.5" />
      <rect x="3.5" y="12.5" width="9" height="1.5" rx="0.5" />
    </svg>
  )
}

function LinedDocIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="10" height="12" rx="0.8" />
      <line x1="3" y1="5.2" x2="13" y2="5.2" />
      <line x1="3" y1="8" x2="13" y2="8" />
      <line x1="3" y1="10.8" x2="13" y2="10.8" />
    </svg>
  )
}

function ClockIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <polyline points="8 4.5 8 8 11.2 8" />
    </svg>
  )
}

function GearIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.4" />
      <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
    </svg>
  )
}

interface NationriseSidebarProps {
  currentView: CRMView
  onViewChange: (view: CRMView) => void
  taskCount?: number
  deadlineCount?: number
  retainedCount?: number
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

export function NationriseSidebar({
  currentView,
  onViewChange,
  isOpenMobile = false,
  onCloseMobile
}: NationriseSidebarProps) {
  const navItems: Array<{
    id: CRMView
    label: string
    icon: React.ReactNode
  }> = [
    { id: 'Dashboard', label: 'Dashboard', icon: <WaffleGridIcon className="w-4 h-4" /> },
    { id: 'Task Manager', label: 'Task Manager', icon: <CheckmarkIcon className="w-4 h-4" /> },
    { id: 'Appointments', label: 'Appointments', icon: <WaffleGridIcon className="w-4 h-4" /> },
    { id: 'Clients', label: 'Clients', icon: <PawnIcon className="w-4 h-4" /> },
    { id: 'To-Do List', label: 'To-Do List', icon: <LinedDocIcon className="w-4 h-4" /> },
    { id: 'Case Managers', label: 'Case Managers', icon: <PawnIcon className="w-4 h-4" /> },
    { id: 'Retainers and Invoices', label: 'Retainers and Invoices', icon: <LinedDocIcon className="w-4 h-4" /> },
    { id: 'Deadline Centre', label: 'Deadline Centre', icon: <ClockIcon className="w-4 h-4" /> },
    { id: 'Settings', label: 'Settings', icon: <GearIcon className="w-4 h-4" /> }
  ]

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Authentic Nationrise Sidebar matching SCR-001 First Dashboard Screenshot */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-[270px] bg-[#0a2c20] text-[#b4d1c4] flex flex-col border-r border-[#12392b] select-none transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-[252px] lg:z-auto lg:h-screen lg:max-h-screen shrink-0 overflow-hidden
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Card */}
        <div className="pt-3 px-3 pb-1 flex items-start justify-between shrink-0">
          <div className="flex-1">
            <NationriseLogo />
            <div className="text-[10px] tracking-[0.2em] text-[#60927e] uppercase font-semibold mt-3 px-1">
              CRM WORKSPACE
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[#60927e] hover:text-white hover:bg-white/10 transition-colors ml-2 mt-2"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-4 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#60927e] mt-4 mb-2 shrink-0">
          PRACTICE WORKSPACE
        </div>

        {/* Navigation links with SCR-001 floating pill active UI */}
        <nav className="flex-1 px-2.5 py-1 space-y-1 overflow-y-auto sidebar-scroll">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'Matter' && item.id === 'To-Do List')
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    onViewChange(item.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-[13.5px] rounded-[10px] transition-all text-left group cursor-pointer ${
                    isActive
                      ? 'bg-[#1d4637] text-white font-semibold border-l-[3.5px] border-l-[#d58c5a] border-y border-r border-transparent shadow-xs'
                      : 'text-[#b4d1c4] font-medium border-l-[3.5px] border-transparent hover:bg-[#143e2e] hover:text-white'
                  }`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#7ea795] group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>

        {/* Authentic Footer matching SCR-001 */}
        <div className="mt-auto px-4 pb-4 pt-1 shrink-0 bg-[#0a2c20]">
          <div className="border-t border-[#174837] mb-3" />
          <div className="text-[13.5px] font-bold text-white truncate tracking-tight">
            seedy@sites.test
          </div>
          <div className="text-[12px] text-[#7ea795] font-normal leading-normal">
            owner
          </div>
          <button
            onClick={() => {
              toast.success('Session active as owner · seedy@sites.test')
            }}
            className="text-[12px] text-[#7ea795] hover:text-white underline transition-colors cursor-pointer inline-block mt-0.5"
            title="Sign out of CRM session"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

