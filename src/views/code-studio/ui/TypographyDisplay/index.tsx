import { monacoFonts } from '@common/components/monaco'
import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import type { ButtonHTMLAttributes, FC } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  font: (typeof monacoFonts)[keyof typeof monacoFonts]
  title: string
  selected?: boolean
}

/**
 * Card de tipografía Monaco: nombre, muestra Aa y glifos.
 */
const TypographyDisplay: FC<Props> = ({ font, title, className = '', selected = false, ...props }) => {
  const { className: fontClassName } = font

  return (
    <button
      type='button'
      aria-pressed={selected}
      className={cn(
        'group relative flex min-h-[5.5rem] flex-col items-stretch gap-2 px-2.5 py-2.5 text-left',
        'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
        chromeTile(selected),
        className
      )}
      {...props}
    >
      <Text.caption>{title}</Text.caption>

      <span className={cn('text-foreground text-[1.35rem] leading-none tracking-tight antialiased', fontClassName)}>
        Aa
      </span>

      <span
        className={cn(
          'text-muted-foreground text-chrome-meta leading-tight antialiased',
          selected && 'text-foreground/80',
          fontClassName
        )}
      >
        {'=> {} [] ();'}
      </span>
    </button>
  )
}

export default TypographyDisplay
