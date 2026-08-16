import { monacoFonts } from '@common/components/monaco'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import { CheckIcon } from 'lucide-react'
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
        'group relative flex min-h-[5.5rem] flex-col items-stretch gap-2 rounded-[12px] border px-2.5 py-2.5 text-left transition-colors',
        'border-border/50 bg-muted/40 hover:bg-muted/70',
        'focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2',
        selected && 'border-primary bg-primary/15 hover:bg-primary/20',
        className
      )}
      {...props}
    >
      {selected && (
        <span className='bg-primary text-semantic-primary absolute top-1.5 right-1.5 inline-flex size-4 items-center justify-center rounded-full'>
          <CheckIcon className='size-2.5' strokeWidth={3} aria-hidden />
        </span>
      )}

      <Text.caption className={cn('pr-5', selected && 'text-foreground/75')}>{title}</Text.caption>

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
