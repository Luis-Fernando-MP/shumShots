'use client'

import SliderControl from '@/shared/components/SliderControl'
import ColorPicker from '@common/ui/ColorPicker'
import { Button } from '@common/ui/Button'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import {
  type VignettePreset,
  VIGNETTE_PRESETS,
  resolveBackgroundStyle,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { type CSSProperties, type FC, type PointerEvent as ReactPointerEvent, useMemo, useRef } from 'react'

import SectionBlock from './SectionBlock'

const VignettePreview: FC<{
  preset: VignettePreset
  label: string
  active: boolean
  onSelect: () => void
  previewStyle?: CSSProperties | null
}> = ({ label, active, onSelect, previewStyle }) => {
  return (
    <Button
      type='button'
      variant={active ? 'secondary' : 'outline'}
      size='sm'
      onClick={onSelect}
      className={cn('flex h-auto flex-col gap-1.5 px-1 py-2', active && 'ring-primary/40 ring-1')}
    >
      <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
        <div className='from-card via-muted to-secondary/30 absolute inset-0 bg-linear-to-br' />
        {previewStyle && <div className='absolute inset-0' style={previewStyle} />}
      </div>
      <span className='text-[11px] font-medium'>{label}</span>
    </Button>
  )
}

const BackgroundVignetteController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const blendMode = useBackgroundStore(s => s.blendMode)
  const positionX = useBackgroundStore(s => s.positionX)
  const positionY = useBackgroundStore(s => s.positionY)
  const scale = useBackgroundStore(s => s.scale)
  const vignettePreset = useBackgroundStore(s => s.vignettePreset)
  const vignetteIntensity = useBackgroundStore(s => s.vignetteIntensity)
  const vignetteSize = useBackgroundStore(s => s.vignetteSize)
  const vignetteSoftness = useBackgroundStore(s => s.vignetteSoftness)
  const vignetteColor = useBackgroundStore(s => s.vignetteColor)
  const vignetteFocusX = useBackgroundStore(s => s.vignetteFocusX)
  const vignetteFocusY = useBackgroundStore(s => s.vignetteFocusY)
  const applyVignettePreset = useBackgroundStore(s => s.applyVignettePreset)
  const setVignettePreset = useBackgroundStore(s => s.setVignettePreset)
  const setVignetteIntensity = useBackgroundStore(s => s.setVignetteIntensity)
  const setVignetteSize = useBackgroundStore(s => s.setVignetteSize)
  const setVignetteSoftness = useBackgroundStore(s => s.setVignetteSoftness)
  const setVignetteColor = useBackgroundStore(s => s.setVignetteColor)
  const setVignetteFocus = useBackgroundStore(s => s.setVignetteFocus)

  const padRef = useRef<HTMLDivElement>(null)
  const lastRef = useRef({ x: 0, y: 0 })
  const focusRef = useRef({ x: vignetteFocusX, y: vignetteFocusY })
  focusRef.current = { x: vignetteFocusX, y: vignetteFocusY }
  const draggingRef = useRef(false)

  const showEditor = vignettePreset !== 'none'

  const bgFill = useMemo(
    () => resolveBackgroundStyle(background, { blendMode, positionX, positionY, scale }),
    [background, blendMode, positionX, positionY, scale]
  )

  const liveStyle = useMemo(() => {
    if (vignettePreset === 'none') return null
    return resolveVignetteStyle({
      preset: vignettePreset,
      intensity: Math.max(vignetteIntensity, 1),
      size: vignetteSize,
      softness: vignetteSoftness,
      color: vignetteColor,
      focusX: vignetteFocusX,
      focusY: vignetteFocusY
    })
  }, [
    vignetteColor,
    vignetteFocusX,
    vignetteFocusY,
    vignetteIntensity,
    vignettePreset,
    vignetteSize,
    vignetteSoftness
  ])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    lastRef.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    const node = padRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const dx = ((event.clientX - lastRef.current.x) / rect.width) * 100
    const dy = ((event.clientY - lastRef.current.y) / rect.height) * 100
    lastRef.current = { x: event.clientX, y: event.clientY }
    const nextX = Math.min(100, Math.max(0, focusRef.current.x + dx))
    const nextY = Math.min(100, Math.max(0, focusRef.current.y + dy))
    focusRef.current = { x: nextX, y: nextY }
    setVignetteFocus(nextX, nextY)
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <SectionBlock
      title='Viñeta'
      description='Oscurece o modela los bordes. Arrastra el foco y afina alcance/suavizado.'
    >
      <div className='grid grid-cols-3 gap-1.5'>
        <VignettePreview
          preset='none'
          label='Sin viñeta'
          active={vignettePreset === 'none'}
          onSelect={() => {
            setVignettePreset('none')
            setVignetteIntensity(0)
          }}
          previewStyle={null}
        />
        {VIGNETTE_PRESETS.map(item => {
          const style = resolveVignetteStyle({
            preset: item.id,
            intensity: Math.max(50, item.values.intensity),
            size: item.values.size,
            softness: item.values.softness,
            color: item.values.color,
            focusX: item.values.focusX,
            focusY: item.values.focusY
          })
          return (
            <VignettePreview
              key={item.id}
              preset={item.id}
              label={item.label}
              active={vignettePreset === item.id}
              onSelect={() => applyVignettePreset(item.id)}
              previewStyle={style}
            />
          )
        })}
      </div>

      {showEditor && (
        <div className='gap-grid flex flex-col rounded-radius bg-muted/20 p-2 ring-1 ring-inset ring-border/40'>
          <div className='gap-grid flex flex-col'>
            <Typography.Label size='xs' weight='semibold' className='text-foreground tracking-wide'>
              ## Ajuste fino
            </Typography.Label>
            <div
              ref={padRef}
              className='relative aspect-[4/3] touch-none overflow-hidden rounded-radius ring-1 ring-inset ring-border/40 cursor-grab active:cursor-grabbing'
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div
                className='absolute inset-0'
                style={{
                  ...bgFill,
                  transform: scale > 100 ? `scale(${scale / 100})` : undefined,
                  transformOrigin: `${positionX}% ${positionY}%`
                }}
              />
              {liveStyle && <div className='absolute inset-0' style={liveStyle} />}
              <div
                className='bg-primary/10 pointer-events-none absolute size-8 rounded-md border border-white/50 backdrop-blur-sm'
                style={{
                  left: `${vignetteFocusX}%`,
                  top: `${vignetteFocusY}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>

          <div className='gap-grid flex items-end'>
            <ColorPicker
              variant='swatch'
              value={vignetteColor}
              onChange={color => {
                setVignetteColor(color)
              }}
              label='Color viñeta'
              disableAlpha
              className='rounded-md'
            />
            <SliderControl
              label='Intensidad'
              value={vignetteIntensity}
              onChangeRange={setVignetteIntensity}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <SliderControl label='Alcance' value={vignetteSize} onChangeRange={setVignetteSize} min={10} max={80} step={1} />
          <SliderControl
            label='Suavizado'
            value={vignetteSoftness}
            onChangeRange={setVignetteSoftness}
            min={5}
            max={90}
            step={1}
          />
        </div>
      )}
    </SectionBlock>
  )
}

export default BackgroundVignetteController
