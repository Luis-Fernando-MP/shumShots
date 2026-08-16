'use client'

import SliderControl from '@common/components/SliderControl'
import { FILTER_PRESETS, FILTER_SLIDERS, THEME_PREVIEW_FILL, buildFilterCss, isImageBackground, resolvePreviewFill } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { type FC, useState } from 'react'

import Button from '@common/components/Button'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { VisualPresetGrid, VisualPresetTile } from '@views/image-studio/Popups/common/components/VisualPresetGrid'

const FiltersBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const filterPreset = useBackgroundStore(s => s.filterPreset)
  const brightness = useBackgroundStore(s => s.brightness)
  const contrast = useBackgroundStore(s => s.contrast)
  const saturate = useBackgroundStore(s => s.saturate)
  const grayscale = useBackgroundStore(s => s.grayscale)
  const sepia = useBackgroundStore(s => s.sepia)
  const hue = useBackgroundStore(s => s.hue)
  const applyFilterPreset = useBackgroundStore(s => s.applyFilterPreset)
  const setBrightness = useBackgroundStore(s => s.setBrightness)
  const setContrast = useBackgroundStore(s => s.setContrast)
  const setSaturate = useBackgroundStore(s => s.setSaturate)
  const setGrayscale = useBackgroundStore(s => s.setGrayscale)
  const setSepia = useBackgroundStore(s => s.setSepia)
  const setHue = useBackgroundStore(s => s.setHue)

  const [openAdvanced, setOpenAdvanced] = useState(false)
  const values = { brightness, contrast, saturate, grayscale, sepia, hue }
  const setters = {
    brightness: setBrightness,
    contrast: setContrast,
    saturate: setSaturate,
    grayscale: setGrayscale,
    sepia: setSepia,
    hue: setHue
  }
  const fill = background && isImageBackground(background) ? resolvePreviewFill(background) : THEME_PREVIEW_FILL

  return (
    <SectionBlock title='Filtros'>
      <VisualPresetGrid>
        {FILTER_PRESETS.map(item => {
          const filter = buildFilterCss({ ...item.values, blur: 0 })
          const active = filterPreset === item.id
          return (
            <VisualPresetTile
              key={item.id}
              active={active}
              aria-label={item.label}
              onClick={() => applyFilterPreset(item.id)}
            >
              <div className='size-full' style={{ ...fill, filter }} />
            </VisualPresetTile>
          )
        })}
      </VisualPresetGrid>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='h-7 w-fit rounded-[12px] px-2'
        onClick={() => setOpenAdvanced(prev => !prev)}
      >
        {openAdvanced ? 'Menos' : 'Ajuste'}
      </Button>

      {openAdvanced && (
        <div className='flex flex-col gap-2'>
          {FILTER_SLIDERS.map(item => (
            <SliderControl
              key={item.key}
              label={item.label}
              value={values[item.key]}
              onChangeRange={setters[item.key]}
              min={item.min}
              max={item.max}
              step={1}
              unit={item.key === 'hue' ? '°' : '%'}
            />
          ))}
        </div>
      )}
    </SectionBlock>
  )
}

export default FiltersBuilder
