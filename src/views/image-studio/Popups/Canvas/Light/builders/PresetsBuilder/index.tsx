'use client'

import { Button } from '@common/components/Button'
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
      <div className='grid grid-cols-3 gap-1.5'>
        {LIGHT_PRESETS.map(preset => {
          const active = light.type === preset.type
          return (
            <Button
              key={preset.type}
              type='button'
              variant={active ? 'secondary' : 'outline'}
              size='sm'
              aria-pressed={active}
              onClick={() => applyLightPreset(preset.type as LightType)}
              className={cn(
                'flex h-auto flex-col items-center gap-1.5 px-1 py-2',
                active && 'border-primary'
              )}
            >
              <div className='bg-muted/40 flex h-10 w-full items-center justify-center rounded-sm'>
                <div
                  className={cn(
                    'size-5 rounded-sm',
                    preset.type === 'none' ? 'bg-muted-foreground/25' : 'bg-primary/40'
                  )}
                  style={{ boxShadow: preset.type === 'none' ? 'none' : preset.preview }}
                />
              </div>
              <span
                className={cn(
                  'text-xs leading-none font-medium',
                  active ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {preset.label}
              </span>
            </Button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default PresetsBuilder
