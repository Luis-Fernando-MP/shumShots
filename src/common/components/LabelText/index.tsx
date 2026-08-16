import type { FC, JSX } from 'react'

interface Props {
  children?: string
  Icon?: JSX.Element
  className?: string
  type?: 'luminosity' | 'darken'
}

const LabelText: FC<Props> = ({ children, Icon, type = 'luminosity', className = '' }) => {
  return (
    <div
      className={`text-foreground pointer-events-none inline-flex w-max shrink-0 items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs leading-none font-medium whitespace-nowrap select-none ${
        type === 'luminosity' ? 'border-background bg-muted' : 'border-border bg-background'
      } ${className}`}
    >
      {Icon}
      {children && <span>{children}</span>}
    </div>
  )
}

export default LabelText
