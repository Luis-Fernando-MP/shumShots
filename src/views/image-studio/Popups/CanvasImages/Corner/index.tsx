'use client'

import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, useEffect } from 'react'

import useCornerStore from './store/corner/store'
import SECTIONS from './sections'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Panel de redondeado de esquinas de las imágenes.
 *
 * @returns El panel de esquinas para la sidebar.
 */
const Corner: FC = () => {
  const syncTabs = useCornerStore(s => s.syncTabs)
  const resetCorner = useCornerStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.corner)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <DomainPanel
      resetLabel='Resetear esquinas'
      onReset={() => {
        resetCorner()
        getTabsStore(TABS_SCOPES.corner).getState().reset()
      }}
    >
      <Tabs scope={TABS_SCOPES.corner} onTabsChange={layers => syncTabs(layers)}>
        <Tabs.Title>Destinos y estilo</Tabs.Title>
        <Tabs.Content>
          {({ selectedTab, selectedSlots }) => (
            <div className='flex flex-col gap-6'>
              {SECTIONS.map(({ key, component: Component }) => (
                <Component key={key} tabId={selectedTab.id} targetIds={selectedSlots} />
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </DomainPanel>
  )
}

export default Corner
