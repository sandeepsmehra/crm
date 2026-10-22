import React from 'react'
import { CRMView } from '@/types/crm'
import { NationriseLogo } from './NationriseLogo'
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Users, 
  ListTodo, 
  Clock, 
  ExternalLink, 
  Settings,
  UserCheck,
  Receipt,
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
  taskCount = 0,
  deadlineCount = 0,
  retainedCount = 0,
  isOpenMobile = false,
  onCloseMobile
}: NationriseSidebarProps) {
  const navItems: Array<{
    id: CRMView
    label: string
    icon: React.ReactNode
    badge?: number | string
    badgeColor?: string
  }> = [
    { id: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { 
      id: 'Task Manager', 
      label: 'Task Manager', 
      icon: <CheckSquare className="w-4 h-4" />,
      badge: taskCount > 0 ? taskCount : undefined,
      badgeColor: 'bg-emerald-700/80 text-emerald-100'
    },
    { id: 'Appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
    { id: 'Clients', label: 'Clients', icon: <Users className="w-4 h-4" /> },
    { 
      id: 'To-Do List', 
      label: 'To-Do List', 
      icon: <ListTodo className="w-4 h-4" />,
      badge: retainedCount > 0 ? retainedCount : undefined,
      badgeColor: 'bg-[#a7653b] text-white'
    },
    { 
      id: 'Case Managers', 
      label: 'Case Managers', 
      icon: <UserCheck className="w-4 h-4" /> 
    },
    { 
      id: 'Retainers and Invoices', 
      label: 'Retainers & Invoices', 
      icon: <Receipt className="w-4 h-4" /> 
    },
    { 
      id: 'Deadline Centre', 
      label: 'Deadline Centre', 
      icon: <Clock className="w-4 h-4" />,
      badge: deadlineCount > 0 ? deadlineCount : undefined,
      badgeColor: 'bg-red-800/80 text-red-100'
    },
    { id: 'Client Portal', label: 'Client Portal', icon: <ExternalLink className="w-4 h-4" /> },
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

      {/* Responsive Sidebar (Slide-over on mobile/tablet, fixed column on desktop) */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-[270px] bg-[#12382e] text-[#cbd4d1] flex flex-col border-r border-[#244c3e] select-none transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0 lg:w-[250px] lg:z-auto lg:min-h-screen shrink-0
          ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4 pb-2 flex items-start justify-between">
          <div className="flex-1">
            <NationriseLogo />
            <div className="text-[10px] tracking-[2.2px] text-[#a9bdb2] uppercase font-semibold mt-3 px-2">
              CRM Workspace
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-md text-[#a9bdb2] hover:text-white hover:bg-white/10 transition-colors ml-2"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-5 text-[11px] font-bold tracking-[1.5px] uppercase text-[#7e998e] mt-4 mb-2">
          Practice Workspace
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id || (currentView === 'Matter' && item.id === 'To-Do List')
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id)
                  if (onCloseMobile) onCloseMobile()
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-[13.5px] font-medium transition-all text-left group ${
                  isActive
                    ? 'bg-[#2c5145] text-white shadow-xs font-semibold'
                    : 'text-[#cad5d0] hover:bg-[#1f4337] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-[#d5a17e]' : 'text-[#8ba79b] group-hover:text-[#d5a17e]'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-black/30 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#234b3e] bg-[#0e2c24]/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#e9dace] text-[#815535] font-bold text-xs flex items-center justify-center shrink-0 border border-[#d5a17e]/40 shadow-xs">
              TB
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-white truncate leading-tight">
                Tejinder Bhatthal
              </div>
              <div className="text-[11px] text-[#a9bdb2] truncate">
                Owner · RCIC-IRB
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
