import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'

const typographyVariants = cva('m-0 p-0', {
  variants: {
    size: {
      xs: 'text-xs leading-none',
      sm: 'text-sm leading-snug',
      md: 'text-md leading-normal',
      lg: 'text-lg leading-snug',
      xl: 'text-xl leading-snug',
      '2xl': 'text-2xl leading-tight',
      '3xl': 'text-3xl leading-tight'
    },
    tone: {
      primary: '',
      secondary: 'text-muted-foreground',
      active: 'text-primary-foreground'
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    face: {
      sans: 'font-sans',
      display: 'font-display'
    }
  },
  defaultVariants: {
    size: 'md',
    tone: 'primary',
    weight: 'regular',
    face: 'sans'
  }
})

export interface TypographyProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: ElementType
}

const Typography = ({ as: Component = 'p', className, size, tone, weight, face, ...props }: TypographyProps) => {
  return <Component className={cn(typographyVariants({ size, tone, weight, face }), className)} {...props} />
}

export { Typography, typographyVariants }
export default Typography
