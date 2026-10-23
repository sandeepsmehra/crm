import React from 'react'
import { STAFF_MEMBERS } from '@/data/mockData'

export interface DocRow {
  id: string
  name: string
  receivedDate: string
  reviewDue: string
  status: string
  verifiedBy: string
  notes: string
}

interface DocumentsVerifiedTabProps {
  clientName: string
  docRows: DocRow[]
  onAddDocumentRow: () => void
  onUpdateDoc: (id: string, field: keyof DocRow, value: string) => void
}

export function DocumentsVerifiedTab({
  clientName,
  docRows,
  onAddDocumentRow,
  onUpdateDoc
}: DocumentsVerifiedTabProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#111827]">Documents Received / Verified</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">
            Edit directly in the list · Changes save automatically
          </p>
        </div>
        <button
          onClick={onAddDocumentRow}
          className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
        >
          + Add Document
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-3">DOCUMENT</th>
              <th className="py-3 px-3">RECEIVED DATE</th>
              <th className="py-3 px-3">REVIEW DUE</th>
              <th className="py-3 px-3">COUNTDOWN</th>
              <th className="py-3 px-3">STATUS</th>
              <th className="py-3 px-3">VERIFIED BY</th>
              <th className="py-3 px-3">NOTES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {docRows.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#fbfcfb]">
                {/* Document Dropdown */}
                <td className="py-3 px-3 align-top">
                  <select
                    value={doc.name}
                    onChange={(e) => onUpdateDoc(doc.id, 'name', e.target.value)}
                    className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer w-44"
                  >
                    <option value="PCC">PCC</option>
                    <option value="IELTS">IELTS</option>
                    <option value="Experience Letters">Experience Letters</option>
                    <option value="Passport">Passport</option>
                    <option value="Marriage certificate">Marriage certificate</option>
                  </select>
                  <div className="text-[11px] text-[#6b7280] mt-1">{clientName}</div>
                </td>

                {/* Received Date */}
                <td className="py-3 px-3 align-top">
                  <input
                    type="date"
                    value={doc.receivedDate}
                    onChange={(e) => onUpdateDoc(doc.id, 'receivedDate', e.target.value)}
                    className="bg-white border border-[#d1d5db] rounded-md px-2 py-1 text-xs text-[#111827] outline-none"
                  />
                </td>

                {/* Review Due */}
                <td className="py-3 px-3 align-top">
                  <input
                    type="date"
                    value={doc.reviewDue}
                    onChange={(e) => onUpdateDoc(doc.id, 'reviewDue', e.target.value)}
                    className="bg-white border border-[#d1d5db] rounded-md px-2 py-1 text-xs text-[#111827] outline-none"
                  />
                </td>

                {/* Countdown */}
                <td className="py-3 px-3 align-top">
                  <span className="bg-[#f3f4f6] text-[#6b7280] px-2.5 py-1 rounded text-[11px] font-medium inline-block">
                    Set review due
                  </span>
                </td>

                {/* Status Dropdown */}
                <td className="py-3 px-3 align-top">
                  <select
                    value={doc.status}
                    onChange={(e) => onUpdateDoc(doc.id, 'status', e.target.value)}
                    className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value="Not received">Not received</option>
                    <option value="Received">Received</option>
                    <option value="Verified">Verified</option>
                  </select>
                </td>

                {/* Verified By Dropdown */}
                <td className="py-3 px-3 align-top">
                  <select
                    value={doc.verifiedBy}
                    onChange={(e) => onUpdateDoc(doc.id, 'verifiedBy', e.target.value)}
                    className="bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-md px-2.5 py-1.5 text-xs font-medium outline-none cursor-pointer"
                  >
                    <option value="">Select manager</option>
                    {STAFF_MEMBERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Notes */}
                <td className="py-3 px-3 align-top">
                  <input
                    type="text"
                    placeholder="Type notes..."
                    value={doc.notes}
                    onChange={(e) => onUpdateDoc(doc.id, 'notes', e.target.value)}
                    className="bg-white border border-[#d1d5db] rounded-md px-2.5 py-1.5 text-xs text-[#111827] outline-none w-48"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#6b7280] pt-2">
        Countdown updates automatically from Review due and stops when Verified.
      </p>
    </div>
  )
}
