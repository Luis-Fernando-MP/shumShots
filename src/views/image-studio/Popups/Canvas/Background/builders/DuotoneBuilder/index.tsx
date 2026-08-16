'use client'

import ColorPicker from '@common/components/ColorPicker'
import SliderControl from '@common/components/SliderControl'
import {
  DUOTONE_PRESETS,
  THEME_PREVIEW_FILL,
  isImageBackground,
  resolveDuotoneLayers,
  resolvePreviewFill
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { CSSProperties, FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { VisualPresetGrid, VisualPresetTile } from '@views/image-studio/Popups/common/components/VisualPresetGrid'

const DuotoneFill: FC<{
  shadow: string
  highlight: string
  intensity: number
  background: string | null
}> = ({ shadow, highlight, intensity, background }) => {
  const layers = intensity > 0 ? resolveDuotoneLayers(shadow, highlight, intensity) : null
  const base = background && isImageBackground(background) ? resolvePreviewFill(background) : THEME_PREVIEW_FILL

  return (
    <>
      <div className='absolute inset-0' style={{ ...base, filter: 'grayscale(100%) contrast(1.12)' }} />
      {layers && (
        <>
          <div className='absolute inset-0' style={layers.shadow as CSSProperties} />
          <div className='absolute inset-0' style={layers.highlight as CSSProperties} />
        </>
      )}
    </>
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
    <SectionBlock title='Duotone'>
      <VisualPresetGrid>
        {DUOTONE_PRESETS.map(item => {
          const active =
            item.id === 'none' ? duotonePreset === 'none' || duotoneIntensity === 0 : duotonePreset === item.id
          return (
            <VisualPresetTile
              key={item.id}
              active={active}
              aria-label={item.label}
              onClick={() => applyDuotonePreset(item.id)}
            >
              <DuotoneFill
                shadow={item.shadow}
                highlight={item.highlight}
                intensity={item.intensity}
                background={background}
              />
            </VisualPresetTile>
          )
        })}
      </VisualPresetGrid>

      {showFine && (
        <div className='flex items-center gap-2'>
          <ColorPicker variant='swatch' value={duotoneShadow} onChange={setDuotoneShadow} label='Sombra' disableAlpha />
          <ColorPicker
            variant='swatch'
            value={duotoneHighlight}
            onChange={setDuotoneHighlight}
            label='Highlight'
            disableAlpha
          />
          <SliderControl
            label='Tint'
            value={duotoneIntensity}
            onChangeRange={setDuotoneIntensity}
            min={0}
            max={100}
            step={1}
            unit='%'
          />
        </div>
      )}
    </SectionBlock>
  )
}

export default DuotoneBuilder
