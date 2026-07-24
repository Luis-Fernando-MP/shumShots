import type { StyleStatus } from '@common/ui/common/types'
import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

type InputVariant = 'soft' | 'solid' | 'outline' | 'ghost' | 'dashed'

const inputVariants = cva(
  [
    'relative inline-flex w-full min-w-0 items-center rounded-md',
    'transition-colors',
    'has-[:disabled]:pointer-events-none has-[:disabled]:opacity-50'
  ],
  {
    variants: {
      size: {
        sm: 'h-8 gap-1.5 px-2.5 text-xs',
        default: 'h-9 gap-1.5 px-3 text-sm',
        lg: 'h-10 gap-2 px-3.5 text-base'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

const statusStyles: Record<InputVariant, Record<StyleStatus, string>> = {
  soft: {
    default: 'border border-transparent bg-card text-foreground focus-within:border-border',
    primary: 'border border-transparent bg-primary/15 text-foreground focus-within:border-primary',
    success: 'border border-transparent bg-semantic-success/15 text-semantic-success focus-within:border-semantic-success',
    warning: 'border border-transparent bg-semantic-warning/15 text-semantic-warning focus-within:border-semantic-warning',
    error: 'border border-transparent bg-semantic-error/15 text-semantic-error focus-within:border-semantic-error',
    info: 'border border-transparent bg-semantic-info/15 text-semantic-info focus-within:border-semantic-info'
  },
  solid: {
    default: 'border border-transparent bg-muted text-foreground focus-within:border-border',
    primary: 'border border-transparent bg-primary/20 text-foreground focus-within:border-primary',
    success: 'border border-transparent bg-semantic-success/20 text-semantic-success focus-within:border-semantic-success',
    warning: 'border border-transparent bg-semantic-warning/20 text-semantic-warning focus-within:border-semantic-warning',
    error: 'border border-transparent bg-semantic-error/20 text-semantic-error focus-within:border-semantic-error',
    info: 'border border-transparent bg-semantic-info/20 text-semantic-info focus-within:border-semantic-info'
  },
  outline: {
    default: 'border border-border bg-transparent text-foreground focus-within:border-primary',
    primary: 'border border-primary bg-transparent text-foreground focus-within:border-primary',
    success: 'border border-semantic-success bg-transparent text-semantic-success focus-within:border-semantic-success',
    warning: 'border border-semantic-warning bg-transparent text-semantic-warning focus-within:border-semantic-warning',
    error: 'border border-semantic-error bg-transparent text-semantic-error focus-within:border-semantic-error',
    info: 'border border-semantic-info bg-transparent text-semantic-info focus-within:border-semantic-info'
  },
  ghost: {
    default: 'border border-transparent bg-transparent text-foreground focus-within:border-border',
    primary: 'border border-transparent bg-transparent text-primary focus-within:border-primary',
    success: 'border border-transparent bg-transparent text-semantic-success focus-within:border-semantic-success',
    warning: 'border border-transparent bg-transparent text-semantic-warning focus-within:border-semantic-warning',
    error: 'border border-transparent bg-transparent text-semantic-error focus-within:border-semantic-error',
    info: 'border border-transparent bg-transparent text-semantic-info focus-within:border-semantic-info'
  },
  dashed: {
    default:
      'border-2 border-dashed border-border bg-transparent text-foreground focus-within:border-primary',
    primary:
      'border-2 border-dashed border-primary bg-transparent text-foreground focus-within:border-primary',
    success:
      'border-2 border-dashed border-semantic-success bg-transparent text-semantic-success focus-within:border-semantic-success',
    warning:
      'border-2 border-dashed border-semantic-warning bg-transparent text-semantic-warning focus-within:border-semantic-warning',
    error:
      'border-2 border-dashed border-semantic-error bg-transparent text-semantic-error focus-within:border-semantic-error',
    info: 'border-2 border-dashed border-semantic-info bg-transparent text-semantic-info focus-within:border-semantic-info'
  }
}

const adornmentStyles: Record<'sm' | 'default' | 'lg', string> = {
  sm: '[&_svg]:size-3.5',
  default: '[&_svg]:size-4',
  lg: '[&_svg]:size-4'
}

const chipStyles: Record<'sm' | 'default' | 'lg', string> = {
  sm: 'px-1.5 py-0.5 text-[10px] leading-none',
  default: 'px-2 py-0.5 text-xs leading-none',
  lg: 'px-2 py-1 text-xs leading-none'
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'>,
    VariantProps<typeof inputVariants> {
  variant?: InputVariant
  status?: StyleStatus
  /** Content before the field (icon, label, etc.). */
  prefix?: ReactNode
  /** Content after the field — rendered as a chip (unit, extension, etc.). */
  suffix?: ReactNode
  /** Classes for the outer shell (border / background). */
  containerClassName?: string
}

/** Standard PIXIS text field with Button-aligned variant / status / size tokens. */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    containerClassName,
    variant = 'soft',
    status = 'default',
    size = 'default',
    prefix,
    suffix,
    type = 'text',
    disabled,
    ...props
  },
  ref
) {
  const resolvedSize = size ?? 'default'

  return (
    <div
      className={cn(
        inputVariants({ size: resolvedSize }),
        statusStyles[variant][status],
        containerClassName
      )}
      data-disabled={disabled || undefined}
    >
      {prefix != null && (
        <span
          className={cn(
            'text-muted-foreground inline-flex shrink-0 items-center select-none',
            adornmentStyles[resolvedSize]
          )}
        >
          {prefix}
        </span>
      )}

      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-[inherit] text-inherit outline-none focus:outline-none',
          className
        )}
        {...props}
      />

      {suffix != null && (
        <span
          className={cn(
            'border-border/70 bg-muted text-muted-foreground pointer-events-none inline-flex shrink-0 items-center justify-center gap-1 rounded-md border font-medium whitespace-nowrap select-none',
            chipStyles[resolvedSize],
            adornmentStyles[resolvedSize]
          )}
        >
          {suffix}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export { Input, inputVariants }
export default Input
