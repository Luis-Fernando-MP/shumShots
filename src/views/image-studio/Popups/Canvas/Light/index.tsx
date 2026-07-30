'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import useCanvasLightStore from '@views/image-studio/Popups/Canvas/Light/store/light/store'
import { SunIcon } from 'lucide-react'
import { Fragment, type FC } from 'react'

import SECTIONS from './sections'

const Light: FC = () => {
  const reset = useCanvasLightStore(s => s.reset)

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Luz del canvas'>
          <SunIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Canvas · Luz
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        <div className='gap-grid-lg flex flex-col'>
          {SECTIONS.map(({ key, component: Component }, index) => (
            <Fragment key={key}>
              {index > 0 && <Separator orientation='horizontal' />}
              <Component />
            </Fragment>
          ))}
        </div>
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={reset}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default Light
