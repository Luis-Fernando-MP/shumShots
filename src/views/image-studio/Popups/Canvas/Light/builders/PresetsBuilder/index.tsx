'use client'

import { Button } from '@common/components/Button'
import SliceContainer from '@common/components/SliceContainer'
import { cn } from '@common/utils/cn'
import { LIGHT_PRESETS, type LightType } from '@views/image-studio/Popups/common/presets/light'
import { defaultLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/initialState'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import type { CanvasLightLayer } from '@views/image-studio/Popups/Canvas/Light/store/light/type.light'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

const selectActiveLight = (s: { layers: CanvasLightLayer[]; activeId: string }) =>
  s.layers.find(layer => layer.id === s.activeId) ?? s.layers[0] ?? defaultLightLayer(1)

const PresetsBuilder: FC = () => {
  const light = useCanvasLightStore(selectActiveLight)
  const applyLightPreset = useCanvasLightStore(s => s.applyLightPreset)

  return (
    <SectionBlock title='Estilos' level={2} description='Elige un preset y afina con el foco y los ajustes.'>
      <SliceContainer maxHeight={150} extendedMaxHeight={360} className='grid grid-cols-2 gap-1.5'>
        {LIGHT_PRESETS.map(preset => {
          const active = light.type === preset.type
          return (
            <Button
              key={preset.type}
              type='button'
              variant='outline'
              isSelected={active}
              size='sm'
              aria-pressed={active}
              onClick={() => applyLightPreset(preset.type as LightType)}
              className={cn(
                'flex h-auto flex-col items-center gap-1.5 rounded-[12px] px-1 py-2',
                active && 'border-primary'
              )}
            >
              <div className='bg-primary relative flex h-12 w-full items-end justify-center overflow-hidden rounded-[8px] px-2 pb-2'>
                <div
                  className={cn('size-6 rounded-[3px]', preset.type === 'none' ? 'bg-primary-foreground/25' : 'bg-card')}
                  style={{ boxShadow: preset.type === 'none' ? 'none' : preset.preview }}
                />
              </div>
              <span
                className={cn(
                  'text-chrome-ui font-semibold leading-none',
                  active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {preset.label}
              </span>
            </Button>
          )
        })}
      </SliceContainer>
    </SectionBlock>
  )
}

export default PresetsBuilder
