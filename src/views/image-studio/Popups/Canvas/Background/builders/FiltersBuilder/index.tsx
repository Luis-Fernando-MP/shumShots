'use client'

import SliderControl from '@common/components/SliderControl'
import { Button } from '@common/components/Button'
import { cn } from '@common/utils/cn'
import { FILTER_PRESETS, FILTER_SLIDERS, buildFilterCss, resolvePreviewFill } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { ChevronDownIcon } from 'lucide-react'
import { type FC, useState } from 'react'

import PresetCard from '@views/image-studio/Popups/common/components/PresetCard'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

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
  const resetFilters = useBackgroundStore(s => s.resetFilters)

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

  return (
    <SectionBlock
      title='Filtros'
      description='Looks rápidos para el fondo. Abre el control fino si quieres ajustar a mano.'
    >
      <div className='grid grid-cols-3 gap-1.5'>
        {FILTER_PRESETS.map(item => {
          const filter = buildFilterCss({ ...item.values, blur: 0 })
          return (
            <PresetCard key={item.id} active={filterPreset === item.id} onClick={() => applyFilterPreset(item.id)}>
              <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
                <div className='absolute inset-0' style={{ ...resolvePreviewFill(background), filter }} />
              </div>
              <span className='text-[11px] font-medium'>{item.label}</span>
            </PresetCard>
          )
        })}
      </div>

      <Button
        type='button'
        variant='outline'
        size='sm'
        className='h-8 w-fit gap-1.5 px-3 text-xs'
        onClick={() => setOpenAdvanced(prev => !prev)}
      >
        <span>Control avanzado</span>
        <ChevronDownIcon className={cn('size-3.5', openAdvanced && 'rotate-180')} />
      </Button>

      {openAdvanced && (
        <div className='gap-grid flex flex-col'>
          <div className='flex justify-end'>
            <button
              type='button'
              className='text-muted-foreground hover:text-foreground text-[10px] underline-offset-2 hover:underline'
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
          {FILTER_SLIDERS.map(item => (
            <SliderControl
              key={item.key}
              label={item.label}
              value={values[item.key]}
              onChangeRange={setters[item.key]}
              min={item.min}
              max={item.max}
              step={1}
            />
          ))}
        </div>
      )}
    </SectionBlock>
  )
}

export default FiltersBuilder
