'use client'

import SliderControl from '@/shared/components/SliderControl'
import { cn } from '@common/utils/cn'
import { BLUR_PRESETS, resolvePreviewFill } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import PresetCard from './PresetCard'
import SectionBlock from './SectionBlock'

const BlurPreview: FC<{ value: number; background: string | null }> = ({ value, background }) => {
  const blurPx = value === 0 ? 0 : Math.max(1.5, value * 0.35)
  const filter = blurPx > 0 ? `blur(${blurPx}px)` : undefined
  const accentFilter = blurPx > 0 ? `blur(${blurPx * 0.55}px)` : undefined

  return (
    <div className='bg-muted relative h-16 w-full overflow-hidden rounded-md'>
      <div className='absolute inset-[-12%]' style={{ ...resolvePreviewFill(background), filter }} />
      {!background && (
        <>
          <div className='bg-primary/70 absolute top-1/3 left-1/4 size-5 rounded-full' style={{ filter: accentFilter }} />
          <div className='bg-secondary/70 absolute top-1/2 right-1/4 size-3.5 rounded-full' style={{ filter: accentFilter }} />
        </>
      )}
    </div>
  )
}

const BackgroundBlurController: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const blur = useBackgroundStore(s => s.blur)
  const setBlur = useBackgroundStore(s => s.setBlur)

  return (
    <SectionBlock title='Blur' description='Desenfoca el fondo para separar mejor la imagen principal.'>
      <div className='grid grid-cols-2 gap-1.5'>
        {BLUR_PRESETS.map(item => {
          const active = Math.abs(blur - item.value) < 2
          return (
            <PresetCard
              key={item.id}
              active={active}
              onClick={() => setBlur(item.value)}
              className={cn('gap-2 px-2 py-2.5')}
            >
              <BlurPreview value={item.value} background={background} />
              <span className='text-[11px] font-medium'>{item.label}</span>
            </PresetCard>
          )
        })}
      </div>
      <SliderControl label='Desenfoque' value={blur} onChangeRange={setBlur} min={0} max={40} step={1} />
    </SectionBlock>
  )
}

export default BackgroundBlurController
