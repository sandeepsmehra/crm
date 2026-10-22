import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  attached?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, attached = true, orientation = 'horizontal', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
          attached && orientation === 'horizontal' && [
            '[&>button]:rounded-none first:[&>button]:rounded-l-xl last:[&>button]:rounded-r-xl',
            '[&>button:not(:first-child)]:-ml-[1px]',
            '[&>button:hover]:z-10 [&>button:focus-visible]:z-20',
          ],
          attached && orientation === 'vertical' && [
            '[&>button]:rounded-none first:[&>button]:rounded-t-xl last:[&>button]:rounded-b-xl',
            '[&>button:not(:first-child)]:-mt-[1px]',
            '[&>button:hover]:z-10 [&>button:focus-visible]:z-20',
          ],
          !attached && 'gap-2',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'
