'use client'

import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de iluminación del lienzo.
 */
const Light: FC = () => {
  const reset = useCanvasLightStore(s => s.reset)

  return (
    <DomainPanel onReset={reset} resetLabel='Resetear luz'>
      {SECTIONS.map(({ key, component: Component }) => (
        <Component key={key} />
      ))}
    </DomainPanel>
  )
}

export default Light
