import React from 'react'

const RECOVERY_ROWS = [
  { version: '48', time: '2026-10-22T04:55:13.765Z', savedBy: 'seedy@sites.test' },
  { version: '47', time: '2026-10-22T04:53:35.019Z', savedBy: 'seedy@sites.test' },
  { version: '46', time: '2026-10-22T04:50:22.015Z', savedBy: 'seedy@sites.test' },
  { version: '45', time: '2026-10-22T04:49:34.020Z', savedBy: 'seedy@sites.test' },
  { version: '44', time: '2026-10-19T08:05:49.808Z', savedBy: 'seedy@sites.test' },
  { version: '43', time: '2026-10-19T08:04:55.392Z', savedBy: 'seedy@sites.test' }
]

interface RecoveryPointsTabProps {
  onExportRecords: () => void
  onRestore: (version: string) => void
}

export function RecoveryPointsTab({
  onExportRecords,
  onRestore
}: RecoveryPointsTabProps) {
  return (
    <div className="space-y-4">
      <p className="text-[13.5px] text-[#374151] leading-relaxed max-w-4xl">
        Every saved set of record changes creates a recovery point. Uploaded documents are retained separately and are not removed by a record restore.
      </p>

      <button
        onClick={onExportRecords}
        className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
      >
        Export records and document index
      </button>

      <p className="text-xs text-[#6b7280]">
        The JSON export contains records and a document index; download document files from their client profiles.
      </p>

      <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs overflow-hidden mt-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#fafbfb] border-b border-[#e5e7eb] text-[#6b7280] text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">VERSION</th>
                <th className="py-3 px-4">TIME</th>
                <th className="py-3 px-4">SAVED BY</th>
                <th className="py-3 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {RECOVERY_ROWS.map((row) => (
                <tr key={row.version} className="hover:bg-[#fbfcfb]">
                  <td className="py-3.5 px-4 font-bold text-[#111827]">{row.version}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#374151]">{row.time}</td>
                  <td className="py-3.5 px-4 text-[#111827]">{row.savedBy}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onRestore(row.version)}
                      className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-1.5 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                    >
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
