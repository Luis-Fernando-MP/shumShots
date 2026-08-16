import { Theme } from '@app/defaults/themes'
import Button from '@common/components/Button'
import { cn } from '@common/utils/cn'
import type { ButtonHTMLAttributes, FC } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  theme: Pick<Theme, 'tn-primary' | 'tn-secondary' | 'bg-primary'>
  selected?: boolean
}

const toCssColor = (color?: string) => {
  if (!color) return 'transparent'
  if (color.startsWith('#') || color.startsWith('rgb') || color.startsWith('hsl')) return color
  return `rgb(${color})`
}

const PaletteSphere: FC<Props> = ({ title, theme, className, selected = false, ...props }) => {
  const swatches = [theme['tn-primary'], theme['tn-secondary'], theme['bg-primary']].filter(
    (color): color is string => Boolean(color)
  )

  return (
    <Button
      size='sm'
      isSelected={selected}
      className={cn('max-w-[9.5rem] justify-start border border-transparent', selected && 'border-primary', className)}
      {...props}
    >
      <span className='flex items-center -space-x-1.5'>
        {swatches.map((color, index) => (
          <span
            key={`${title}-${index}`}
            className='border-border size-3.5 shrink-0 rounded-full border'
            style={{ backgroundColor: toCssColor(color), zIndex: swatches.length - index }}
          />
        ))}
      </span>
      <span className='truncate text-xs font-medium'>{title}</span>
    </Button>
  )
}

export default PaletteSphere
