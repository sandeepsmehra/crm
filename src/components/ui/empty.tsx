import * as React from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center animate-in fade-in-50',
      className
    )}
    {...props}
  />
))
Empty.displayName = 'Empty'

export const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-inner',
      className
    )}
    {...props}
  >
    {children || <Inbox className="h-7 w-7" />}
  </div>
))
EmptyMedia.displayName = 'EmptyMedia'

export const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn('text-base font-semibold text-white tracking-tight', className)}
    {...props}
  />
))
EmptyTitle.displayName = 'EmptyTitle'

export const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'mt-1.5 max-w-sm text-xs text-slate-400 leading-relaxed',
      className
    )}
    {...props}
  />
))
EmptyDescription.displayName = 'EmptyDescription'

export const EmptyAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-5 flex items-center gap-3', className)}
    {...props}
  />
))
EmptyAction.displayName = 'EmptyAction'
