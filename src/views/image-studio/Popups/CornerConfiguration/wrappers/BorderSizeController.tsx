'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import useImagesBorderStore from '@views/image-studio/store/images/useImagesBorderStore'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const BorderSizeController: FC = () => {
  const size = useImagesBorderStore(s => s.size)
  const type = useImagesBorderStore(s => s.type)
  const setSize = useImagesBorderStore(s => s.setSize)

  if (type === 'none') return null

  return (
    <SectionBlock title='Grosor' description='Ancho del borde de la imagen.'>
      <div className='gap-grid flex items-end'>
        <SliderControl label='Tamaño' value={size} onChangeRange={setSize} min={0} max={40} step={1} />
        <Button type='button' variant='outline' size='sm' className='h-8 shrink-0 px-2.5 text-xs' onClick={() => setSize(5)}>
          Reset
        </Button>
      </div>
    </SectionBlock>
  )
}

export default BorderSizeController
