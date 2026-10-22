import React, { useState, useEffect } from 'react'
import { Search, Plus, Clock as ClockIcon, Menu } from 'lucide-react'

interface NationriseTopBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onQuickAction: () => void
  onToggleMobileMenu?: () => void
}

export function NationriseTopBar({
  searchQuery,
  onSearchChange,
  onQuickAction,
  onToggleMobileMenu
}: NationriseTopBarProps) {
  const [vancouverTime, setVancouverTime] = useState('')
  const [vancouverDate, setVancouverDate] = useState('')

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        const timeFormatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'America/Vancouver',
          hour: 'numeric',
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
        setVancouverTime(timeFormatter.format(now))
        setVancouverDate(dateFormatter.format(now))
      } catch {
        setVancouverTime('10:45:00 AM')
        setVancouverDate('Wed, Oct 7')
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="h-[64px] bg-white border-b border-[#dfe5e3] px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-xl 2xl:max-w-3xl">
        {/* Mobile / Tablet Menu Button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-1 text-[#202d2d] hover:bg-[#f4f6f5] rounded-md transition-colors shrink-0"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#8a9895] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients, matters, phone, UCI..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-7 py-2 bg-[#f4f6f5] border border-transparent focus:border-[#246b54] rounded-md text-[13px] sm:text-[13.5px] text-[#202d2d] placeholder-[#8a9895] outline-none transition-all focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a9895] hover:text-[#202d2d] px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          onClick={onQuickAction}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[#a7653b] hover:bg-[#8e522d] text-white text-[12.5px] sm:text-[13px] font-semibold rounded-md transition-colors shadow-xs whitespace-nowrap shrink-0"
          title="Quick Action"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Live Vancouver Clock (Visible on md+) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f4f6f5] border border-[#dfe5e3] rounded-md text-right text-[12px] font-mono tabular-nums text-[#202d2d]">
          <ClockIcon className="w-3.5 h-3.5 text-[#246b54]" />
          <div>
            <span className="font-bold text-[#12382e]">{vancouverTime || '10:45 AM'}</span>
            <span className="text-[#677472] ml-1.5 font-sans text-[11px]">{vancouverDate || 'Wed, Oct 7'}</span>
            <span className="text-[10px] text-[#a7653b] ml-1 uppercase font-semibold">YVR</span>
          </div>
        </div>

        <span className="badge green hidden lg:inline-block">
          Sample workspace
        </span>

        <div className="w-8 h-8 rounded-full bg-[#e9dace] text-[#815535] font-bold text-xs flex items-center justify-center border border-[#d5a17e]/40 shadow-xs cursor-pointer">
          TB
        </div>
      </div>
    </header>
  )
}
