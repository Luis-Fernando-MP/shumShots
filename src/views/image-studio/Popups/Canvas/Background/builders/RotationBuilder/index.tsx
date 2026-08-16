'use client'

import SliderControl from '@common/components/SliderControl'
import { cn } from '@common/utils/cn'
import {
  ROTATION_PRESETS,
  THEME_PREVIEW_FILL,
  isImageBackground,
  resolvePreviewFill
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const RotationPreview: FC<{ degrees: number; background: string | null; active: boolean }> = ({
  degrees,
  background,
  active
}) => {
  const base =
    background && isImageBackground(background) ? resolvePreviewFill(background) : THEME_PREVIEW_FILL

  return (
    <div
      className={cn(
        'relative h-16 w-full overflow-hidden rounded-[12px] border',
        active ? 'border-primary' : 'border-border/60'
      )}
    >
      <div
        className='absolute inset-[12%]'
        style={{
          ...base,
          transform: `rotate(${degrees}deg)`,
          transformOrigin: 'center'
        }}
      />
    </div>
  )
}

const RotationBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const rotation = useBackgroundStore(s => s.rotation)
  const setRotation = useBackgroundStore(s => s.setRotation)

  return (
    <SectionBlock title='Rotación'>
      <div className='grid grid-cols-4 gap-1.5'>
        {ROTATION_PRESETS.map(item => {
          const active = Math.abs(rotation - item.value) < 0.5
          return (
            <button
              key={item.id}
              type='button'
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setRotation(item.value)}
            >
              <RotationPreview degrees={item.value} background={background} active={active} />
            </button>
          )
        })}
      </div>

      <SliderControl
        label='Ángulo'
        value={rotation}
        onChangeRange={setRotation}
        min={-15}
        max={15}
        step={0.5}
        displayValue={`${rotation > 0 ? '+' : ''}${Number(rotation.toFixed(1))}°`}
      />
    </SectionBlock>
  )
}

export default RotationBuilder
