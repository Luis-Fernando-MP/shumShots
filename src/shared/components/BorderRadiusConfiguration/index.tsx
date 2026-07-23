import { IBorderRadiusStore } from '@views/image-studio/store/background/backgroundRadius.store'
import type { FC } from 'react'

import DefaultBorders from '../DefaultBorders'
import IndividualBorderController from '../IndividualBorderController'
import SliderControl from '../SliderControl'
interface Props {
  borderState: IBorderRadiusStore
}

const MAX_RADIUS = 320

const BorderRadiusConfiguration: FC<Props> = ({ borderState }) => {
  const { borderRadius, setBorderRadius } = borderState

  return (
    <article className='flex flex-col gap-2'>
      <DefaultBorders borderValue={borderRadius} changeBorder={setBorderRadius} />
      <SliderControl
        label='Redondeado'
        onChangeRange={setBorderRadius}
        value={borderRadius}
        min={0}
        max={MAX_RADIUS}
        step={10}
        width={'280px'}
      />
      <IndividualBorderController {...borderState} />
    </article>
  )
}

export default BorderRadiusConfiguration
