import { cva, type VariantProps } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@common/utils/cn'

const typographyVariants = cva('m-0 p-0', {
  variants: {
    size: {
      xs: 'text-xs leading-snug',
      sm: 'text-sm leading-snug',
      md: 'text-base leading-normal',
      lg: 'text-lg leading-snug',
      xl: 'text-xl leading-snug'
    },
    tone: {
      primary: 'text-foreground',
      secondary: 'text-muted-foreground',
      active: 'text-primary-foreground'
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold'
    }
  },
  defaultVariants: {
    size: 'sm',
    tone: 'primary',
    weight: 'regular'
  }
})

export interface TypographyProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: ElementType
}

/** PIXIS text primitive. Prefer size tokens (`xs`–`xl`) over fixed pixel sizes. */
const Typography = ({
  as: Component = 'p',
  className,
  size,
  tone,
  weight,
  ...props
}: TypographyProps) => {
  return <Component className={cn(typographyVariants({ size, tone, weight }), className)} {...props} />
}

export { Typography, typographyVariants }
export default Typography
