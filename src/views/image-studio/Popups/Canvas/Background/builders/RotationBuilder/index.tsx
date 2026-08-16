'use client'

import SliderControl from '@common/components/SliderControl'
import {
  ROTATION_PRESETS,
  THEME_PREVIEW_FILL,
  isImageBackground,
  resolvePreviewFill
} from '@views/image-studio/utils/backgroundStyle'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import type { FC } from 'react'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { VisualPresetGrid, VisualPresetTile } from '@views/image-studio/Popups/common/components/VisualPresetGrid'

const RotationFill: FC<{ degrees: number; background: string | null }> = ({ degrees, background }) => {
  const base =
    background && isImageBackground(background) ? resolvePreviewFill(background) : THEME_PREVIEW_FILL

  return (
    <div
      className='absolute inset-[12%]'
      style={{
        ...base,
        transform: `rotate(${degrees}deg)`,
        transformOrigin: 'center'
      }}
    />
  )
}

const RotationBuilder: FC = () => {
  const background = useBackgroundStore(s => s.background)
  const rotation = useBackgroundStore(s => s.rotation)
  const setRotation = useBackgroundStore(s => s.setRotation)

  return (
    <SectionBlock title='Rotación'>
      <VisualPresetGrid columns={4}>
        {ROTATION_PRESETS.map(item => {
          const active = Math.abs(rotation - item.value) < 0.5
          return (
            <VisualPresetTile
              key={item.id}
              active={active}
              aria-label={item.label}
              onClick={() => setRotation(item.value)}
            >
              <RotationFill degrees={item.value} background={background} />
            </VisualPresetTile>
          )
        })}
      </VisualPresetGrid>

      <SliderControl
        label='Ángulo'
        value={rotation}
        onChangeRange={setRotation}
        min={-15}
        max={15}
        step={0.5}
        unit='°'
        displayValue={`${rotation > 0 ? '+' : ''}${Number(rotation.toFixed(1))}°`}
      />
    </SectionBlock>
  )
}

export default RotationBuilder
