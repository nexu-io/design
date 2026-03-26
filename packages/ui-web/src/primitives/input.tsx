import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/cn'

const inputShellVariants = cva(
  'flex w-full items-center gap-2 rounded-md border border-input bg-background text-foreground shadow-xs transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
  {
    variants: {
      size: {
        sm: 'min-h-8 px-2.5 text-xs',
        md: 'min-h-10 px-3 text-sm',
        lg: 'min-h-11 px-3.5 text-base',
      },
      invalid: {
        true: 'border-destructive focus-within:ring-destructive',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputShellVariants> {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  inputClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      leadingIcon,
      trailingIcon,
      invalid,
      size,
      type = 'text',
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(inputShellVariants({ invalid, size }), className)}
        data-invalid={invalid ? '' : undefined}
      >
        {leadingIcon ? <span className="text-muted-foreground">{leadingIcon}</span> : null}
        <input
          ref={ref}
          type={type}
          aria-invalid={invalid || undefined}
          className={cn(
            'w-full border-0 bg-transparent p-0 text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
            inputClassName
          )}
          {...props}
        />
        {trailingIcon ? <span className="text-muted-foreground">{trailingIcon}</span> : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
