'use client'

import { cn } from '@common/utils/cn'
import Typography from '@common/ui/Typography'
import useShadowStore, { LIGHT_PRESETS, type LightType } from '@views/image-studio/store/shadow/shadow.store'
import { type FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const LightPresetsWrapper: FC = () => {
  const lightType = useShadowStore(s => s.lightType)
  const applyLightPreset = useShadowStore(s => s.applyLightPreset)

  return (
    <SectionBlock title='Estilo de luz' description='Primero limpio; el resto ilumina la imagen.'>
      <div className='grid grid-cols-3 gap-2'>
        {LIGHT_PRESETS.map(preset => {
          const active = lightType === preset.type
          return (
            <button
              key={preset.type}
              type='button'
              onClick={() => applyLightPreset(preset.type as LightType)}
              aria-pressed={active}
              className={cn(
                'group border-border/70 bg-muted/20 hover:border-border hover:bg-muted/40 flex flex-col items-center gap-1.5 rounded-radius border px-1.5 py-2 text-center transition-colors',
                active && 'border-primary bg-secondary/40 ring-primary/40 ring-1'
              )}
            >
              <div className='bg-background/80 relative flex h-14 w-full items-center justify-center overflow-hidden rounded-md'>
                <div
                  className={cn(
                    'size-7 rounded-full transition-colors',
                    preset.type === 'none' ? 'bg-muted-foreground/20' : 'bg-foreground/15'
                  )}
                  style={{ boxShadow: active || preset.type !== 'none' ? preset.preview : 'none' }}
                />
              </div>
              <Typography.Small
                className={cn(
                  'text-[10px] leading-none font-medium',
                  active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {preset.label}
              </Typography.Small>
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default LightPresetsWrapper
