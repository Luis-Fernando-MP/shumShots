'use client'

import { cn } from '@common/utils/cn'
import Typography from '@common/ui/Typography'
import useShadowStore, { SHADOW_PRESETS, type ShadowType } from '@views/image-studio/store/shadow/shadow.store'
import { type FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const ShadowPresetsWrapper: FC = () => {
  const type = useShadowStore(s => s.type)
  const applyPreset = useShadowStore(s => s.applyPreset)

  return (
    <SectionBlock title='Estilo de sombra' description='Primero limpio; el resto son presets listos para afinar.'>
      <div className='grid grid-cols-3 gap-2'>
        {SHADOW_PRESETS.map(preset => {
          const active = type === preset.type
          return (
            <button
              key={preset.type}
              type='button'
              onClick={() => applyPreset(preset.type as ShadowType)}
              aria-pressed={active}
              className={cn(
                'group border-border/70 bg-muted/20 hover:border-border hover:bg-muted/40 flex flex-col items-center gap-1.5 rounded-radius border px-1.5 py-2 text-center transition-colors',
                active && 'border-primary bg-secondary/40 ring-primary/40 ring-1'
              )}
            >
              <div className='bg-background/80 relative flex h-14 w-full items-center justify-center overflow-hidden rounded-md'>
                <div
                  className={cn(
                    'size-7 rounded-md transition-colors',
                    preset.type === 'none' ? 'bg-muted-foreground/25' : 'bg-foreground/80'
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

export default ShadowPresetsWrapper
