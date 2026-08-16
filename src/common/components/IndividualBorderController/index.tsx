import { Button } from '@common/components/Button'
import { IBorderRadiusStore } from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import { MaximizeIcon, RotateCcwIcon, ScaleIcon } from 'lucide-react'
import { type FC } from 'react'

import RenderInputBorders from './RenderInputBorders'

interface Props extends Omit<IBorderRadiusStore, 'getStyleBorderRadius' | 'resetBackgroundRadius'> {}

const IndividualBorderController: FC<Props> = props => {
  const { activeIndividualBorder, setActiveIndividualBorder, setBorderRadius, borderRadius, ...borders } = props
  const { setBorderLBRadius, setBorderLTRadius, setBorderRTRadius, setBorderRBRadius } = borders

  const handleBalance = () => {
    const average = Math.round(
      (borders.borderLTRadius + borders.borderRTRadius + borders.borderLBRadius + borders.borderRBRadius) / 4
    )
    setBorderLBRadius(average)
    setBorderLTRadius(average)
    setBorderRTRadius(average)
    setBorderRBRadius(average)
  }

  const handleEquals = () => {
    setBorderLBRadius(borderRadius)
    setBorderLTRadius(borderRadius)
    setBorderRTRadius(borderRadius)
    setBorderRBRadius(borderRadius)
  }

  return (
    <section className='flex flex-col gap-2'>
      <Button
        type='button'
        variant='outline'
        isSelected={activeIndividualBorder}
        size='sm'
        className='h-8 w-fit gap-1.5 px-3 text-xs'
        onClick={() => setActiveIndividualBorder(!activeIndividualBorder)}
      >
        <span>Bordes individuales</span>
        <MaximizeIcon className='size-3.5' />
      </Button>

      {activeIndividualBorder && (
        <>
          <div className='flex flex-row flex-wrap items-center gap-2'>
            <RenderInputBorders {...borders} />
          </div>
          <div className='flex flex-row flex-wrap items-center gap-1.5'>
            <Button type='button' variant='outline' size='sm' className='h-8 w-fit gap-1.5 px-3 text-xs' onClick={handleBalance}>
              <span>Equilibrar</span>
              <ScaleIcon className='size-3.5' />
            </Button>
            <Button type='button' variant='outline' size='sm' className='h-8 w-fit gap-1.5 px-3 text-xs' onClick={handleEquals}>
              <span>Restablecer</span>
              <RotateCcwIcon className='size-3.5' />
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

export default IndividualBorderController
