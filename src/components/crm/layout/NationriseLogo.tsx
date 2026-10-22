import React from 'react'
import nationriseLogoImg from '@/assets/images/nationrise-official-logo.png'

interface NationriseLogoProps {
  className?: string
}

export function NationriseLogo({ className = '' }: NationriseLogoProps) {
  return (
    <div className={`flex items-center justify-center bg-white rounded-lg p-2.5 shadow-xs border border-white/20 transition-all ${className}`}>
      <img
        src={nationriseLogoImg}
        alt="Nationrise Immigration Services"
        className="w-full h-auto max-h-11 object-contain select-none"
      />
    </div>
  )
}
