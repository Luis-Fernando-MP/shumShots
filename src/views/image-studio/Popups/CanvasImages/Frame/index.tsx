'use client'

import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import useFrameStore from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, Fragment, useEffect } from 'react'

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
      onReset={() => {
        reset()
        getTabsStore(TABS_SCOPES.frame).getState().reset()
      }}
    >
      <Tabs scope={TABS_SCOPES.frame} onTabsChange={layers => syncTabs(layers)}>
        <Tabs.Title>Destinos y frame</Tabs.Title>
        <Tabs.Content>
          {({ selectedTab, selectedSlots }) => (
            <div className='gap-grid-lg flex flex-col'>
              {SECTIONS.map(({ key, component: Component }, index) => (
                <Fragment key={key}>
                  {index > 0 && <Separator orientation='horizontal' />}
                  <Component tabId={selectedTab.id} targetIds={selectedSlots} />
                </Fragment>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </DomainPanel>
  )
}

export default Frame
