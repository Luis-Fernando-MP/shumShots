'use client'

import { Button } from '@common/components/Button'
import SliceContainer from '@common/components/SliceContainer'
import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import type { FC } from 'react'

type Props = {
  presets: readonly { type: string; label: string; preview: string }[]
  activeType: string
  onSelect: (type: string) => void
  tone?: 'light' | 'shadow'
}

/**
 * Grilla 2-col de estilos de luz o sombra.
 *
 * @param props.tone - Fondo del thumb. Default `light`.
 */
const EffectPresetGrid: FC<Props> = ({ presets, activeType, onSelect, tone = 'light' }) => (
  <SliceContainer maxHeight={150} extendedMaxHeight={360} className='grid grid-cols-2 gap-2'>
    {presets.map(preset => {
      const active = activeType === preset.type
      return (
        <Button
          key={preset.type}
          type='button'
          variant='soft'
          isSelected={active}
          size='sm'
          aria-pressed={active}
          onClick={() => onSelect(preset.type)}
          className='flex h-auto flex-col items-center gap-1.5 rounded-[12px] px-1 py-2'
        >
          <div
            className={cn(
              'relative flex h-12 w-full items-end justify-center overflow-hidden rounded-[8px] px-2 pb-2',
              tone === 'light' ? 'bg-primary' : 'bg-muted'
            )}
          >
            <div
              className={cn(
                'size-6 rounded-[3px]',
                preset.type === 'none'
                  ? tone === 'light'
                    ? 'bg-primary-foreground/25'
                    : 'bg-muted-foreground/30'
                  : 'bg-card'
              )}
              style={{ boxShadow: preset.type === 'none' ? 'none' : preset.preview }}
            />
          </div>
          <Text.caption className={active ? 'text-foreground' : undefined}>{preset.label}</Text.caption>
        </Button>
      )
    })}
  </SliceContainer>
)

export default EffectPresetGrid
