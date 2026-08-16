'use client'

import Separator from '@common/components/Separator'
import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de bordes y radio del lienzo.
 *
 * @returns El panel de bordes para la sidebar.
 */
const CanvasBorder: FC = () => {
  const resetBorder = useCanvasBorderStore(s => s.resetBorder)
  const resetBackgroundRadius = useCanvasRadiusStore(s => s.resetBackgroundRadius)

  const handleReset = () => {
    resetBorder()
    resetBackgroundRadius?.()
  }

  return (
    <DomainPanel onReset={handleReset} className='gap-grid-xl [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
      {SECTIONS.map(({ key, component: Component }, index) => (
        <Fragment key={key}>
          {index > 0 && <Separator orientation='horizontal' />}
          <Component />
        </Fragment>
      ))}
    </DomainPanel>
  )
}

export default CanvasBorder
