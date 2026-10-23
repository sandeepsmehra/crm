import React from 'react'

interface ClientInformationTabProps {
  clientName: string
  onClientNameChange: (value: string) => void
  clientPhone: string
  onClientPhoneChange: (value: string) => void
  clientEmail: string
  onClientEmailChange: (value: string) => void
  clientDob: string
  onClientDobChange: (value: string) => void
  clientAddress: string
  onClientAddressChange: (value: string) => void
  clientUci: string
  onClientUciChange: (value: string) => void
  immigrationStatus: string
  onImmigrationStatusChange: (value: string) => void
  statusExpiry: string
  onStatusExpiryChange: (value: string) => void
  emergencyName: string
  onEmergencyNameChange: (value: string) => void
  emergencyRelation: string
  onEmergencyRelationChange: (value: string) => void
}

export function ClientInformationTab({
  clientName,
  onClientNameChange,
  clientPhone,
  onClientPhoneChange,
  clientEmail,
  onClientEmailChange,
  clientDob,
  onClientDobChange,
  clientAddress,
  onClientAddressChange,
  clientUci,
  onClientUciChange,
  immigrationStatus,
  onImmigrationStatusChange,
  statusExpiry,
  onStatusExpiryChange,
  emergencyName,
  onEmergencyNameChange,
  emergencyRelation,
  onEmergencyRelationChange
}: ClientInformationTabProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-2xs p-6 space-y-5">
      <div>
        <h2 className="text-base font-bold text-[#111827]">Client Information</h2>
        <p className="text-xs text-[#6b7280] mt-0.5">
          Shared with the main client profile and every application. Changes save automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Full name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Phone number
          </label>
          <input
            type="text"
            value={clientPhone}
            onChange={(e) => onClientPhoneChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => onClientEmailChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Date of birth
          </label>
          <input
            type="date"
            value={clientDob}
            onChange={(e) => onClientDobChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Address
          </label>
          <input
            type="text"
            value={clientAddress}
            onChange={(e) => onClientAddressChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            UCI
          </label>
          <input
            type="text"
            value={clientUci}
            onChange={(e) => onClientUciChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Immigration status
          </label>
          <input
            type="text"
            value={immigrationStatus}
            onChange={(e) => onImmigrationStatusChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Status expiry
          </label>
          <input
            type="date"
            value={statusExpiry}
            onChange={(e) => onStatusExpiryChange(e.target.value)}
            className="w-full bg-[#eaf4ee] border border-emerald-300 rounded-lg px-3.5 py-2 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Emergency contact name
          </label>
          <input
            type="text"
            value={emergencyName}
            onChange={(e) => onEmergencyNameChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#111827] mb-1.5">
            Relationship
          </label>
          <input
            type="text"
            value={emergencyRelation}
            onChange={(e) => onEmergencyRelationChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-lg px-3.5 py-2.5 text-sm text-[#111827] outline-none"
          />
        </div>
      </div>
    </div>
  )
}
