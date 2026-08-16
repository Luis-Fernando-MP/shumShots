'use client'

import SliderControl from '@common/components/SliderControl'
import ColorPicker from '@common/components/ColorPicker'
import Text from '@common/components/Text'
import {
  VIGNETTE_PRESETS,
  clampPercent,
  resolveBackgroundStyle,
  resolvePreviewFill,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { type FC, useMemo, useRef } from 'react'

import PresetCard from '@views/image-studio/Popups/common/components/PresetCard'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { useIncrementalPadDrag } from '@views/image-studio/Popups/common/components/useIncrementalPadDrag'

const VignetteBuilder: FC = () => {
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

  const focusRef = useRef({ x: vignetteFocusX, y: vignetteFocusY })
  focusRef.current = { x: vignetteFocusX, y: vignetteFocusY }

  const { padRef, padHandlers } = useIncrementalPadDrag((dxPct, dyPct) => {
    const nextX = clampPercent(focusRef.current.x + dxPct)
    const nextY = clampPercent(focusRef.current.y + dyPct)
    focusRef.current = { x: nextX, y: nextY }
    setVignetteFocus(nextX, nextY)
  })

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

  return (
    <SectionBlock
      title='Viñeta'
      description='Oscurece o modela los bordes. Arrastra el foco y afina alcance/suavizado.'
    >
      <div className='grid grid-cols-3 gap-1.5'>
        <PresetCard
          active={vignettePreset === 'none'}
          onClick={() => {
            setVignettePreset('none')
            setVignetteIntensity(0)
          }}
        >
          <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
            <div className='absolute inset-0' style={resolvePreviewFill(null)} />
          </div>
          <span className='text-[11px] font-medium'>Sin viñeta</span>
        </PresetCard>

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
            <PresetCard key={item.id} active={vignettePreset === item.id} onClick={() => applyVignettePreset(item.id)}>
              <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
                <div className='absolute inset-0' style={resolvePreviewFill(null)} />
                {style && <div className='absolute inset-0' style={style} />}
              </div>
              <span className='text-[11px] font-medium'>{item.label}</span>
            </PresetCard>
          )
        })}
      </div>

      {showEditor && (
        <div className='gap-grid flex flex-col rounded-radius bg-muted/20 p-2 ring-1 ring-inset ring-border/40'>
          <Text.heading>Ajuste fino</Text.heading>
          <div
            ref={padRef}
            className='relative aspect-[4/3] touch-none overflow-hidden rounded-radius ring-1 ring-inset ring-border/40 cursor-grab active:cursor-grabbing'
            {...padHandlers}
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

          <div className='gap-grid flex items-end'>
            <ColorPicker
              variant='swatch'
              value={vignetteColor}
              onChange={setVignetteColor}
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

export default VignetteBuilder
