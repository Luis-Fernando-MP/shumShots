'use client'

import Separator from '@common/components/Separator'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

/**
 * Panel de configuración del fondo del lienzo.
 *
 * Permite cambiar colores, degradados, filtros y wallpapers del canvas principal.
 *
 * @returns El panel de fondo para la sidebar.
 */
const Background: FC = () => {
  const resetBackground = useBackgroundStore(s => s.resetBackground)

  return (
    <DomainPanel
      onReset={resetBackground}
      className='gap-grid-xl [&_.text-sm]:text-xs [&_h5]:text-xs [&_h5]:leading-snug'
    >
      {SECTIONS.map(({ key, component: Component }, index) => (
        <Fragment key={key}>
          {index > 0 && <Separator orientation='horizontal' />}
          <Component />
        </Fragment>
      ))}
    </DomainPanel>
  )
}

export default Background
