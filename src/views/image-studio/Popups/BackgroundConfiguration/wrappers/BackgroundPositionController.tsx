'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import {
  type BackgroundPositionPreset,
  POSITION_PRESETS,
  isImageBackground
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { type FC, type PointerEvent as ReactPointerEvent, useRef } from 'react'

import SectionBlock from './SectionBlock'

const PRESET_OPTIONS: { id: Exclude<BackgroundPositionPreset, 'free'>; label: string }[] = [
  { id: 'center', label: 'Centro' },
  { id: 'top', label: 'Arriba' },
  { id: 'bottom', label: 'Abajo' },
  { id: 'left', label: 'Izquierda' },
  { id: 'right', label: 'Derecha' }
]

const PresetVisual: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div className='border-border/60 bg-muted/40 relative size-8 overflow-hidden rounded-md'>
      <div
        className='border-primary/70 bg-primary/20 absolute aspect-[4/3] w-[44%] rounded-sm border backdrop-blur-[1px]'
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  )
}

const BackgroundPositionController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const positionPreset = useBackgroundStore(s => s.positionPreset)
  const positionX = useBackgroundStore(s => s.positionX)
  const positionY = useBackgroundStore(s => s.positionY)
  const setPositionPreset = useBackgroundStore(s => s.setPositionPreset)
  const setPosition = useBackgroundStore(s => s.setPosition)

  const padRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null)

  const hasImage = Boolean(background && isImageBackground(background))
  if (!hasImage || !background) return null

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      posX: positionX,
      posY: positionY
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setPositionPreset('free')
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const node = padRef.current
    if (!drag || !node) return
    const rect = node.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const dx = ((event.clientX - drag.x) / rect.width) * 100
    const dy = ((event.clientY - drag.y) / rect.height) * 100
    setPosition(drag.posX + dx, drag.posY + dy)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <SectionBlock
      title='Posición'
      description='Define el punto focal del fondo. Arrastra el encuadre o elige un preset.'
    >
      <div className='gap-grid grid grid-cols-[1.35fr_1fr]'>
        <div
          ref={padRef}
          className={cn(
            'bg-muted/40 relative aspect-square touch-none overflow-hidden rounded-radius outline-none',
            'cursor-grab active:cursor-grabbing ring-border/50 ring-1 ring-inset',
            positionPreset === 'free' && 'ring-primary/70'
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("${background}")`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${positionX}% ${positionY}%`
            }}
          />
          <div
            className='bg-primary/10 pointer-events-none absolute aspect-[4/3] w-[40%] rounded-radius border border-white/50 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] backdrop-blur-md'
            style={{
              left: `${positionX}%`,
              top: `${positionY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>

        <div className='grid grid-cols-2 content-start gap-1.5'>
          {PRESET_OPTIONS.map(option => {
            const coords = POSITION_PRESETS[option.id]
            const isActive = positionPreset === option.id
            return (
              <Button
                key={option.id}
                type='button'
                variant={isActive ? 'secondary' : 'outline'}
                size='sm'
                className={cn(
                  'flex h-auto flex-col gap-1.5 px-1.5 py-2',
                  isActive && 'ring-primary/50 ring-1'
                )}
                onClick={() => setPositionPreset(option.id)}
              >
                <PresetVisual x={coords.x} y={coords.y} />
                <span className='text-[11px] leading-none font-medium'>{option.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </SectionBlock>
  )
}

export default BackgroundPositionController
