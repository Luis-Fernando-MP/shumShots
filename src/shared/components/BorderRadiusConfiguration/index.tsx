import { IBorderRadiusStore } from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import type { FC } from 'react'

import DefaultBorders from '../DefaultBorders'
import IndividualBorderController from '../IndividualBorderController'
import SliderControl from '../SliderControl'

interface Props {
  borderState: IBorderRadiusStore
}

const MAX_RADIUS = 320

const BorderRadiusConfiguration: FC<Props> = ({ borderState }) => {
  const { borderRadius, setBorderRadius, borderSmooth, setBorderSmooth } = borderState

  return (
    <article className='gap-grid flex flex-col'>
      <DefaultBorders borderValue={borderRadius} changeBorder={setBorderRadius} />
      <SliderControl
        label='Redondeado'
        onChangeRange={setBorderRadius}
        value={borderRadius}
        min={0}
        max={MAX_RADIUS}
        step={10}
      />
      <IndividualBorderController {...borderState} />
      <SliderControl
        label='Smooth'
        onChangeRange={setBorderSmooth}
        value={borderSmooth}
        min={0}
        max={100}
        step={1}
        displayValue={`${Math.round(borderSmooth)}%`}
      />
    </article>
  )
}

export default BorderRadiusConfiguration
