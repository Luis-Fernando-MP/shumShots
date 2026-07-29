'use client'

import SliderControl from '@/shared/components/SliderControl'
import { Button } from '@common/ui/Button'
import { useActiveTabId } from '@views/image-studio/shared/components/tabs'
import { useCornerBorderAdapter } from '@views/image-studio/store/corner/adapters'
import type { FC } from 'react'

import SectionBlock from '../../BackgroundConfiguration/wrappers/SectionBlock'

const BorderSizeController: FC = () => {
  const tabId = useActiveTabId()
  const { size, type, setSize } = useCornerBorderAdapter(tabId)

  if (type === 'none') return null

  return (
    <SectionBlock title='Grosor' description='Ancho del borde de la imagen.'>
      <div className='gap-grid flex items-end'>
        <SliderControl label='Tamaño' value={size} onChangeRange={setSize} min={0} max={40} step={1} />
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-8 shrink-0 px-2.5 text-xs'
          onClick={() => setSize(5)}
        >
          Reset
        </Button>
      </div>
    </SectionBlock>
  )
}

export default BorderSizeController
