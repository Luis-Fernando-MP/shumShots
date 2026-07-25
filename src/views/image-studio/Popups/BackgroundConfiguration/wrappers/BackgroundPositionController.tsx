'use client'

import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import {
  type BackgroundPositionPreset,
  POSITION_PRESETS,
  isImageBackground
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import {
  type FC,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef
} from 'react'

const PRESET_OPTIONS: { id: Exclude<BackgroundPositionPreset, 'free'>; label: string }[] = [
  { id: 'center', label: 'Centro' },
  { id: 'top', label: 'Arriba' },
  { id: 'bottom', label: 'Abajo' },
  { id: 'left', label: 'Izquierda' },
  { id: 'right', label: 'Derecha' }
]

const PresetVisual: FC<{ x: number; y: number }> = ({ x, y }) => {
  return (
    <div className='border-border bg-muted/40 relative size-7 rounded-sm border'>
      <div
        className='border-primary bg-primary/30 absolute size-2.5 rounded-[2px] border'
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
  const draggingRef = useRef(false)
  const setPositionRef = useRef(setPosition)
  setPositionRef.current = setPosition

  const hasImage = Boolean(background && isImageBackground(background))

  const updateFromPointer = useCallback((clientX: number, clientY: number) => {
    const node = padRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setPositionRef.current(x, y)
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasImage) {
      setPositionPreset('free')
      return
    }
    draggingRef.current = true
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updateFromPointer(event.clientX, event.clientY)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  useEffect(() => {
    if (hasImage) return
    if (positionPreset === 'center') return
    setPositionPreset('center')
  }, [hasImage, positionPreset, setPositionPreset])

  return (
    <Typography.Block title='Posición' className='gap-grid flex flex-col'>
      <div className='gap-grid grid grid-cols-[1.35fr_1fr]'>
        <div
          className={cn(
            'border-border bg-card relative flex aspect-square flex-col overflow-hidden rounded-radius border',
            positionPreset === 'free' && 'ring-primary ring-2 ring-offset-1'
          )}
        >
          <div
            ref={padRef}
            role='slider'
            aria-label='Posición libre del fondo'
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(positionX)}
            tabIndex={0}
            className={cn(
              'bg-muted relative min-h-0 flex-1 touch-none overflow-hidden outline-none',
              hasImage && 'cursor-grab active:cursor-grabbing'
            )}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {hasImage && background && (
              <div
                className='absolute inset-0 will-change-[background-position]'
                style={{
                  backgroundImage: `url("${background}")`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: `${positionX}% ${positionY}%`
                }}
              />
            )}
            {!hasImage && (
              <div className='text-muted-foreground grid size-full place-content-center px-2 text-center text-[10px] leading-tight'>
                Sube o elige un fondo
              </div>
            )}
            {hasImage && (
              <div
                className='border-foreground/80 pointer-events-none absolute size-3 rounded-full border-2 bg-white/30 shadow-sm'
                style={{
                  left: `${positionX}%`,
                  top: `${positionY}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
          </div>
          <span className='text-muted-foreground border-border border-t px-2 py-1 text-[10px] font-medium'>Free</span>
        </div>

        <div className='grid grid-cols-2 content-start gap-1.5'>
          {PRESET_OPTIONS.map(option => {
            const coords = POSITION_PRESETS[option.id]
            const isActive = positionPreset === option.id
            return (
              <button
                key={option.id}
                type='button'
                className={cn(
                  'border-border bg-card flex aspect-square flex-col items-center justify-center gap-1 rounded-radius border',
                  isActive && 'ring-primary ring-2 ring-offset-1'
                )}
                onClick={() => setPositionPreset(option.id)}
                aria-label={option.label}
              >
                <PresetVisual x={coords.x} y={coords.y} />
                <span className='text-muted-foreground text-[9px] leading-none'>{option.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Typography.Block>
  )
}

export default BackgroundPositionController
