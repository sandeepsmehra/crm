import React, { useState, useEffect } from 'react'
import { Search, Menu } from 'lucide-react'
import { CRMView } from '@/types/crm'

interface NationriseTopBarProps {
  currentView: CRMView
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggleMobileMenu?: () => void
}

export function NationriseTopBar({
  currentView,
  searchQuery,
  onSearchChange,
  onToggleMobileMenu
}: NationriseTopBarProps) {
  const [vancouverTime, setVancouverTime] = useState('09:35:00 p.m.')
  const [vancouverDate, setVancouverDate] = useState('Thu, Oct 22')

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const timeFormatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Vancouver',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
        const dateFormatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Vancouver',
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
        
        let tStr = timeFormatter.format(now).toLowerCase()
        // Format to "09:35:00 p.m."
        if (tStr.includes('am')) tStr = tStr.replace('am', 'a.m.')
        if (tStr.includes('pm')) tStr = tStr.replace('pm', 'p.m.')
        
        setVancouverTime(tStr)
        setVancouverDate(dateFormatter.format(now))
      } catch {
        setVancouverTime('09:35:04 p.m.')
        setVancouverDate('Thu, Oct 22')
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // In the authentic screenshots, search input appears on Clients, Case Managers, Retainers, Deadline Centre, Settings
  const showSearch = [
    'Clients',
    'Case Managers',
    'Retainers and Invoices',
    'Deadline Centre',
    'Settings',
    'Client Portal'
  ].includes(currentView)

  return (
    <header className="bg-[#f7f9f8] px-4 sm:px-8 pt-3 pb-2 flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile / Tablet Menu Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 -ml-1 text-[#1c2826] hover:bg-black/5 rounded-md transition-colors shrink-0"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search input matching SCR-022, SCR-047, SCR-048, SCR-050, SCR-051 */}
        {showSearch && (
          <div className="relative w-full max-w-[360px]">
            <Search className="w-3.5 h-3.5 text-[#62756d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, phone, UCI, notes or documents"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#eaeeec] hover:bg-[#e4e9e6] focus:bg-white border border-transparent focus:border-[#126b48] rounded-md text-[13px] text-[#1c2826] placeholder-[#62756d] outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#62756d] hover:text-[#1c2826] px-1"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live Vancouver Clock and TB Avatar matching SCR-001/SCR-011/SCR-022 */}
      <div className="flex items-center gap-3 shrink-0 ml-auto">
        <div className="text-right">
          <div className="text-[19px] sm:text-[22px] font-bold text-[#1c2826] font-mono leading-none tracking-tight">
            {vancouverTime}
          </div>
          <div className="text-[11.5px] text-[#62756d] mt-0.5 leading-none font-medium">
            {vancouverDate} · Vancouver
          </div>
        </div>

        {/* Circular Avatar TB */}
        <div 
          className="w-8 h-8 rounded-full bg-[#ded3c6] text-[#5d4023] font-bold text-xs flex items-center justify-center shrink-0 border border-[#cbbead] shadow-2xs select-none"
          title="Tejinder Bhatthal (TB)"
        >
          TB
        </div>
      </div>
    </header>
  )
}
