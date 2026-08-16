'use client'

import { cn } from '@common/utils/cn'
import type { HTMLAttributes, ReactNode } from 'react'

type TextSlotProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode
}

/**
 * Tipografía de chrome y sidebars. Pesos y tamaños distintos por rol.
 *
 * @example
 * ```tsx
 * <Text.title>Lienzo</Text.title>
 * <Text.subtitle>Fondo, borde y luz</Text.subtitle>
 * ```
 */
const Title = ({ className, ...props }: TextSlotProps) => (
  <h2
    className={cn('font-display text-foreground text-chrome-title m-0 font-bold tracking-tight', className)}
    {...props}
  />
)

const Subtitle = ({ className, ...props }: TextSlotProps) => (
  <p className={cn('text-muted-foreground text-chrome-ui m-0 font-normal leading-snug', className)} {...props} />
)

const Heading = ({ className, ...props }: TextSlotProps) => (
  <h3
    className={cn('font-display text-foreground text-chrome-heading m-0 font-semibold tracking-tight', className)}
    {...props}
  />
)

const Paragraph = ({ className, ...props }: TextSlotProps) => (
  <p className={cn('text-foreground text-chrome-ui m-0 font-normal leading-relaxed', className)} {...props} />
)

const Caption = ({ className, ...props }: TextSlotProps) => (
  <p className={cn('text-muted-foreground text-chrome-meta m-0 font-normal leading-snug', className)} {...props} />
)

const Emphasis = ({ className, ...props }: TextSlotProps) => (
  <span className={cn('text-foreground text-chrome-ui font-semibold', className)} {...props} />
)

Title.displayName = 'Text.title'
Subtitle.displayName = 'Text.subtitle'
Heading.displayName = 'Text.heading'
Paragraph.displayName = 'Text.paragraph'
Caption.displayName = 'Text.caption'
Emphasis.displayName = 'Text.emphasis'

const Text = {
  title: Title,
  subtitle: Subtitle,
  heading: Heading,
  paragraph: Paragraph,
  caption: Caption,
  emphasis: Emphasis
}

export default Text
