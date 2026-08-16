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
  <section className={cn('flex flex-col gap-3', className)}>
    <div className='grid grid-cols-6 gap-2'>
      {basicColors.map(color => {
        const isActive = background === color
        return (
          <button
            type='button'
            key={color}
            aria-label={`Color ${color}`}
            onClick={() => setBackground(color)}
            className={cn(
              'size-8 justify-self-center rounded-full transition-transform',
              isActive ? 'ring-primary ring-2 ring-offset-2 ring-offset-background scale-105' : 'hover:scale-105'
            )}
            style={{ backgroundColor: color }}
          />
        )
      })}
      <ColorPicker
        variant='swatch'
        value={background}
        onChange={setBackground}
        label='Color'
        className='size-8 justify-self-center rounded-full'
      />
    </div>
  </section>
)

export default ColorsController
