'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import useBackgroundBorderStore from '@views/image-studio/store/background/backgroundBorder.store'
import useBackgroundRadiusStore from '@views/image-studio/store/background/backgroundRadius.store'
import { FrameIcon } from 'lucide-react'
import { type FC } from 'react'

import CanvasBorderColorsController from './wrappers/CanvasBorderColorsController'
import CanvasBorderMatController from './wrappers/CanvasBorderMatController'
import CanvasBorderSizeController from './wrappers/CanvasBorderSizeController'
import CanvasBorderStyleController from './wrappers/CanvasBorderStyleController'
import CanvasFrameTemplateController from './wrappers/CanvasFrameTemplateController'
import CanvasRadiusController from './wrappers/CanvasRadiusController'

const CanvasBorderConfiguration: FC = () => {
  const resetBorder = useBackgroundBorderStore(s => s.resetBorder)
  const resetBackgroundRadius = useBackgroundRadiusStore(s => s.resetBackgroundRadius)

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
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Canvas · Bordes</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
        <CanvasRadiusController />
        <CanvasBorderStyleController />
        <CanvasBorderColorsController />
        <CanvasFrameTemplateController />
        <CanvasBorderMatController />
        <CanvasBorderSizeController />
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={handleReset}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default CanvasBorderConfiguration
