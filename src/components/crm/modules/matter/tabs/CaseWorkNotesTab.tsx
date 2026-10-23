import React from 'react'

interface SavedNote {
  id: string
  text: string
  time: string
}

interface CaseWorkNotesTabProps {
  newNote: string
  onNewNoteChange: (value: string) => void
  savedNotes: SavedNote[]
  onSaveNote: () => void
}

export function CaseWorkNotesTab({
  newNote,
  onNewNoteChange,
  savedNotes,
  onSaveNote
}: CaseWorkNotesTabProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-[#111827]">Case Work & Notes</h2>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Record last contact, what we are waiting for and progress. Each saved note keeps its own timestamp.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#111827] mb-1.5">
          New note
        </label>
        <textarea
          rows={5}
          value={newNote}
          onChange={(e) => onNewNoteChange(e.target.value)}
          className="w-full bg-white border border-[#d1d5db] rounded-lg p-3 text-sm text-[#111827] outline-none leading-relaxed"
        />
      </div>

      <div>
        <button
          onClick={onSaveNote}
          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          Save Note
        </button>
      </div>

      <div className="pt-2">
        {savedNotes.length > 0 ? (
          <div className="space-y-3">
            {savedNotes.map((n) => (
              <div key={n.id} className="p-3 bg-[#fafbfb] border border-[#e5e7eb] rounded-lg text-sm">
                <div className="text-xs text-[#6b7280] mb-1 font-mono">{n.time}</div>
                <div className="text-[#111827]">{n.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6b7280]">
            No notes yet. Add the first update for this application.
          </p>
        )}
      </div>
    </div>
  )
}
