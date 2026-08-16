'use client'

import SliderControl from '@common/components/SliderControl'
import { Button } from '@common/components/Button'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import type { BorderConfigurationState } from '@views/image-studio/Popups/common/components/createBorderStore'
import type { FC } from 'react'

type Props = {
  size: number
  type: BorderConfigurationState['type']
  setSize: (size: number) => void
  defaultSize?: number
  title?: string
  description?: string
}

const BorderSize: FC<Props> = ({
  size,
  type,
  setSize,
  defaultSize = 4,
  title = 'Grosor',
  description = 'Ancho del borde.'
}) => {
  if (type === 'none') return null

  return (
    <SectionBlock title={title} description={description}>
      <div className='gap-grid flex items-end'>
        <SliderControl label='Tamaño' value={size} onChangeRange={setSize} min={0} max={40} step={1} />
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8 shrink-0 px-2.5 text-xs'
          onClick={() => setSize(defaultSize)}
        >
          Reset
        </Button>
      </div>
    </SectionBlock>
  )
}

export default BorderSize
