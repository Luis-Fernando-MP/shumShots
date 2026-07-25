'use client'

import { basicColors } from '@/app/defaults/colors'
import ColorPicker from '@common/ui/ColorPicker'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

interface Props {
  background: string | null
  setBackground: (background: string) => void
  className?: string
}

const ColorsController: FC<Props> = ({ background, setBackground, className }) => {
  return (
    <section className={cn('gap-grid flex flex-col', className)}>
      <div className='border-border/40 grid grid-cols-9 overflow-hidden rounded-md ring-1 ring-border/40'>
        {basicColors.map(color => {
          const isActive = background === color
          return (
            <button
              type='button'
              className={cn(
                'aspect-square w-full transition-transform',
                isActive && 'z-10 ring-2 ring-primary ring-inset'
              )}
              style={{ backgroundColor: color }}
              key={color}
              aria-label={`Color ${color}`}
              onClick={() => setBackground(color)}
            />
          )
        })}
      </div>
      <ColorPicker
        variant='swatch'
        value={background}
        onChange={setBackground}
        label='Color personalizado'
        className='rounded-md'
      />
    </section>
  )
}

export default ColorsController
