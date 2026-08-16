'use client'

import { TABS_SCOPES } from '@views/image-studio/constants'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, useEffect } from 'react'

import SECTIONS from './sections'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Panel de sombras y efectos de luz para las imágenes.
 *
 * @returns El panel de sombras para la sidebar.
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
    <DomainPanel
      resetLabel='Resetear sombra'
      onReset={() => {
        reset()
        getTabsStore(TABS_SCOPES.shadow).getState().reset()
      }}
    >
      <Tabs scope={TABS_SCOPES.shadow} onTabsChange={layers => syncTabs(layers)}>
        <Tabs.Title>Destinos y efectos</Tabs.Title>
        <Tabs.Content>
          {({ selectedTab }) => (
            <div className='flex flex-col gap-6'>
              {SECTIONS.map(section => {
                const Component = section.component
                return <Component key={section.key} tabId={selectedTab.id} />
              })}
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </DomainPanel>
  )
}

export default ShadowLight
