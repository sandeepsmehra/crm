import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const spinnerVariants = cva('animate-spin text-indigo-500', {
  variants: {
    size: {
      xs: 'h-3.5 w-3.5',
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    variant: {
      default: 'text-indigo-500',
      white: 'text-white',
      slate: 'text-slate-400',
      success: 'text-emerald-400',
      destructive: 'text-rose-400',
      accent: 'text-cyan-400',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
})

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => {
    return (
      <div role="status" className="inline-flex items-center justify-center">
        <Loader2
          ref={ref}
          className={cn(spinnerVariants({ size, variant, className }))}
          aria-hidden="true"
          {...props}
        />
        {label && <span className="sr-only">{label}</span>}
      </div>
    )
  }
)
Spinner.displayName = 'Spinner'
