import Button from '@/shared/ui/Button'
import { IBorderRadiusStore } from '@views/image-studio/store/background/backgroundRadius.store'
import { MaximizeIcon, RotateCcwIcon, ScaleIcon } from 'lucide-react'
import { type FC } from 'react'

import RenderInputBorders from './RenderInputBorders'

interface Props extends Omit<IBorderRadiusStore, 'getStyleBorderRadius'> {}

const IndividualBorderController: FC<Props> = props => {
  const { activeIndividualBorder, setActiveIndividualBorder, setBorderRadius, borderRadius, ...borders } = props

  const { setBorderLBRadius, setBorderLTRadius, setBorderRTRadius, setBorderRBRadius } = borders

  const handleBalance = () => {
    const average = (borders.borderLTRadius + borders.borderRTRadius + borders.borderLBRadius + borders.borderRBRadius) / 4
    const refactorAverage = Math.round(average)
    setBorderLBRadius(refactorAverage)
    setBorderLTRadius(refactorAverage)
    setBorderRTRadius(refactorAverage)
    setBorderRBRadius(refactorAverage)
  }

  const handleEquals = () => {
    setBorderLBRadius(borderRadius)
    setBorderLTRadius(borderRadius)
    setBorderRTRadius(borderRadius)
    setBorderRBRadius(borderRadius)
  }

  return (
    <section className='flex flex-col gap-2'>
      <h5>Detallado</h5>
      <Button active={activeIndividualBorder} onClick={() => setActiveIndividualBorder(!activeIndividualBorder)}>
        <MaximizeIcon />
        <h5>Bordes individuales</h5>
      </Button>

      {activeIndividualBorder && (
        <>
          <div className='flex flex-row flex-wrap items-center gap-2'>
            <RenderInputBorders {...borders} />
          </div>

          <div className='flex flex-row items-center gap-2'>
            <Button onClick={handleBalance}>
              <ScaleIcon />
              <h5>Equilibrar</h5>
            </Button>
            <Button onClick={handleEquals}>
              <RotateCcwIcon />
              <h5>Restablecer</h5>
            </Button>
          </div>
        </>
      )}
    </section>
  )
}

export default IndividualBorderController
