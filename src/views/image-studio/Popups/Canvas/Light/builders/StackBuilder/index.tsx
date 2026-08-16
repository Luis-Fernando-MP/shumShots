'use client'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { LightStackMode } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import { Button } from '@common/components/Button'
import type { FC } from 'react'

const OPTIONS: { id: LightStackMode; title: string; tooltip: string }[] = [
  { id: 'above', title: 'Sobre imágenes', tooltip: 'La luz cubre el fondo y los slots.' },
  { id: 'below', title: 'Bajo imágenes', tooltip: 'La luz queda entre el fondo y los slots.' }
]

const StackBuilder: FC = () => {
  const stackMode = useCanvasLightStore(s => s.stackMode)
  const setStackMode = useCanvasLightStore(s => s.setStackMode)

  return (
    <SectionBlock
      title='Apilado'
      description='Define si la luz del canvas va por encima o por debajo de las imágenes.'
    >
      <div className='grid grid-cols-2 gap-2'>
        {OPTIONS.map(option => {
          const active = stackMode === option.id
          return (
            <Button
              key={option.id}
              type='button'
              variant='soft'
              isSelected={active}
              size='sm'
              aria-pressed={active}
              tooltip={option.tooltip}
              className='h-9 rounded-[12px] px-2.5'
              onClick={() => setStackMode(option.id)}
            >
              {option.title}
            </Button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default StackBuilder
