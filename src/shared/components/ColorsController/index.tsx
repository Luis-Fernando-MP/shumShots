'use client'

import { basicColors } from '@/app/defaults/colors'
import ColorPicker from '@common/ui/ColorPicker'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

interface Props {
  background: string | null
  setBackground: (background: string) => void
}

const ColorsController: FC<Props> = ({ background, setBackground }) => {
  return (
    <section className='gap-grid flex flex-col'>
      <div className='flex flex-row flex-wrap overflow-hidden rounded-radius'>
        {basicColors.map(color => {
          const isActive = background === color
          return (
            <button
              type='button'
              className={cn('size-[30px] aspect-square', isActive && 'ring-primary ring-2 ring-offset-1')}
              style={{ backgroundColor: color }}
              key={color}
              aria-label={`Color ${color}`}
              onClick={() => setBackground(color)}
            />
          )
        })}
      </div>
      <ColorPicker value={background} onChange={setBackground} />
    </section>
  )
}

export default ColorsController
