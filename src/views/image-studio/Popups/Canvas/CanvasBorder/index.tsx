'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/components/Button'
import Separator from '@common/components/Separator'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import { FrameIcon } from 'lucide-react'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

const CanvasBorder: FC = () => {
  const resetBorder = useCanvasBorderStore(s => s.resetBorder)
  const resetBackgroundRadius = useCanvasRadiusStore(s => s.resetBackgroundRadius)

  const handleReset = () => {
    resetBorder()
    resetBackgroundRadius?.()
  }

  return (
    <Popup className='h-[760px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Bordes del canvas'>
          <FrameIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Canvas · Bordes
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
        {SECTIONS.map(({ key, component: Component }, index) => (
          <Fragment key={key}>
            {index > 0 && <Separator orientation='horizontal' />}
            <Component />
          </Fragment>
        ))}
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={handleReset}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default CanvasBorder
