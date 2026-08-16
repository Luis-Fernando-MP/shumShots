'use client'

import { basicColors } from '@app/defaults/colors'
import ColorPicker from '@common/components/ColorPicker'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

interface Props {
  background: string | null
  setBackground: (background: string) => void
  className?: string
}

const ColorsController: FC<Props> = ({ background, setBackground, className }) => (
  <section className={cn('gap-grid flex flex-col', className)}>
    <div className='grid grid-cols-5 gap-2'>
      {basicColors.map(color => {
        const isActive = background === color
        return (
          <button
            type='button'
            key={color}
            aria-label={`Color ${color}`}
            onClick={() => setBackground(color)}
            className={cn(
              'size-8 justify-self-center rounded-full border transition-transform',
              isActive ? 'border-primary scale-110 ring-2 ring-primary/40' : 'border-border/70 hover:scale-105'
            )}
            style={{ backgroundColor: color }}
          />
        )
      })}
    </div>
    <ColorPicker
      variant='swatch'
      value={background}
      onChange={setBackground}
      label='Color personalizado'
      className='rounded-[12px]'
    />
  </section>
)

export default ColorsController
