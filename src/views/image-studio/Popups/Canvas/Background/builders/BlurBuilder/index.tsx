'use client'

import SliderControl from '@common/components/SliderControl'
import { cn } from '@common/utils/cn'
import { BLUR_PRESETS } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const BlurPreview: FC<{ value: number; active: boolean }> = ({ value, active }) => (
  <div
    className={cn(
      'relative h-14 w-full overflow-hidden rounded-[12px] border',
      active ? 'border-primary' : 'border-border/50'
    )}
  >
    <div className='from-primary/80 via-secondary/50 to-muted absolute inset-0 bg-linear-to-br' />
    <div
      className='bg-primary absolute top-[18%] left-[22%] size-7 rounded-full'
      style={{ filter: value ? `blur(${Math.max(1, value * 0.22)}px)` : undefined }}
    />
    <div
      className='bg-foreground/80 absolute right-[18%] bottom-[22%] size-4 rounded-full'
      style={{ filter: value ? `blur(${Math.max(0.6, value * 0.14)}px)` : undefined }}
    />
  </div>
)

const BlurBuilder: FC = () => {
  const blur = useBackgroundStore(s => s.blur)
  const setBlur = useBackgroundStore(s => s.setBlur)

  return (
    <SectionBlock title='Blur'>
      <div className='grid grid-cols-4 gap-1.5'>
        {BLUR_PRESETS.map(item => {
          const active = Math.abs(blur - item.value) < 2
          return (
            <button
              key={item.id}
              type='button'
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setBlur(item.value)}
            >
              <BlurPreview value={item.value} active={active} />
            </button>
          )
        })}
      </div>
      <SliderControl label='Desenfoque' value={blur} onChangeRange={setBlur} min={0} max={40} step={1} displayValue={`${blur}px`} />
    </SectionBlock>
  )
}

export default BlurBuilder
