import { IBorderRadiusStore } from '@views/image-studio/store/background/backgroundRadius.store'
import Corner from '@/shared/assets/Corner'
import IconInput from '@/shared/ui/IconInput'
import type { FC } from 'react'

interface Props
  extends Omit<
    IBorderRadiusStore,
    'borderRadius' | 'setBorderRadius' | 'getStyleBorderRadius' | 'activeIndividualBorder' | 'setActiveIndividualBorder'
  > {}

const RenderInputBorders: FC<Props> = ({
  borderLTRadius,
  borderRTRadius,
  borderLBRadius,
  borderRBRadius,
  setBorderRTRadius,
  setBorderLBRadius,
  setBorderRBRadius,
  setBorderLTRadius
}) => {
  return (
    <>
      <IconInput
        Icon={<Corner />}
        type='number'
        label='px'
        value={borderLTRadius}
        onChange={e => setBorderLTRadius(Number(e.target.value))}
        width='70px'
        min={0}
        max={320}
        step={10}
      />

      <IconInput
        Icon={<Corner rotate={90} />}
        type='number'
        label='px'
        value={borderRTRadius}
        onChange={e => setBorderRTRadius(Number(e.target.value))}
        width='70px'
        min={0}
        max={320}
        step={10}
      />

      <IconInput
        Icon={<Corner rotate={270} />}
        type='number'
        label='px'
        value={borderRBRadius}
        onChange={e => setBorderRBRadius(Number(e.target.value))}
        width='70px'
        min={0}
        max={320}
        step={10}
      />

      <IconInput
        Icon={<Corner rotate={180} />}
        type='number'
        label='px'
        value={borderLBRadius}
        onChange={e => setBorderLBRadius(Number(e.target.value))}
        width='70px'
        min={0}
        max={320}
        step={10}
      />
    </>
  )
}

export default RenderInputBorders
