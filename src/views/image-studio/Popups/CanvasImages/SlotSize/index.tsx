'use client'

import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, Fragment, useEffect } from 'react'

import SECTIONS from './sections'
import useSizeStore from './store/slot-size/store'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Panel para ajustar el tamaño de los slots de imagen.
 *
 * @returns El panel de tamaño para la sidebar.
 */
const SlotSize: FC = () => {
  const resetSize = useSizeStore(s => s.reset)
  const syncFromTabs = useSizeStore(s => s.syncFromTabs)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.size)
    syncFromTabs(tabs.getState().layers, tabs.getState().activeLayerId)
    return tabs.subscribe(state => syncFromTabs(state.layers, state.activeLayerId))
  }, [syncFromTabs])

  return (
    <DomainPanel
      onReset={() => {
        resetSize()
        getTabsStore(TABS_SCOPES.size).getState().reset()
      }}
    >
      <Tabs
        scope={TABS_SCOPES.size}
        addLabel='Nueva capa de tamaño'
        onTabsChange={(layers, activeId) => syncFromTabs(layers, activeId)}
      >
        <Tabs.Title>Tamaño por destinos</Tabs.Title>
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

export default SlotSize
