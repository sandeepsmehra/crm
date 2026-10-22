import React from 'react'
import { X, UserPlus, CalendarPlus, CheckSquare, FilePlus, AlertTriangle, FileText } from 'lucide-react'

interface QuickMenuModalProps {
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void
}

export function QuickMenuModal({
  isOpen,
  onClose,
  onAction
}: QuickMenuModalProps) {
  if (!isOpen) return null

  const actions = [
    { id: 'newClient', label: 'New Client Profile', icon: <UserPlus className="w-5 h-5 text-[#246b54]" />, desc: 'Register individual or employer' },
    { id: 'assignTask', label: 'Assign Office Task', icon: <CheckSquare className="w-5 h-5 text-[#356c8d]" />, desc: 'Telephone call or casework dispatch' },
    { id: 'bookAppointment', label: 'Book Appointment', icon: <CalendarPlus className="w-5 h-5 text-[#a7653b]" />, desc: 'Schedule consultation or visit' },
    { id: 'retainedFile', label: 'Add Retained File', icon: <FilePlus className="w-5 h-5 text-[#7359a6]" />, desc: 'Open matter from signed retainer' },
    { id: 'addDeadline', label: 'Add Deadline / Target', icon: <AlertTriangle className="w-5 h-5 text-[#ae4343]" />, desc: 'Record time limit or milestone' },
    { id: 'govtRequest', label: 'Government Request / PFL', icon: <FileText className="w-5 h-5 text-[#976314]" />, desc: 'IRCC letter or response workflow' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#dfe5e3] w-full max-w-md max-h-[92vh] overflow-hidden animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#edf0ee] flex items-center justify-between bg-[#fcfdfd]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#12382e]">Quick Action</h2>
            <p className="text-[11.5px] sm:text-[12px] text-[#677472]">
              Choose an operational action to perform.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8a9895] hover:text-[#202d2d] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                onClose()
                onAction(act.id)
              }}
              className="p-3 text-left bg-[#f8faf9] hover:bg-[#edf4f0] border border-[#edf0ee] hover:border-[#b9d9ce] rounded-lg transition-all flex flex-col gap-1 cursor-pointer group"
            >
              <div className="flex items-center gap-2 font-bold text-[13.5px] text-[#12382e] group-hover:text-[#246b54]">
                {act.icon}
                <span>{act.label}</span>
              </div>
              <p className="text-[11.5px] text-[#677472]">{act.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
