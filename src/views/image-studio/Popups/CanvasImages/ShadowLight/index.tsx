'use client'

import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import useShadowStore from '@views/image-studio/Popups/CanvasImages/ShadowLight/store/shadow-light/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { Fragment, type FC, useEffect } from 'react'

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
      onReset={() => {
        reset()
        getTabsStore(TABS_SCOPES.shadow).getState().reset()
      }}
    >
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
    </DomainPanel>
  )
}

export default ShadowLight
