'use client'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { LightStackMode } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import { Button } from '@common/components/Button'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

const OPTIONS: { id: LightStackMode; title: string; description: string }[] = [
  {
    id: 'above',
    title: 'Sobre imágenes',
    description: 'La luz cubre el fondo y los slots.'
  },
  {
    id: 'below',
    title: 'Bajo imágenes',
    description: 'La luz queda entre el fondo y los slots.'
  }
]

const StackBuilder: FC = () => {
  const stackMode = useCanvasLightStore(s => s.stackMode)
  const setStackMode = useCanvasLightStore(s => s.setStackMode)

  return (
    <SectionBlock
      title='Apilado'
      description='Define si la luz del canvas va por encima o por debajo de las imágenes.'
    >
      <div className='grid grid-cols-2 gap-1.5'>
        {OPTIONS.map(option => {
          const active = stackMode === option.id
          return (
            <Button
              key={option.id}
              type='button'
              variant={active ? 'secondary' : 'outline'}
              size='sm'
              aria-pressed={active}
              className={cn(
                'flex h-auto flex-col items-start gap-0.5 px-2.5 py-2 text-left',
                active && 'border-primary'
              )}
              onClick={() => setStackMode(option.id)}
            >
              <span className='text-xs font-medium'>{option.title}</span>
              <span className='text-muted-foreground text-[10px] leading-snug font-normal'>
                {option.description}
              </span>
            </Button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default StackBuilder
