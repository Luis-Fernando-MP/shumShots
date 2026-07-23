import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { FC, HTMLAttributes } from 'react'

import type { StyleStatus } from '../common/types'

export type SeparatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type SeparatorVariant = 'solid' | 'dashed' | 'dotted'
export type SeparatorOrientation = 'vertical' | 'horizontal'
export type SeparatorStatus = StyleStatus

const solidThickness: Record<SeparatorSize, { vertical: string; horizontal: string }> = {
  xs: { vertical: 'w-px', horizontal: 'h-px' },
  sm: { vertical: 'w-0.5', horizontal: 'h-0.5' },
  md: { vertical: 'w-1', horizontal: 'h-1' },
  lg: { vertical: 'w-1.5', horizontal: 'h-1.5' },
  xl: { vertical: 'w-2', horizontal: 'h-2' }
}

const lineThickness: Record<SeparatorSize, { vertical: string; horizontal: string }> = {
  xs: { vertical: 'border-l', horizontal: 'border-t' },
  sm: { vertical: 'border-l-2', horizontal: 'border-t-2' },
  md: { vertical: 'border-l-4', horizontal: 'border-t-4' },
  lg: { vertical: 'border-l-4', horizontal: 'border-t-4' },
  xl: { vertical: 'border-l-8', horizontal: 'border-t-8' }
}

const solidStatus: Record<SeparatorStatus, string> = {
  default: 'bg-border',
  primary: 'bg-primary',
  success: 'bg-semantic-success',
  warning: 'bg-semantic-warning',
  error: 'bg-semantic-error',
  info: 'bg-semantic-info'
}

const lineStatus: Record<SeparatorStatus, string> = {
  default: 'border-border',
  primary: 'border-primary',
  success: 'border-semantic-success',
  warning: 'border-semantic-warning',
  error: 'border-semantic-error',
  info: 'border-semantic-info'
}

const separatorVariants = cva('shrink-0', {
  variants: {
    orientation: {
      vertical: 'h-6',
      horizontal: 'w-full'
    }
  },
  defaultVariants: {
    orientation: 'vertical'
  }
})

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof separatorVariants> {
  size?: SeparatorSize
  status?: SeparatorStatus
  variant?: SeparatorVariant
  orientation?: SeparatorOrientation
}

/** Thin decorative rule; `size` controls stroke thickness only. */
const Separator: FC<SeparatorProps> = ({
  className,
  size = 'xs',
  status = 'default',
  variant = 'solid',
  orientation = 'vertical',
  role = 'separator',
  ...props
}) => {
  const axis = orientation === 'vertical' ? 'vertical' : 'horizontal'

  const stroke =
    variant === 'solid'
      ? cn(solidStatus[status], solidThickness[size][axis])
      : cn(
          'bg-transparent',
          variant === 'dashed' ? 'border-dashed' : 'border-dotted',
          lineThickness[size][axis],
          lineStatus[status],
          axis === 'vertical' ? 'w-0' : 'h-0'
        )

  return (
    <div
      role={role}
      aria-orientation={orientation}
      className={cn(separatorVariants({ orientation }), stroke, className)}
      {...props}
    />
  )
}

export { Separator, separatorVariants }
export default Separator
