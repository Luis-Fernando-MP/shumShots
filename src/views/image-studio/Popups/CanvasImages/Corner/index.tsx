'use client'

import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, Fragment, useEffect } from 'react'

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
      className='gap-grid-xl [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'
      onReset={() => {
        resetCorner()
        getTabsStore(TABS_SCOPES.corner).getState().reset()
      }}
    >
      <Tabs scope={TABS_SCOPES.corner} onTabsChange={layers => syncTabs(layers)}>
        <Tabs.Title>Destinos y estilo</Tabs.Title>
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

export default Corner
