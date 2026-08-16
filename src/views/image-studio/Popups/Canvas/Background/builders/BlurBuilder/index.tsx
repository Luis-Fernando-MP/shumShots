'use client'

import SliderControl from '@common/components/SliderControl'
import { BLUR_PRESETS } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { VisualPresetGrid, VisualPresetTile } from '@views/image-studio/Popups/common/components/VisualPresetGrid'

const BlurFill: FC<{ value: number }> = ({ value }) => (
  <>
    <div className='from-primary/80 via-secondary/50 to-muted absolute inset-0 bg-linear-to-br' />
    <div
      className='bg-primary absolute top-[18%] left-[22%] size-7 rounded-full'
      style={{ filter: value ? `blur(${Math.max(1, value * 0.22)}px)` : undefined }}
    />
    <div
      className='bg-foreground/80 absolute right-[18%] bottom-[22%] size-4 rounded-full'
      style={{ filter: value ? `blur(${Math.max(0.6, value * 0.14)}px)` : undefined }}
    />
  </>
)

const BlurBuilder: FC = () => {
  const blur = useBackgroundStore(s => s.blur)
  const setBlur = useBackgroundStore(s => s.setBlur)

  return (
    <SectionBlock title='Blur'>
      <VisualPresetGrid columns={4}>
        {BLUR_PRESETS.map(item => {
          const active = Math.abs(blur - item.value) < 2
          return (
            <VisualPresetTile
              key={item.id}
              active={active}
              aria-label={item.label}
              onClick={() => setBlur(item.value)}
            >
              <BlurFill value={item.value} />
            </VisualPresetTile>
          )
        })}
      </VisualPresetGrid>
      <SliderControl label='Desenfoque' value={blur} onChangeRange={setBlur} min={0} max={40} step={1} unit='px' />
    </SectionBlock>
  )
}

export default BlurBuilder
