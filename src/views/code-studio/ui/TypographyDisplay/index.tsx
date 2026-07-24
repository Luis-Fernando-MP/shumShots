import { monacoFonts } from '@/shared/fonts/monaco-fonts'
import { cn } from '@common/utils/cn'
import type { ButtonHTMLAttributes, FC } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  font: typeof monacoFonts.anonymous_Pro
  title: string
  selected?: boolean
}

/** Font preview card for Monaco typography selection. */
const TypographyDisplay: FC<Props> = ({ font, title, className = '', selected = false, ...props }) => {
  const { className: fontClassName } = font

  return (
    <button
      type='button'
      className={cn(
        'flex h-[88px] w-[7.5rem] flex-col items-start justify-center gap-1 rounded-md border border-transparent bg-card px-2.5 py-2 text-left transition-colors',
        'hover:bg-muted/60',
        selected && 'border-primary bg-primary/20',
        fontClassName,
        'antialiased',
        className
      )}
      {...props}
    >
      <span className={cn('text-muted-foreground text-[10px] leading-none', selected && 'text-foreground/80')}>PIXIS</span>
      <span className={cn('text-foreground text-sm leading-tight font-medium', fontClassName)}>{title}</span>
      <span className={cn('text-muted-foreground text-[10px] leading-none', selected && 'text-foreground/80')}>
        {'=> {} [] ()'}
      </span>
    </button>
  )
}

export default TypographyDisplay
