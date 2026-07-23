import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { ElementType, FC, HTMLAttributes } from 'react'

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

type TypographySlotProps = Omit<TypographyProps, 'as' | 'size'>

const TypographyRoot: FC<TypographyProps> = ({
  as: Component = 'p',
  className,
  size,
  tone,
  weight,
  face,
  ...props
}) => {
  return <Component className={cn(typographyVariants({ size, tone, weight, face }), className)} {...props} />
}

/** h1 — page / hero title */
const Title: FC<TypographySlotProps> = ({ className, weight = 'bold', face = 'display', tone, ...props }) => (
  <TypographyRoot as='h1' size='2xl' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** h2 — section subtitle */
const Subtitle: FC<TypographySlotProps> = ({ className, weight = 'semibold', face = 'display', tone, ...props }) => (
  <TypographyRoot as='h2' size='xl' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** h3 — block heading */
const Heading: FC<TypographySlotProps> = ({ className, weight = 'medium', face = 'display', tone, ...props }) => (
  <TypographyRoot as='h3' size='lg' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** h4 — sub-block heading */
const Subheading: FC<TypographySlotProps> = ({ className, weight = 'medium', face = 'sans', tone, ...props }) => (
  <TypographyRoot as='h4' size='md' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** h5 — compact label heading */
const Label: FC<TypographySlotProps> = ({ className, weight = 'semibold', face = 'display', tone, ...props }) => (
  <TypographyRoot as='h5' size='sm' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** p — body copy */
const Paragraph: FC<TypographySlotProps> = ({ className, weight = 'regular', face = 'sans', tone, ...props }) => (
  <TypographyRoot as='p' size='sm' weight={weight} face={face} tone={tone} className={cn('leading-relaxed', className)} {...props} />
)

/** span — inline text */
const Text: FC<TypographySlotProps> = ({ className, weight = 'regular', face = 'sans', tone, ...props }) => (
  <TypographyRoot as='span' size='sm' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** small — fine print */
const Small: FC<TypographySlotProps> = ({ className, weight = 'regular', face = 'sans', tone = 'secondary', ...props }) => (
  <TypographyRoot as='small' size='xs' weight={weight} face={face} tone={tone} className={className} {...props} />
)

/** cite — attribution / source */
const Cite: FC<TypographySlotProps> = ({ className, weight = 'medium', face = 'sans', tone = 'secondary', ...props }) => (
  <TypographyRoot as='cite' size='sm' weight={weight} face={face} tone={tone} className={cn('not-italic', className)} {...props} />
)

const Typography = Object.assign(TypographyRoot, {
  Title,
  Subtitle,
  Heading,
  Subheading,
  Label,
  Paragraph,
  Text,
  Small,
  Cite
})

export { Typography, typographyVariants }
export default Typography