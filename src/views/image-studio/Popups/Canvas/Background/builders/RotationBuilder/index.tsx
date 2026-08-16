'use client'

import SliderControl from '@common/components/SliderControl'
import {
  DEMO_SCENE_FILL,
  ROTATION_PRESETS,
  isImageBackground,
  resolvePreviewFill,
  rotationCoverScale
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import PresetCard from '@views/image-studio/Popups/common/components/PresetCard'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'

const RotationPreview: FC<{ degrees: number; background: string | null }> = ({ degrees, background }) => {
  const base =
    background && isImageBackground(background) ? resolvePreviewFill(background) : DEMO_SCENE_FILL
  const cover = rotationCoverScale(degrees)

  return (
    <div className='bg-muted relative h-14 w-full overflow-hidden rounded-md'>
      <div
        className='absolute inset-[-18%]'
        style={{
          ...base,
          transform: `rotate(${degrees}deg) scale(${cover})`,
          transformOrigin: 'center'
        }}
      />
      <div className='pointer-events-none absolute inset-2 rounded-sm border border-white/35 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]' />
    </div>
  )
}

const RotationBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const rotation = useBackgroundStore(s => s.rotation)
  const setRotation = useBackgroundStore(s => s.setRotation)

  return (
    <SectionBlock title='Rotación' description='Elige un tilt rápido o afina el ángulo (±15°).'>
      <div className='grid grid-cols-2 gap-1.5'>
        {ROTATION_PRESETS.map(item => {
          const active = Math.abs(rotation - item.value) < 0.5
          return (
            <PresetCard
              key={item.id}
              active={active}
              onClick={() => setRotation(item.value)}
              className='gap-1 px-1 py-1.5'
            >
              <RotationPreview degrees={item.value} background={background} />
              <span className='text-[10px] font-medium'>{item.label}</span>
            </PresetCard>
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
