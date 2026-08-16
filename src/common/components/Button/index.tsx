import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, FC } from 'react'

import { cn } from '@common/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-radius text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-card text-foreground hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted/70',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted/70'
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4',
        lg: 'h-12 px-5'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/** Standard PIXIS button with Tailwind tokens and optional Radix slot composition. */
const Button: FC<ButtonProps> = ({ asChild, className, size, variant, ...props }) => {
  const Component = asChild ? Slot : 'button'

  return <Component className={cn(buttonVariants({ size, variant }), className)} {...props} />
}

export { Button, buttonVariants }
