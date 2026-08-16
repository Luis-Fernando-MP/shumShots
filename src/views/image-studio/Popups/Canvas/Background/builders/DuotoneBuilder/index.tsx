'use client'

import ColorPicker from '@common/components/ColorPicker'
import SliceContainer from '@common/components/SliceContainer'
import SliderControl from '@common/components/SliderControl'
import {
  DUOTONE_PRESETS,
  THEME_PREVIEW_FILL,
  isImageBackground,
  resolveDuotoneLayers,
  resolvePreviewFill
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const DuotonePreview: FC<{
  shadow: string
  highlight: string
  intensity: number
  background: string | null
  active: boolean
}> = ({ shadow, highlight, intensity, background, active }) => {
  const layers = intensity > 0 ? resolveDuotoneLayers(shadow, highlight, intensity) : null
  const base = background && isImageBackground(background) ? resolvePreviewFill(background) : THEME_PREVIEW_FILL

  return (
    <div
      className={cn(
        'relative h-12 w-full overflow-hidden rounded-[12px] border',
        active ? 'border-primary' : 'border-border/50'
      )}
    >
      <div className='absolute inset-0' style={{ ...base, filter: 'grayscale(100%) contrast(1.12)' }} />
      {layers && (
        <>
          <div className='absolute inset-0' style={layers.shadow} />
          <div className='absolute inset-0' style={layers.highlight} />
        </>
      )}
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
    <SectionBlock title='Duotone'>
      <SliceContainer maxHeight={140} extendedMaxHeight={420} collapsedVisible={6} className='grid grid-cols-3 gap-1.5'>
        {DUOTONE_PRESETS.map(item => {
          const active =
            item.id === 'none' ? duotonePreset === 'none' || duotoneIntensity === 0 : duotonePreset === item.id
          return (
            <button
              key={item.id}
              type='button'
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => applyDuotonePreset(item.id)}
            >
              <DuotonePreview
                shadow={item.shadow}
                highlight={item.highlight}
                intensity={item.intensity}
                background={background}
                active={active}
              />
            </button>
          )
        })}
      </SliceContainer>

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
          />
        </div>
      )}
    </SectionBlock>
  )
}

export default DuotoneBuilder
