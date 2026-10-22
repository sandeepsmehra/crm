import React from 'react'
import { RotateCcw } from 'lucide-react'

interface DemoBannerProps {
  onResetDemo: () => void
}

export function DemoBanner({ onResetDemo }: DemoBannerProps) {
  return (
    <div className="bg-[#f0e7dd] text-[#78522e] border-b border-[#e2d2be] px-3 sm:px-6 py-2 text-[11px] sm:text-[12px] flex flex-wrap items-center justify-between gap-2 font-medium">
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="font-bold tracking-wider uppercase text-[10px] sm:text-[11px] bg-[#dfd0bf] px-1.5 py-0.5 rounded text-[#58391b]">
          Demo Session
        </span>
        <span className="leading-snug">Interactive Practice Workspace · Fictional sample records · Vancouver timezone</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <span className="hidden sm:inline">Demo date: 7 Oct 2026</span>
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#8a4e26] hover:text-[#5c2f10] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset demo data</span>
        </button>
      </div>
    </div>
  )
}
