'use client'

import Popup from '@common/components/Popup'
import { Button } from '@common/components/Button'
import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { MoveIcon } from 'lucide-react'
import { type FC, Fragment } from 'react'

import { GLOBAL_SECTIONS, TAB_SECTIONS } from './sections'
import useLayoutStore from './store/layout/store'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Popup de composición y disposición de las imágenes (Layout).
 * 
 * Ofrece presets de posición globales y ajustes finos por grupos
 * de slots seleccionados.
 * 
 * @returns El componente de popup para la composición de imágenes.
 */
const Layout: FC = () => {
  const reset = useLayoutStore(s => s.reset)

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button variant='ghost' size='icon' tooltip='Composición de slots'>
          <MoveIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imágenes · Composición
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        {GLOBAL_SECTIONS.map(({ key, component: Component }, index) => (
          <Fragment key={key}>
            {index > 0 && <Separator orientation='horizontal' />}
            <Component />
          </Fragment>
        ))}

        <Separator orientation='horizontal' />

        <Tabs scope={TABS_SCOPES.layout} addLabel='Nuevo grupo' exclusiveTargets>
          <Tabs.Title>Destinos a mover</Tabs.Title>
          <Tabs.Content>
            {({ selectedSlots }) => (
              <div className='gap-grid-lg flex flex-col'>
                {TAB_SECTIONS.map(({ key, component: Component }) => (
                  <Component key={key} targetIds={selectedSlots} />
                ))}
              </div>
            )}
          </Tabs.Content>
        </Tabs>
      </Popup.Content>

      <Popup.Footer>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => {
            reset()
            getTabsStore(TABS_SCOPES.layout).getState().reset()
          }}
        >
          Resetear cambios
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default Layout
