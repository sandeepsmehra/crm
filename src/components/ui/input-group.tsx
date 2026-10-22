import * as React from 'react'
import { cn } from '@/lib/utils'

export const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex w-full items-stretch [&>input]:rounded-none first:[&>input]:rounded-l-xl last:[&>input]:rounded-r-xl [&>input:not(:first-child)]:-ml-px [&>input:focus-visible]:z-10',
      className
    )}
    {...props}
  />
))
InputGroup.displayName = 'InputGroup'

export const InputLeftAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-l-xl border border-r-0 border-slate-700/80 bg-slate-800/80 px-3 text-sm text-slate-400 select-none',
      className
    )}
    {...props}
  />
))
InputLeftAddon.displayName = 'InputLeftAddon'

export const InputRightAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-r-xl border border-l-0 border-slate-700/80 bg-slate-800/80 px-3 text-sm text-slate-400 select-none',
      className
    )}
    {...props}
  />
))
InputRightAddon.displayName = 'InputRightAddon'

export const InputLeftElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 z-10',
      className
    )}
    {...props}
  />
))
InputLeftElement.displayName = 'InputLeftElement'

export const InputRightElement = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 z-10',
      className
    )}
    {...props}
  />
))
InputRightElement.displayName = 'InputRightElement'
