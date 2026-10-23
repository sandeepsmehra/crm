import React from 'react'

export interface UserAccessItem {
  email: string
  role: string
  status: string
  signedIn?: boolean
}

interface AccessTabProps {
  staffEmail: string
  onStaffEmailChange: (value: string) => void
  staffRole: 'case_manager' | 'reception' | 'viewer' | 'owner'
  onStaffRoleChange: (role: 'case_manager' | 'reception' | 'viewer' | 'owner') => void
  usersList: UserAccessItem[]
  onAddStaff: (e: React.FormEvent) => void
}

export function AccessTab({
  staffEmail,
  onStaffEmailChange,
  staffRole,
  onStaffRoleChange,
  usersList,
  onAddStaff
}: AccessTabProps) {
  return (
    <div className="space-y-6">
      <div className="text-[13.5px] text-[#374151] space-y-3 leading-relaxed max-w-4xl">
        <p>
          Each person signs in with their own ChatGPT account. Roles below control CRM actions. Site sharing must also allow that person to open the site.
        </p>
        <p>
          Case manager: edit case records and upload documents. Reception: edit clients, appointments and office tasks. Viewer: read-only. All enabled roles can read the shared workspace.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-12 pt-2">
        {/* Form */}
        <form onSubmit={onAddStaff} className="w-full max-w-lg space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Staff email
            </label>
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => onStaffEmailChange(e.target.value)}
              className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none focus:border-[#126b48]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111827] mb-1.5">
              Role
            </label>
            <select
              value={staffRole}
              onChange={(e) => onStaffRoleChange(e.target.value as any)}
              className="w-full bg-[#ebf3fc] border border-[#d2e3f8] text-[#1c385c] rounded-lg px-3.5 py-2.5 text-sm font-medium outline-none cursor-pointer"
            >
              <option value="case_manager">case_manager</option>
              <option value="reception">reception</option>
              <option value="viewer">viewer</option>
              <option value="owner">owner</option>
            </select>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="bg-white hover:bg-[#f9fafb] border border-[#d1d5db] text-[#111827] rounded-lg px-4 py-2.5 text-sm font-medium transition-colors shadow-2xs cursor-pointer"
            >
              Add / update staff access
            </button>
          </div>
        </form>

        {/* Existing user status card */}
        <div className="space-y-4 pt-1">
          {usersList.map((u) => (
            <div key={u.email} className="text-sm">
              <div className="font-bold text-[#111827] text-base">{u.email}</div>
              <div className="text-[#4b5563] text-sm mt-0.5">
                {u.role} · {u.status} {u.signedIn && '· Signed in'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
