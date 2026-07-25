'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { FILTER_PRESETS, buildFilterCss, isImageBackground } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import { ChevronDownIcon } from 'lucide-react'
import { type FC, useState } from 'react'

import SectionBlock from './SectionBlock'

const BackgroundFiltersController: FC = () => {
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
  const previewSrc = background && isImageBackground(background) ? background : null

  return (
    <SectionBlock
      title='Filtros'
      description='Looks rápidos para el fondo. Abre el control fino si quieres ajustar a mano.'
    >
      <div className='grid grid-cols-3 gap-1.5'>
        {FILTER_PRESETS.map(item => {
          const active = filterPreset === item.id
          const filter = buildFilterCss({ ...item.values, blur: 0 })
          return (
            <Button
              key={item.id}
              type='button'
              variant={active ? 'secondary' : 'outline'}
              size='sm'
              className={cn('flex h-auto flex-col gap-1.5 px-1 py-2', active && 'ring-primary/40 ring-1')}
              onClick={() => applyFilterPreset(item.id)}
            >
              <div className='bg-muted relative h-12 w-full overflow-hidden rounded-md'>
                {previewSrc && (
                  <div
                    className='absolute inset-0'
                    style={{
                      backgroundImage: `url("${previewSrc}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      filter
                    }}
                  />
                )}
                {!previewSrc && (
                  <div
                    className='from-primary/40 via-card to-secondary/40 absolute inset-0 bg-linear-to-br'
                    style={{ filter }}
                  />
                )}
              </div>
              <span className='text-[11px] font-medium'>{item.label}</span>
            </Button>
          )
        })}
      </div>

      <div>
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
      </div>

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
          <SliderControl label='Brillo' value={brightness} onChangeRange={setBrightness} min={0} max={200} step={1} />
          <SliderControl label='Contraste' value={contrast} onChangeRange={setContrast} min={0} max={200} step={1} />
          <SliderControl label='Saturación' value={saturate} onChangeRange={setSaturate} min={0} max={200} step={1} />
          <SliderControl label='Escala de grises' value={grayscale} onChangeRange={setGrayscale} min={0} max={100} step={1} />
          <SliderControl label='Sepia' value={sepia} onChangeRange={setSepia} min={0} max={100} step={1} />
          <SliderControl label='Matiz' value={hue} onChangeRange={setHue} min={0} max={360} step={1} />
        </div>
      )}
    </SectionBlock>
  )
}

export default BackgroundFiltersController
