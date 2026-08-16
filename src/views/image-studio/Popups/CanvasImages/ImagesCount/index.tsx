'use client'

import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC } from 'react'

import { purgeRemovedSlots } from './builders/CountBuilder'
import SECTIONS from './sections'
import { SLOT_QUANTITY_CONFIG } from './slotQuantity'
import useImageLibraryStore from './store/images-count/imageLibrary'
import usePicturesStore from './store/images-count/pictures'

/**
 * Panel para gestionar la cantidad de imágenes (slots) en el lienzo.
 */
const ImagesCount: FC = () => {
  const setCount = usePicturesStore(s => s.setCount)
  const clearLibraryRefs = usePicturesStore(s => s.clearLibraryRefs)
  const clearAll = useImageLibraryStore(s => s.clearAll)

  const handleReset = () => {
    const images = useImageLibraryStore.getState().images
    for (const image of images) clearLibraryRefs(image.id)
    clearAll()
    const removed = setCount(SLOT_QUANTITY_CONFIG.ONE)
    purgeRemovedSlots(removed)
    useLayoutStore.getState().syncPositionForCount(SLOT_QUANTITY_CONFIG.ONE)
  }

  return (
    <DomainPanel onReset={handleReset} resetLabel='Resetear recuento'>
      {SECTIONS.map(({ key, component: Component }) => (
        <Component key={key} />
      ))}
    </DomainPanel>
  )
}

export default ImagesCount
