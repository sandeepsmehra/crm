import { Toaster as Sonner, toast } from 'sonner'
import * as React from 'react'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-[#13382c] group-[.toaster]:text-white group-[.toaster]:border-[#255243] group-[.toaster]:shadow-xl group-[.toaster]:rounded-lg group-[.toaster]:text-[13.5px] group-[.toaster]:font-medium group-[.toaster]:py-3 group-[.toaster]:px-4.5',
          description: 'group-[.toast]:text-emerald-100/80 group-[.toast]:text-xs',
          actionButton:
            'group-[.toast]:bg-[#a7653b] group-[.toast]:text-white group-[.toast]:rounded-md group-[.toast]:font-semibold',
          cancelButton:
            'group-[.toast]:bg-white/10 group-[.toast]:text-white group-[.toast]:rounded-md',
          success: 'group-[.toaster]:bg-[#13382c] group-[.toaster]:text-white',
          error: 'group-[.toaster]:bg-[#8b1e1e] group-[.toaster]:text-white group-[.toaster]:border-[#a93232]',
          warning: 'group-[.toaster]:bg-[#976314] group-[.toaster]:text-white',
          info: 'group-[.toaster]:bg-[#1e3a4b] group-[.toaster]:text-white'
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
