import React from 'react'
import { CRMView } from '@/types/crm'
import { NationriseLogo } from './NationriseLogo'
import { toast } from '@/components/ui/sonner'
import { 
  LayoutDashboard, 
  Check, 
  Calendar, 
  User, 
  FileText, 
  UserCheck, 
  Receipt, 
  Clock, 
  Settings,
  X
} from 'lucide-react'

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
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'Task Manager', label: 'Task Manager', icon: <Check className="w-4 h-4" /> },
    { id: 'Appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'Clients', label: 'Clients', icon: <User className="w-4 h-4" /> },
    { id: 'To-Do List', label: 'To-Do List', icon: <FileText className="w-4 h-4" /> },
    { id: 'Case Managers', label: 'Case Managers', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'Retainers and Invoices', label: 'Retainers and Invoices', icon: <Receipt className="w-4 h-4" /> },
    { id: 'Deadline Centre', label: 'Deadline Centre', icon: <Clock className="w-4 h-4" /> },
    { id: 'Settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
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

      {/* Authentic Nationrise Sidebar matching 56 screens */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-[270px] bg-[#0d3829] text-[#b0c5ba] flex flex-col border-r border-[#144232] select-none transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-[250px] lg:z-auto lg:min-h-screen shrink-0
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Card */}
        <div className="pt-3 px-3 pb-1 flex items-start justify-between">
          <div className="flex-1">
            <NationriseLogo />
            <div className="text-[10px] tracking-[0.18em] text-[#6b8f7e] uppercase font-bold mt-3 px-3">
              CRM WORKSPACE
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[#6b8f7e] hover:text-white hover:bg-white/10 transition-colors ml-2 mt-2"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-6 text-[10px] font-bold tracking-[0.18em] uppercase text-[#6b8f7e] mt-3 mb-2">
          PRACTICE WORKSPACE
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'Matter' && item.id === 'To-Do List')
            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    onViewChange(item.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-[13.5px] transition-all text-left font-medium ${
                    isActive
                      ? 'bg-[#174334] text-white border-l-4 border-[#c27847] rounded-r-lg font-semibold'
                      : 'text-[#b0c5ba] hover:bg-[#144132] hover:text-white rounded-md mx-2 w-[calc(100%-16px)]'
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#8ea99b]'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </button>
              </div>
            )
          })}
        </nav>

        {/* Clean Footer identical to SCR-001/SCR-011/SCR-016/SCR-022 */}
        <div className="mt-auto p-4 pt-3">
          <div className="text-[13px] font-bold text-white truncate tracking-tight">
            seedy@sites.test
          </div>
          <div className="text-[11px] text-[#7e9e8f] capitalize font-normal leading-tight">
            owner
          </div>
          <button
            onClick={() => {
              toast.success('Session active as owner · seedy@sites.test')
            }}
            className="text-[11px] text-[#7e9e8f] hover:text-white underline transition-colors cursor-pointer inline-block mt-0.5"
            title="Sign out of CRM session"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
