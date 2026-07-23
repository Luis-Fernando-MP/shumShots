'use client'

import Tooltip from '@common/ui/Tooltip'
import type { StyleStatus } from '@common/ui/common/types'
import { cn } from '@common/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react'

type ButtonVariant = 'soft' | 'solid' | 'outline' | 'ghost' | 'dashed'

const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium',
    'transition-colors select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-5'
  ],
  {
    variants: {
      size: {
        default: 'h-9 min-w-9 px-4 py-2',
        sm: 'h-8 min-w-8 px-3 text-xs [&_svg]:size-4',
        lg: 'h-10 min-w-10 px-5 text-base',
        icon: 'size-9 p-2'
      }
    },
    defaultVariants: {
      size: 'icon'
    }
  }
)

const statusStyles: Record<ButtonVariant, Record<StyleStatus, string>> = {
  soft: {
    default: 'bg-card text-foreground hover:bg-muted',
    primary: 'bg-primary/15 text-primary hover:bg-primary/25',
    success: 'bg-semantic-success/15 text-semantic-success hover:bg-semantic-success/25',
    warning: 'bg-semantic-warning/15 text-semantic-warning hover:bg-semantic-warning/25',
    error: 'bg-semantic-error/15 text-semantic-error hover:bg-semantic-error/25',
    info: 'bg-semantic-info/15 text-semantic-info hover:bg-semantic-info/25'
  },
  solid: {
    default: 'bg-muted text-foreground hover:bg-muted/80',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    success: 'bg-semantic-success text-semantic-success-text hover:bg-semantic-success/90',
    warning: 'bg-semantic-warning text-semantic-warning-text hover:bg-semantic-warning/90',
    error: 'bg-semantic-error text-semantic-error-text hover:bg-semantic-error/90',
    info: 'bg-semantic-info text-semantic-info-text hover:bg-semantic-info/90'
  },
  outline: {
    default: 'border border-border bg-transparent text-foreground hover:bg-muted/70',
    primary: 'border border-primary bg-transparent text-primary hover:bg-primary/10',
    success: 'border border-semantic-success bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning: 'border border-semantic-warning bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'border border-semantic-error bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'border border-semantic-info bg-transparent text-semantic-info hover:bg-semantic-info/10'
  },
  ghost: {
    default: 'bg-transparent text-foreground hover:bg-muted/70',
    primary: 'bg-transparent text-primary hover:bg-primary/10',
    success: 'bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning: 'bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'bg-transparent text-semantic-info hover:bg-semantic-info/10'
  },
  dashed: {
    default: 'border-2 border-dashed border-border bg-transparent text-foreground hover:bg-muted/70',
    primary: 'border-2 border-dashed border-primary bg-transparent text-foreground hover:bg-primary/10',
    success:
      'border-2 border-dashed border-semantic-success bg-transparent text-semantic-success hover:bg-semantic-success/10',
    warning:
      'border-2 border-dashed border-semantic-warning bg-transparent text-semantic-warning hover:bg-semantic-warning/10',
    error: 'border-2 border-dashed border-semantic-error bg-transparent text-semantic-error hover:bg-semantic-error/10',
    info: 'border-2 border-dashed border-semantic-info bg-transparent text-semantic-info hover:bg-semantic-info/10'
  }
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: Readonly<ReactNode[]> | null | Readonly<ReactNode>
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  variant?: ButtonVariant
  status?: StyleStatus
  active?: boolean
}

const Button: FC<ButtonProps> = ({
  children,
  className = '',
  tooltip,
  tooltipPosition = 'top',
  variant = 'soft',
  status = 'default',
  size = 'icon',
  active = false,
  ...props
}) => {
  const button = (
    <button
      type='button'
      className={cn(
        buttonVariants({ size }),
        active ? 'bg-primary text-primary-foreground hover:bg-primary/90' : statusStyles[variant][status],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
      <Tooltip.Content side={tooltipPosition} backgroundColor='bg-background' borderColor='border-border'>
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  )
}

export { buttonVariants }
export default Button
