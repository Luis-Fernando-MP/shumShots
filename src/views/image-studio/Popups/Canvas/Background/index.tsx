'use client'

import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de configuración del fondo del lienzo.
 */
const Background: FC = () => {
  const resetBackground = useBackgroundStore(s => s.resetBackground)

  return (
    <DomainPanel onReset={resetBackground} resetLabel='Resetear fondo'>
      {SECTIONS.map(({ key, component: Component }) => (
        <Component key={key} />
      ))}
    </DomainPanel>
  )
}

export default Background
