'use client'

import SliderControl from '@common/components/SliderControl'
import type { FC } from 'react'

type Props = {
  opacity: number
  size: number
  onOpacity: (opacity: number) => void
  onSize: (size: number) => void
}

/**
 * Sliders de intensidad y alcance compartidos por luz de canvas y de slot.
 *
 * @param props.opacity - 0–1.
 * @param props.size - Alcance 20–100.
 */
const LightAdjustments: FC<Props> = ({ opacity, size, onOpacity, onSize }) => (
  <div className='flex flex-col gap-2'>
    <SliderControl
      label='Intensidad'
      onChangeRange={v => onOpacity(v / 100)}
      value={Math.round(opacity * 100)}
      step={1}
      min={0}
      max={100}
      unit='%'
    />
    <SliderControl
      label='Alcance'
      onChangeRange={onSize}
      value={Math.round(size)}
      step={1}
      min={20}
      max={100}
    />
  </div>
)

export default LightAdjustments
