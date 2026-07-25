'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const CanvasBorderSizeController: FC = () => {
  const size = useBackgroundBorderStore(s => s.size)
  const type = useBackgroundBorderStore(s => s.type)
  const setSize = useBackgroundBorderStore(s => s.setSize)

  if (type === 'none') return null

  return (
    <SectionBlock title='Grosor' description='Ancho del borde del canvas.'>
      <div className='gap-grid flex items-end'>
        <SliderControl label='Tamaño' value={size} onChangeRange={setSize} min={0} max={40} step={1} />
        <Button type='button' variant='outline' size='sm' className='h-8 shrink-0 px-2.5 text-xs' onClick={() => setSize(4)}>
          Reset
        </Button>
      </div>
    </SectionBlock>
  )
}

export default CanvasBorderSizeController
