'use client'

import Popup from '@common/components/Popup'
import { Button } from '@common/components/Button'
import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { CloudSunIcon } from 'lucide-react'
import { Fragment, type FC, useEffect } from 'react'

import SECTIONS from './sections'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Popup de sombras y efectos de luz para las imágenes.
 * 
 * Permite configurar sombras proyectadas y reflejos de luz direccional
 * de forma independiente por cada grupo de slots.
 * 
 * @returns El componente de popup para las sombras y luz de la imagen.
 */
const ShadowLight: FC = () => {
  const syncTabs = useShadowStore(s => s.syncTabs)
  const reset = useShadowStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.shadow)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button variant='ghost' size='icon' tooltip='Sombras y luz'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imagen · Sombras y luz
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        <Tabs scope={TABS_SCOPES.shadow} onTabsChange={layers => syncTabs(layers)}>
          <Tabs.Title>Destinos y efectos</Tabs.Title>
          <Tabs.Content>
            {({ selectedTab }) => (
              <div className='gap-grid-lg flex flex-col'>
                {SECTIONS.map((section, index) => {
                  const Component = section.component
                  return (
                    <Fragment key={section.key}>
                      {index > 0 && <Separator orientation='horizontal' />}
                      <Component tabId={selectedTab.id} />
                    </Fragment>
                  )
                })}
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
            getTabsStore(TABS_SCOPES.shadow).getState().reset()
          }}
        >
          Resetear cambios
        </Button>
      </Popup.Footer>
    </Popup>
  )
}

export default ShadowLight
