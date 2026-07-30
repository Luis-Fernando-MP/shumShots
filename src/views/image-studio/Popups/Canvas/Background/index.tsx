'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { BlendIcon } from 'lucide-react'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

const Background: FC = () => {
  const resetBackground = useBackgroundStore(s => s.resetBackground)

  return (
    <Popup className='h-[700px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Configuración del fondo'>
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
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={resetBackground}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default Background
