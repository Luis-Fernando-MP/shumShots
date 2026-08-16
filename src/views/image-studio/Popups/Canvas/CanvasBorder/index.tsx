'use client'

import useCanvasBorderStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/border.store'
import useCanvasRadiusStore from '@views/image-studio/Popups/Canvas/CanvasBorder/store/canvas-border/radius.store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de bordes y radio del lienzo.
 */
const CanvasBorder: FC = () => {
  const resetBorder = useCanvasBorderStore(s => s.resetBorder)
  const resetBackgroundRadius = useCanvasRadiusStore(s => s.resetBackgroundRadius)

  return (
    <DomainPanel
      resetLabel='Resetear borde'
      onReset={() => {
        resetBorder()
        resetBackgroundRadius?.()
      }}
    >
      {SECTIONS.map(({ key, component: Component }) => (
        <Component key={key} />
      ))}
    </DomainPanel>
  )
}

export default CanvasBorder
