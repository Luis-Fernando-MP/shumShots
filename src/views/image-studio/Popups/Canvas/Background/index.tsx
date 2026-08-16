'use client'

import Popup from '@common/components/Popup'
import { Button } from '@common/components/Button'
import Separator from '@common/components/Separator'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { BlendIcon } from 'lucide-react'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

/**
 * Popup de configuración del fondo del lienzo.
 * 
 * Permite cambiar colores, degradados, filtros y wallpapers del canvas principal.
 * 
 * @returns El componente de popup para el fondo.
 */
const Background: FC = () => {
  const resetBackground = useBackgroundStore(s => s.resetBackground)

  return (
    <Popup className='h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button variant='ghost' size='icon' tooltip='Configuración del fondo'>
          <BlendIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Canvas · Fondo
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_.text-sm]:text-xs [&_h5]:text-xs [&_h5]:leading-snug'>
        {SECTIONS.map(({ key, component: Component }, index) => (
          <Fragment key={key}>
            {index > 0 && <Separator orientation='horizontal' />}
            <Component />
          </Fragment>
        ))}
      </Popup.Content>

      <Popup.Footer>
        <Button type='button' variant='outline' size='sm' className='w-full text-xs' onClick={resetBackground}>
          Resetear cambios
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default Background
