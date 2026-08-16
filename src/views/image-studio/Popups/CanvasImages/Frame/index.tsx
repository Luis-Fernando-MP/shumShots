'use client'

import { TABS_SCOPES } from '@views/image-studio/constants'
import useFrameStore from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, useEffect } from 'react'

import SECTIONS from './sections'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Panel para aplicar marcos de dispositivos a las imágenes.
 *
 * @returns El panel de frames para la sidebar.
 */
const Frame: FC = () => {
  const syncTabs = useFrameStore(s => s.syncTabs)
  const reset = useFrameStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.frame)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <DomainPanel
      resetLabel='Resetear marco'
      onReset={() => {
        reset()
        getTabsStore(TABS_SCOPES.frame).getState().reset()
      }}
    >
      <Tabs scope={TABS_SCOPES.frame} onTabsChange={layers => syncTabs(layers)}>
        <Tabs.Title>Destinos y frame</Tabs.Title>
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

export default Frame
