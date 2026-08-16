'use client'

import ColorPicker from '@common/components/ColorPicker'
import SliderControl from '@common/components/SliderControl'
import Text from '@common/components/Text'
import {
  VIGNETTE_PRESETS,
  type VignettePoints,
  clampPercent,
  resolvePreviewFill,
  resolveVignetteStyle
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { type FC, useMemo, useRef } from 'react'

import Button from '@common/components/Button'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { VisualPresetGrid, VisualPresetTile } from '@views/image-studio/Popups/common/components/VisualPresetGrid'
import { useIncrementalPadDrag } from '@views/image-studio/Popups/common/components/useIncrementalPadDrag'

const POINT_OPTIONS: VignettePoints[] = [1, 2, 3]

const VignetteBuilder: FC = () => {
  const vignettePreset = useBackgroundStore(s => s.vignettePreset)
  const vignetteIntensity = useBackgroundStore(s => s.vignetteIntensity)
  const vignetteSize = useBackgroundStore(s => s.vignetteSize)
  const vignetteSoftness = useBackgroundStore(s => s.vignetteSoftness)
  const vignetteColor = useBackgroundStore(s => s.vignetteColor)
  const vignetteFocusX = useBackgroundStore(s => s.vignetteFocusX)
  const vignetteFocusY = useBackgroundStore(s => s.vignetteFocusY)
  const vignettePoints = useBackgroundStore(s => s.vignettePoints)
  const vignetteFocus2X = useBackgroundStore(s => s.vignetteFocus2X)
  const vignetteFocus2Y = useBackgroundStore(s => s.vignetteFocus2Y)
  const vignetteFocus3X = useBackgroundStore(s => s.vignetteFocus3X)
  const vignetteFocus3Y = useBackgroundStore(s => s.vignetteFocus3Y)
  const applyVignettePreset = useBackgroundStore(s => s.applyVignettePreset)
  const setVignettePreset = useBackgroundStore(s => s.setVignettePreset)
  const setVignetteIntensity = useBackgroundStore(s => s.setVignetteIntensity)
  const setVignetteSize = useBackgroundStore(s => s.setVignetteSize)
  const setVignetteSoftness = useBackgroundStore(s => s.setVignetteSoftness)
  const setVignetteColor = useBackgroundStore(s => s.setVignetteColor)
  const setVignetteFocus = useBackgroundStore(s => s.setVignetteFocus)
  const setVignettePoints = useBackgroundStore(s => s.setVignettePoints)

  const focusRef = useRef({ x: vignetteFocusX, y: vignetteFocusY })
  focusRef.current = { x: vignetteFocusX, y: vignetteFocusY }

  const { padRef, padHandlers } = useIncrementalPadDrag((dxPct, dyPct) => {
    const nextX = clampPercent(focusRef.current.x + dxPct)
    const nextY = clampPercent(focusRef.current.y + dyPct)
    focusRef.current = { x: nextX, y: nextY }
    setVignetteFocus(nextX, nextY)
  })

  const showEditor = vignettePreset !== 'none'

  const liveStyle = useMemo(() => {
    if (vignettePreset === 'none') return null
    return resolveVignetteStyle({
      preset: vignettePreset,
      intensity: Math.max(vignetteIntensity, 1),
      size: vignetteSize,
      softness: vignetteSoftness,
      color: vignetteColor,
      focusX: vignetteFocusX,
      focusY: vignetteFocusY,
      points: vignettePoints,
      focus2X: vignetteFocus2X,
      focus2Y: vignetteFocus2Y,
      focus3X: vignetteFocus3X,
      focus3Y: vignetteFocus3Y
    })
  }, [
    vignetteColor,
    vignetteFocus2X,
    vignetteFocus2Y,
    vignetteFocus3X,
    vignetteFocus3Y,
    vignetteFocusX,
    vignetteFocusY,
    vignetteIntensity,
    vignettePoints,
    vignettePreset,
    vignetteSize,
    vignetteSoftness
  ])

  return (
    <SectionBlock title='Viñeta'>
      <VisualPresetGrid>
        <VisualPresetTile
          active={vignettePreset === 'none'}
          onClick={() => {
            setVignettePreset('none')
            setVignetteIntensity(0)
          }}
        >
          <div className='absolute inset-0' style={resolvePreviewFill(null)} />
        </VisualPresetTile>

        {VIGNETTE_PRESETS.map(item => {
          const style = resolveVignetteStyle({
            preset: item.id,
            intensity: Math.max(50, item.values.intensity),
            size: item.values.size,
            softness: item.values.softness,
            color: item.values.color,
            focusX: item.values.focusX,
            focusY: item.values.focusY,
            points: item.values.points,
            focus2X: item.values.focus2X,
            focus2Y: item.values.focus2Y,
            focus3X: item.values.focus3X,
            focus3Y: item.values.focus3Y
          })
          const active = vignettePreset === item.id
          return (
            <VisualPresetTile
              key={item.id}
              active={active}
              aria-label={item.label}
              onClick={() => applyVignettePreset(item.id)}
            >
              <div className='absolute inset-0' style={resolvePreviewFill(null)} />
              {style && <div className='absolute inset-0' style={style} />}
            </VisualPresetTile>
          )
        })}
      </VisualPresetGrid>

      {showEditor && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-1'>
            <Text.caption>Puntos</Text.caption>
            {POINT_OPTIONS.map(count => (
              <Button
                key={count}
                type='button'
                size='sm'
                variant='soft'
                isSelected={vignettePoints === count}
                className='min-w-8'
                onClick={() => setVignettePoints(count)}
              >
                {count}
              </Button>
            ))}
          </div>

          <div
            ref={padRef}
            className='relative aspect-[4/3] cursor-grab touch-none overflow-hidden rounded-[12px] active:cursor-grabbing'
            {...padHandlers}
          >
            <div className='absolute inset-0' style={resolvePreviewFill(null)} />
            {liveStyle && <div className='absolute inset-0' style={liveStyle} />}
          </div>

          <ColorPicker variant='swatch' value={vignetteColor} onChange={setVignetteColor} label='Color' disableAlpha />
          <SliderControl label='Intensidad' value={vignetteIntensity} onChangeRange={setVignetteIntensity} min={0} max={100} step={1} />
          <SliderControl label='Alcance' value={vignetteSize} onChangeRange={setVignetteSize} min={10} max={80} step={1} />
          <SliderControl label='Suavizado' value={vignetteSoftness} onChangeRange={setVignetteSoftness} min={5} max={90} step={1} />
        </div>
      )}
    </SectionBlock>
  )
}

export default VignetteBuilder
