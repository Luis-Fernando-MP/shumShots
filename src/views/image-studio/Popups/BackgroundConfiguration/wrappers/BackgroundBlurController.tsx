'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { BLUR_PRESETS, isImageBackground, toCssImageUrl } from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { CSSProperties, FC } from 'react'

import SectionBlock from './SectionBlock'

const THEME_FALLBACK: CSSProperties = {
  backgroundImage:
    'linear-gradient(135deg, rgba(var(--tn-primary), 0.9), rgb(var(--bg-secondary)), rgba(var(--tn-secondary), 0.75))'
}

const BlurPreview: FC<{ value: number; background: string | null }> = ({ value, background }) => {
  const blurPx = value === 0 ? 0 : Math.max(1.5, value * 0.35)
  const filter = blurPx > 0 ? `blur(${blurPx}px)` : undefined

  let fillStyle: CSSProperties
  if (background && isImageBackground(background)) {
    fillStyle = {
      backgroundImage: toCssImageUrl(background),
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }
  } else if (background?.includes('gradient')) {
    fillStyle = { backgroundImage: background }
  } else if (background) {
    fillStyle = { backgroundColor: background }
  } else {
    fillStyle = THEME_FALLBACK
  }

  return (
    <div className='bg-muted relative h-16 w-full overflow-hidden rounded-md'>
      <div className='absolute inset-[-12%]' style={{ ...fillStyle, filter }} />
      {!background && (
        <>
          <div
            className='bg-primary/70 absolute top-1/3 left-1/4 size-5 rounded-full'
            style={{ filter: blurPx > 0 ? `blur(${blurPx * 0.55}px)` : undefined }}
          />
          <div
            className='bg-secondary/70 absolute top-1/2 right-1/4 size-3.5 rounded-full'
            style={{ filter: blurPx > 0 ? `blur(${blurPx * 0.55}px)` : undefined }}
          />
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
    <SectionBlock
      title='Blur'
      description='Desenfoca el fondo para separar mejor la imagen principal.'
    >
      <div className='grid grid-cols-2 gap-1.5'>
        {BLUR_PRESETS.map(item => {
          const active = Math.abs(blur - item.value) < 2
          return (
            <Button
              key={item.id}
              type='button'
              variant={active ? 'secondary' : 'outline'}
              size='sm'
              className={cn('flex h-auto flex-col gap-2 px-2 py-2.5', active && 'ring-primary/40 ring-1')}
              onClick={() => setBlur(item.value)}
            >
              <BlurPreview value={item.value} background={background} />
              <span className='text-[11px] font-medium'>{item.label}</span>
            </Button>
          )
        })}
      </div>
      <SliderControl label='Desenfoque' value={blur} onChangeRange={setBlur} min={0} max={40} step={1} />
    </SectionBlock>
  )
}

export default BackgroundBlurController
