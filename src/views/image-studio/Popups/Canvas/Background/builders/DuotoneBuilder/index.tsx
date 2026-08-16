'use client'

import SliderControl from '@common/components/SliderControl'
import ColorPicker from '@common/components/ColorPicker'
import {
  DEMO_SCENE_FILL,
  DUOTONE_PRESETS,
  isImageBackground,
  resolveDuotoneLayers,
  resolvePreviewFill
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import PresetCard from '@views/image-studio/Popups/common/components/PresetCard'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const DuotonePreview: FC<{
  shadow: string
  highlight: string
  intensity: number
  background: string | null
}> = ({ shadow, highlight, intensity, background }) => {
  const active = intensity > 0
  const layers = active ? resolveDuotoneLayers(shadow, highlight, intensity) : null
  const base =
    background && isImageBackground(background)
      ? resolvePreviewFill(background)
      : DEMO_SCENE_FILL

  return (
    <div className='bg-muted relative h-14 w-full overflow-hidden rounded-md'>
      <div
        className='absolute inset-0'
        style={{
          ...base,
          filter: active ? 'grayscale(100%) contrast(1.15)' : 'grayscale(30%) contrast(1.05)'
        }}
      />
      {layers && (
        <>
          <div className='absolute inset-0' style={layers.shadow} />
          <div className='absolute inset-0' style={layers.highlight} />
        </>
      )}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/25 to-transparent' />
    </div>
  )
}

const DuotoneBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const duotonePreset = useBackgroundStore(s => s.duotonePreset)
  const duotoneIntensity = useBackgroundStore(s => s.duotoneIntensity)
  const duotoneShadow = useBackgroundStore(s => s.duotoneShadow)
  const duotoneHighlight = useBackgroundStore(s => s.duotoneHighlight)
  const applyDuotonePreset = useBackgroundStore(s => s.applyDuotonePreset)
  const setDuotoneIntensity = useBackgroundStore(s => s.setDuotoneIntensity)
  const setDuotoneShadow = useBackgroundStore(s => s.setDuotoneShadow)
  const setDuotoneHighlight = useBackgroundStore(s => s.setDuotoneHighlight)

  const showFine = duotoneIntensity > 0 || duotonePreset !== 'none'

  return (
    <SectionBlock title='Duotone / Tint' description='Looks de dos colores. La preview usa una escena demo para comparar.'>
      <div className='grid grid-cols-3 gap-1.5'>
        {DUOTONE_PRESETS.map(item => {
          const active =
            item.id === 'none' ? duotonePreset === 'none' || duotoneIntensity === 0 : duotonePreset === item.id
          return (
            <PresetCard key={item.id} active={active} onClick={() => applyDuotonePreset(item.id)}>
              <DuotonePreview
                shadow={item.shadow}
                highlight={item.highlight}
                intensity={item.intensity}
                background={background}
              />
              <span className='text-[11px] font-medium'>{item.label}</span>
            </PresetCard>
          )
        })}
      </div>

      {showFine && (
        <div className='gap-grid flex items-end'>
          <ColorPicker
            variant='swatch'
            value={duotoneShadow}
            onChange={setDuotoneShadow}
            label='Sombra'
            disableAlpha
            className='rounded-md'
          />
          <ColorPicker
            variant='swatch'
            value={duotoneHighlight}
            onChange={setDuotoneHighlight}
            label='Highlight'
            disableAlpha
            className='rounded-md'
          />
          <SliderControl
            label='Intensidad'
            value={duotoneIntensity}
            onChangeRange={setDuotoneIntensity}
            min={0}
            max={100}
            step={1}
          />
        </div>
      )}
    </SectionBlock>
  )
}

export default DuotoneBuilder
