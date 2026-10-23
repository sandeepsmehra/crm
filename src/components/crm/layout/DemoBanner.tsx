import React from 'react'
import { toast } from '@/components/ui/sonner'
import { CRMView } from '@/types/crm'

interface DemoBannerProps {
  currentView?: CRMView
  onResetDemo: () => void
}

export function DemoBanner({ currentView, onResetDemo }: DemoBannerProps) {
  const handleRetrySave = () => {
    toast.success('Workspace changes synchronized · seedy@sites.test')
  }

  const handleDownloadCopy = () => {
    try {
      const dump = {
        matters: localStorage.getItem('nationrise_matters'),
        clients: localStorage.getItem('nationrise_clients'),
        appointments: localStorage.getItem('nationrise_appointments'),
        tasks: localStorage.getItem('nationrise_tasks'),
        pfl: localStorage.getItem('nationrise_pfl'),
        timestamp: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nationrise-crm-backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Downloaded unsaved workspace backup')
    } catch {
      toast.error('Failed to export workspace backup')
    }
  }

  const handleReloadLatest = () => {
    toast.info('Workspace synchronized with latest saved state')
  }

  // SCR-047, SCR-048, SCR-050, SCR-051 display document review banner
  const isDocumentReviewView = [
    'Case Managers',
    'Retainers and Invoices',
    'Deadline Centre',
    'Settings',
    'Client Portal'
  ].includes(currentView || '')

  return (
    <div className="bg-[#f2e9dc] text-[#6e5842] border-b border-[#e5dacf] px-4 sm:px-8 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 select-none shadow-2xs">
      <div className="font-normal text-[#5a4530]">
        {isDocumentReviewView
          ? 'Invalid document review record · seedy@sites.test · owner'
          : 'Unsaved changes · seedy@sites.test · owner'}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isDocumentReviewView && (
          <>
            <button
              onClick={handleRetrySave}
              className="bg-white hover:bg-[#faf6f0] border border-[#d9ccbf] px-3 py-0.5 rounded text-xs font-medium text-[#202d2d] transition-colors cursor-pointer shadow-2xs"
            >
              Retry save
            </button>
            <button
              onClick={handleDownloadCopy}
              className="bg-white hover:bg-[#faf6f0] border border-[#d9ccbf] px-3 py-0.5 rounded text-xs font-medium text-[#202d2d] transition-colors cursor-pointer shadow-2xs"
            >
              Download unsaved copy
            </button>
          </>
        )}

        <button
          onClick={handleReloadLatest}
          className="bg-white hover:bg-[#faf6f0] border border-[#d9ccbf] px-3 py-0.5 rounded text-xs font-medium text-[#202d2d] transition-colors cursor-pointer shadow-2xs"
        >
          Reload latest
        </button>

        <button
          onClick={() => {
            onResetDemo()
          }}
          className="text-[11px] text-[#9c5e31] hover:underline cursor-pointer ml-1"
          title="Reset sample records"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
