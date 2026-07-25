'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import useBackgroundStore from '@views/image-studio/store/background/background.store'
import type { FC } from 'react'

import SectionBlock from './SectionBlock'

const BackgroundRotationController: FC = () => {
  const rotation = useBackgroundStore(s => s.rotation)
  const setRotation = useBackgroundStore(s => s.setRotation)

  return (
    <SectionBlock
      title='Rotación'
      description='Giro fino del fondo (±15°). Útil para composiciones dinámicas.'
    >
      <div className='gap-grid flex items-end'>
        <SliderControl
          label='Ángulo'
          value={rotation}
          onChangeRange={setRotation}
          min={-15}
          max={15}
          step={0.5}
          displayValue={`${rotation > 0 ? '+' : ''}${Number(rotation.toFixed(1))}°`}
        />
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8 shrink-0 px-2.5 text-xs'
          onClick={() => setRotation(0)}
          disabled={rotation === 0}
        >
          0°
        </Button>
      </div>
    </SectionBlock>
  )
}

export default BackgroundRotationController
