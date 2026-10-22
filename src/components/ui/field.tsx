import * as React from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-invalid={Boolean(error)}
        className={cn('space-y-1.5 w-full', className)}
        {...props}
      >
        {children}
        {error && <FieldError>{error}</FieldError>}
      </div>
    )
  }
)
Field.displayName = 'Field'

export interface FieldLabelProps
  extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean
}

export const FieldLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FieldLabelProps
>(({ className, children, required, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn('inline-flex items-center gap-1', className)}
    {...props}
  >
    {children}
    {required && <span className="text-rose-400 font-bold">*</span>}
  </Label>
))
FieldLabel.displayName = 'FieldLabel'

export const FieldHelper = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-[11px] text-slate-400 leading-normal', className)}
    {...props}
  />
))
FieldHelper.displayName = 'FieldHelper'

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'flex items-center gap-1.5 text-xs text-rose-400 font-medium animate-in fade-in-50',
      className
    )}
    {...props}
  >
    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
    <span>{children}</span>
  </p>
))
FieldError.displayName = 'FieldError'

export const Fieldset = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    ref={ref}
    className={cn(
      'space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5',
      className
    )}
    {...props}
  />
))
Fieldset.displayName = 'Fieldset'

export const FieldsetLegend = React.forwardRef<
  HTMLLegendElement,
  React.HTMLAttributes<HTMLLegendElement>
>(({ className, ...props }, ref) => (
  <legend
    ref={ref}
    className={cn(
      'px-2 text-sm font-semibold text-white tracking-tight',
      className
    )}
    {...props}
  />
))
FieldsetLegend.displayName = 'FieldsetLegend'
