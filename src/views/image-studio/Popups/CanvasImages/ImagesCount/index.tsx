'use client'

import Separator from '@common/components/Separator'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, Fragment } from 'react'

import { purgeRemovedSlots } from './builders/CountBuilder'
import SECTIONS from './sections'
import { SLOT_QUANTITY_CONFIG } from './slotQuantity'
import usePicturesStore from './store/images-count/pictures'

/**
 * Panel para gestionar la cantidad de imágenes (slots) en el lienzo.
 *
 * @returns El panel de recuento para la sidebar.
 */
const ImagesCount: FC = () => {
  const setCount = usePicturesStore(s => s.setCount)

  const handleReset = () => {
    const removed = setCount(SLOT_QUANTITY_CONFIG.ONE)
    purgeRemovedSlots(removed)
    useLayoutStore.getState().syncPositionForCount(SLOT_QUANTITY_CONFIG.ONE)
  }

  return (
    <DomainPanel onReset={handleReset}>
      {SECTIONS.map(({ key, component: Component }, index) => (
        <Fragment key={key}>
          {index > 0 && <Separator orientation='horizontal' />}
          <Component />
        </Fragment>
      ))}
    </DomainPanel>
  )
}

export default ImagesCount
