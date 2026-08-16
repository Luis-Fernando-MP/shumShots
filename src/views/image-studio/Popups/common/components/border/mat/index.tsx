'use client'

import ColorsController from '@common/components/ColorsController'
import SliderControl from '@common/components/SliderControl'
import { Button } from '@common/components/Button'
import Switch from '@common/components/Switch'
import Typography from '@common/components/Typography'
import type { BorderConfigurationState } from '@views/image-studio/Popups/common/components/createBorderStore'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { FC } from 'react'

type Props = {
  borderState: BorderConfigurationState
}

const BorderMat: FC<Props> = ({ borderState }) => {
  const {
    matEnabled,
    matColor,
    matTop,
    matRight,
    matLeft,
    setMatEnabled,
    setMatColor,
    setMatSize
  } = borderState

  const matSize = Math.round((matTop + matRight + matLeft) / 3)

  return (
    <SectionBlock title='Passepartout' description='Marco interno, independiente del stroke.'>
      <div className='flex items-center justify-between gap-3'>
        <Typography.Small tone='secondary' className='text-[10px]'>
          {matEnabled ? 'Activado' : 'Desactivado'}
        </Typography.Small>
        <Switch size='sm' on={matEnabled} onChange={() => setMatEnabled(!matEnabled)} />
      </div>

      {matEnabled && (
        <>
          <ColorsController background={matColor} setBackground={setMatColor} />
          <div className='gap-grid flex items-end'>
            <SliderControl
              label='Inset'
              value={matSize}
              onChangeRange={setMatSize}
              min={0}
              max={80}
              step={1}
            />
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='h-8 shrink-0 px-2.5 text-xs'
              onClick={() => setMatSize(0)}
            >
              Reset
            </Button>
          </div>
        </>
      )}
    </SectionBlock>
  )
}

export default BorderMat
