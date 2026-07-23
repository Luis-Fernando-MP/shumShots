import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ElementType, FC, HTMLAttributes, ReactNode } from 'react'

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
    },
    mark: {
      none: '',
      solid: 'underline decoration-solid decoration-primary decoration-[1.5px] underline-offset-[3px]',
      wavy: 'underline decoration-wavy decoration-primary decoration-[1.5px] underline-offset-[3px]',
      dotted:
        'cursor-help italic underline decoration-dotted decoration-primary decoration-[3px] underline-offset-[5px]'
    }
  },
  defaultVariants: {
    size: 'md',
    tone: 'primary',
    weight: 'regular',
    face: 'sans',
    mark: 'none'
  }
})

export interface TypographyProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: ElementType
  href?: string
}

type TypographySlotProps = Omit<TypographyProps, 'as' | 'size'>

export type TypographyLinkProps = TypographySlotProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof TypographySlotProps | 'color'> & {
    href: string
  }

export interface TypographyBlockProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode
  children?: ReactNode
}

const TypographyRoot: FC<TypographyProps> = ({
  as: Component = 'p',
  className,
  size,
  tone,
  weight,
  face,
  mark,
  ...props
}) => {
  return (
    <Component className={cn(typographyVariants({ size, tone, weight, face, mark }), className)} {...props} />
  )
}

const Title: FC<TypographySlotProps> = ({ className, weight = 'bold', face = 'display', tone, mark, ...props }) => (
  <TypographyRoot as='h1' size='2xl' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Subtitle: FC<TypographySlotProps> = ({
  className,
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h2' size='xl' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Heading: FC<TypographySlotProps> = ({
  className,
  weight = 'medium',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h3' size='lg' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Subheading: FC<TypographySlotProps> = ({
  className,
  weight = 'medium',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h4' size='md' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Label: FC<TypographySlotProps> = ({
  className,
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h5' size='sm' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Paragraph: FC<TypographySlotProps> = ({
  className,
  weight = 'regular',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot
    as='p'
    size='sm'
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('leading-relaxed', className)}
    {...props}
  />
)

const Text: FC<TypographySlotProps> = ({
  className,
  weight = 'regular',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='span' size='sm' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Small: FC<TypographySlotProps> = ({
  className,
  weight = 'regular',
  face = 'sans',
  tone = 'secondary',
  mark,
  ...props
}) => (
  <TypographyRoot as='small' size='xs' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

const Cite: FC<TypographySlotProps> = ({
  className,
  weight = 'medium',
  face = 'sans',
  tone = 'secondary',
  mark,
  ...props
}) => (
  <TypographyRoot
    as='cite'
    size='sm'
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('not-italic', className)}
    {...props}
  />
)

const LinkSlot: FC<TypographyLinkProps> = ({
  className,
  weight = 'medium',
  face = 'sans',
  tone = 'primary',
  mark = 'wavy',
  href,
  ...props
}) => (
  <TypographyRoot
    as='a'
    href={href}
    size='sm'
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('text-primary inline', className)}
    {...props}
  />
)

/** Inline emphasis — ex `paragraph-emphasis`. */
const Emphasis: FC<TypographySlotProps> = ({
  className,
  weight = 'medium',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h5' size='sm' weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Inline caution — ex `paragraph-precaution` (`mark="dotted"`). */
const Precaution: FC<TypographySlotProps> = ({
  className,
  weight = 'medium',
  face = 'display',
  tone,
  mark = 'dotted',
  ...props
}) => (
  <TypographyRoot
    as='span'
    size='sm'
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('inline', className)}
    {...props}
  />
)

/** Grouped title + body — section title lives only here via `title`. */
const Block: FC<TypographyBlockProps> = ({ title, children, className, ...props }) => (
  <section className={cn('flex flex-col gap-1', className)} {...props}>
    {typeof title === 'string' ? (
      <Label weight='medium'>{title.startsWith('#') ? title : `# ${title}`}</Label>
    ) : (
      title
    )}
    {children}
  </section>
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
  Cite,
  Link: LinkSlot,
  Emphasis,
  Precaution,
  Block
})

export { Typography, typographyVariants }
export default Typography
