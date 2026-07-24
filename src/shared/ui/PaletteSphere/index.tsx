import { Theme } from '@app/defaults/themes'
import { cn } from '@common/utils/cn'
import type { ButtonHTMLAttributes, FC } from 'react'

import Button from '../Button'

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
      isSelected={selected}
      className={cn('max-w-40 justify-start border-1 border-transparent', className, selected && 'border-primary')}
      {...props}
    >
      <span className='flex items-center -space-x-1.5'>
        {swatches.map((color, index) => (
          <span
            key={`${title}-${index}`}
            className='border-border size-4 shrink-0 rounded-full border'
            style={{ backgroundColor: toCssColor(color), zIndex: swatches.length - index }}
          />
        ))}
      </span>
      <span className='truncate text-sm font-medium'>{title}</span>
    </Button>
  )
}

export default PaletteSphere
