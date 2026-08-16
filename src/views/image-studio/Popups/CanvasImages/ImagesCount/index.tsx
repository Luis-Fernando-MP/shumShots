'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import { LayoutGridIcon } from 'lucide-react'
import { type FC, Fragment } from 'react'

import { purgeRemovedSlots } from './builders/CountBuilder'
import SECTIONS from './sections'
import { SLOT_QUANTITY_CONFIG } from './slotQuantity'
import usePicturesStore from './store/images-count/pictures'

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
        <Button size='icon' tooltip='Cuadrícula de imágenes'>
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
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={handleReset}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default ImagesCount
