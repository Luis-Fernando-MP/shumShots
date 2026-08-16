'use client'

import Popup from '@common/components/Popup'
import { Button } from '@common/components/Button'
import Separator from '@common/components/Separator'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import { LayoutGridIcon } from 'lucide-react'
import { type FC, Fragment } from 'react'

import { purgeRemovedSlots } from './builders/CountBuilder'
import SECTIONS from './sections'
import { SLOT_QUANTITY_CONFIG } from './slotQuantity'
import usePicturesStore from './store/images-count/pictures'

/**
 * Popup para gestionar la cantidad de imágenes (slots) en el lienzo.
 * 
 * Permite cambiar entre 1 y 5 slots, ajustando el layout automáticamente.
 * 
 * @returns El componente de popup para la cuadrícula de imágenes.
 */
const ImagesCount: FC = () => {
  const setCount = usePicturesStore(s => s.setCount)

  const handleReset = () => {
    const removed = setCount(SLOT_QUANTITY_CONFIG.ONE)
    purgeRemovedSlots(removed)
    useLayoutStore.getState().syncPositionForCount(SLOT_QUANTITY_CONFIG.ONE)
  }

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button variant='ghost' size='icon' tooltip='Cuadrícula de imágenes'>
          <LayoutGridIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imágenes · Cuadrícula
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        {SECTIONS.map(({ key, component: Component }, index) => (
          <Fragment key={key}>
            {index > 0 && <Separator orientation='horizontal' />}
            <Component />
          </Fragment>
        ))}
      </Popup.Content>

      <Popup.Footer>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={handleReset}
        >
          Resetear cambios
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default ImagesCount
