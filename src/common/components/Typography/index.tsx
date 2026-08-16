import { cn } from '@common/utils/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ElementType, FC, HTMLAttributes, ReactNode } from 'react'

/**
 * Hierarchy (size + weight — titles heavy, body light):
 * Title 2xl/bold → Subtitle xl/semibold → Heading lg/semibold →
 * Subheading md/medium → Label md/semibold → body sm/regular → Small xs
 */
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
    size: 'sm',
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

type TypographySlotProps = Omit<TypographyProps, 'as'>

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

/** Page / hero title — `2xl` + bold. */
const Title: FC<TypographySlotProps> = ({
  className,
  size = '2xl',
  weight = 'bold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h1' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Section subtitle under a title — `xl` + semibold. */
const Subtitle: FC<TypographySlotProps> = ({
  className,
  size = 'xl',
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h2' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Mid-level heading — `lg` + semibold. */
const Heading: FC<TypographySlotProps> = ({
  className,
  size = 'lg',
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h3' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Lower heading / group label — `md` + medium. */
const Subheading: FC<TypographySlotProps> = ({
  className,
  size = 'md',
  weight = 'medium',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h4' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Compact label / block title (`# …`) — `md` + semibold. */
const Label: FC<TypographySlotProps> = ({
  className,
  size = 'md',
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h5' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Body copy — `sm`. */
const Paragraph: FC<TypographySlotProps> = ({
  className,
  size = 'sm',
  weight = 'regular',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot
    as='p'
    size={size}
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('leading-relaxed', className)}
    {...props}
  />
)

/** Inline body text — `sm`. */
const Text: FC<TypographySlotProps> = ({
  className,
  size = 'sm',
  weight = 'regular',
  face = 'sans',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='span' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Fine print / captions — `xs`. */
const Small: FC<TypographySlotProps> = ({
  className,
  size = 'xs',
  weight = 'regular',
  face = 'sans',
  tone = 'secondary',
  mark,
  ...props
}) => (
  <TypographyRoot as='small' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Examples / secondary cites — `xs`. */
const Cite: FC<TypographySlotProps> = ({
  className,
  size = 'xs',
  weight = 'medium',
  face = 'sans',
  tone = 'secondary',
  mark,
  ...props
}) => (
  <TypographyRoot
    as='cite'
    size={size}
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('not-italic', className)}
    {...props}
  />
)

/** Inline link — `sm`. */
const LinkSlot: FC<TypographyLinkProps> = ({
  className,
  size = 'sm',
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
    size={size}
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('text-primary inline', className)}
    {...props}
  />
)

/** Field / item emphasis title — `sm` + semibold (heavier than body). */
const Emphasis: FC<TypographySlotProps> = ({
  className,
  size = 'sm',
  weight = 'semibold',
  face = 'display',
  tone,
  mark,
  ...props
}) => (
  <TypographyRoot as='h5' size={size} weight={weight} face={face} tone={tone} mark={mark} className={className} {...props} />
)

/** Inline caution note — `xs` + dotted mark. */
const Precaution: FC<TypographySlotProps> = ({
  className,
  size = 'xs',
  weight = 'medium',
  face = 'display',
  tone,
  mark = 'dotted',
  ...props
}) => (
  <TypographyRoot
    as='span'
    size={size}
    weight={weight}
    face={face}
    tone={tone}
    mark={mark}
    className={cn('inline', className)}
    {...props}
  />
)

/** Grouped title + body — section title via `title` (`Label` / md + semibold). */
const Block: FC<TypographyBlockProps> = ({ title, children, className, ...props }) => (
  <section className={cn('flex flex-col gap-1', className)} {...props}>
    {typeof title === 'string' ? (
      <Label>{typeof title === 'string' && title.startsWith('#') ? title.replace(/^#+\s*/, '') : title}</Label>
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
