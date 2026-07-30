'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import { LayoutGridIcon } from 'lucide-react'
import { type FC, Fragment } from 'react'

import { purgeRemovedSlots } from './builders/CountBuilder'
import SECTIONS from './sections'
import useGridStore from './store/images-count/grid'
import usePicturesStore from './store/images-count/pictures'

const ImagesCount: FC = () => {
  const setCount = usePicturesStore(s => s.setCount)
  const resetGrid = useGridStore(s => s.reset)

  const handleReset = () => {
    const removed = setCount(1)
    purgeRemovedSlots(removed)
    resetGrid()
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
