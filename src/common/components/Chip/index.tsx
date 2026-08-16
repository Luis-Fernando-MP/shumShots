'use client'

import { cn } from '@common/utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { XIcon } from 'lucide-react'
import type { HTMLAttributes, FC, ReactNode } from 'react'

const chipVariants = cva(
  'inline-flex max-w-full items-center gap-1 rounded-md border text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted/50 text-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border bg-transparent text-foreground',
        primary: 'border-primary/40 bg-primary/10 text-foreground'
      },
      size: {
        sm: 'h-6 px-1.5',
        md: 'h-7 px-2'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
)

export interface ChipProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof chipVariants> {
  children: ReactNode
  onRemove?: () => void
  removeLabel?: string
}

const Chip: FC<ChipProps> = ({
  children,
  className,
  variant,
  size,
  onRemove,
  removeLabel = 'Quitar',
  ...props
}) => (
  <span className={cn(chipVariants({ variant, size }), className)} {...props}>
    <span className='truncate'>{children}</span>
    {onRemove && (
      <button
        type='button'
        aria-label={removeLabel}
        className='text-muted-foreground hover:text-foreground shrink-0 rounded-sm p-0.5'
        onClick={onRemove}
      >
        <XIcon className='size-3' />
      </button>
    )}
  </span>
)

export { Chip, chipVariants }
export default Chip
