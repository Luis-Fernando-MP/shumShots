'use client'

import SliderControl from '@/shared/components/SliderControl'
import ColorPicker from '@common/ui/ColorPicker'
import { DUOTONE_PRESETS, resolveDuotoneLayers, resolvePreviewFill } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import PresetCard from './PresetCard'
import SectionBlock from './SectionBlock'

const DuotonePreview: FC<{
  shadow: string
  highlight: string
  intensity: number
  background: string | null
}> = ({ shadow, highlight, intensity, background }) => {
  const active = intensity > 0
  const layers = active ? resolveDuotoneLayers(shadow, highlight, intensity) : null

  return (
    <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
      <div
        className='absolute inset-0'
        style={{
          ...resolvePreviewFill(background),
          filter: active ? 'grayscale(100%) contrast(1.05)' : undefined
        }}
      />
      {layers && (
        <>
          <div className='absolute inset-0' style={layers.shadow} />
          <div className='absolute inset-0' style={layers.highlight} />
        </>
      )}
    </div>
  )
}

const BackgroundDuotoneController: FC = () => {
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
    <SectionBlock title='Duotone / Tint' description='Dos colores estilo Spotify sobre el fondo. Mejor con imagen.'>
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

export default BackgroundDuotoneController
