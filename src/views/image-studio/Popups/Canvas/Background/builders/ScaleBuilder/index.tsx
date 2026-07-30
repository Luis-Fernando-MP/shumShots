'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { clampRange, isImageBackground, toCssImageUrl } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { type FC, type PointerEvent as ReactPointerEvent, useRef } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { releasePointerCapture } from '@views/image-studio/Popups/common/components/useIncrementalPadDrag'

const SCALE_PRESETS = [
  { label: '1×', value: 100, isDefault: true },
  { label: '1.25×', value: 125, isDefault: false },
  { label: '1.5×', value: 150, isDefault: false },
  { label: '2×', value: 200, isDefault: false }
]

const SCALE_MIN = 100
const SCALE_MAX = 250
const SCALE_SENSITIVITY = 0.45

const ScaleBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const scale = useBackgroundStore(s => s.scale)
  const positionX = useBackgroundStore(s => s.positionX)
  const positionY = useBackgroundStore(s => s.positionY)
  const setScale = useBackgroundStore(s => s.setScale)

  const lastYRef = useRef(0)
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  const draggingRef = useRef(false)

  if (!background || !isImageBackground(background)) return null

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    lastYRef.current = event.clientY
    scaleRef.current = scale
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const dy = lastYRef.current - event.clientY
    lastYRef.current = event.clientY
    const next = clampRange(scaleRef.current + dy * SCALE_SENSITIVITY, SCALE_MIN, SCALE_MAX)
    scaleRef.current = next
    setScale(next)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    releasePointerCapture(event)
  }

  return (
    <SectionBlock
      title='Escala'
      description='Acerca el fondo sin dejar huecos. El mínimo es cubrir todo el canvas (1×).'
    >
      <div className='gap-grid grid grid-cols-[1.2fr_1fr] items-stretch'>
        <div
          className='bg-muted/40 relative aspect-square touch-none overflow-hidden rounded-radius ring-1 ring-inset ring-border/50 cursor-ns-resize'
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: toCssImageUrl(background),
              backgroundRepeat: 'no-repeat',
              backgroundPosition: `${positionX}% ${positionY}%`,
              backgroundSize: 'cover',
              transform: `scale(${Math.max(1, scale / 100)})`,
              transformOrigin: `${positionX}% ${positionY}%`
            }}
          />
          <div className='bg-primary/10 pointer-events-none absolute inset-3 rounded-radius border border-white/40 backdrop-blur-sm' />
          <div className='pointer-events-none absolute inset-x-2 bottom-2 flex justify-end'>
            <span className='rounded-md bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm'>
              {Math.round(scale)}%
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          {SCALE_PRESETS.map(item => {
            const active = Math.abs(scale - item.value) < 2
            return (
              <Button
                key={item.value}
                type='button'
                variant={active ? 'secondary' : 'outline'}
                size='sm'
                className={cn('h-8 justify-between px-2.5 text-xs', active && 'ring-primary/40 ring-1')}
                onClick={() => setScale(item.value)}
              >
                <span>{item.label}</span>
                {item.isDefault && <span className='text-muted-foreground text-[10px]'>Default</span>}
              </Button>
            )
          })}
        </div>
      </div>
    </SectionBlock>
  )
}

export default ScaleBuilder
