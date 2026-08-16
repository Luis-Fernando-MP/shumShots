'use client'

import Popup from '@common/components/Popup'
import { Button } from '@common/components/Button'
import Separator from '@common/components/Separator'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import { FrameIcon } from 'lucide-react'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

/**
 * Popup de configuración de bordes y radio del lienzo.
 * 
 * Permite ajustar el grosor del borde, el estilo (mat) y el redondeado
 * de las esquinas del canvas.
 * 
 * @returns El componente de popup para los bordes del canvas.
 */
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
        <Button variant='ghost' size='icon' tooltip='Bordes del canvas'>
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
        <Button type='button' variant='outline' size='sm' className='w-full text-xs' onClick={handleReset}>
          Resetear cambios
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default CanvasBorder
