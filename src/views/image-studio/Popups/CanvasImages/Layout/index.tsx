'use client'

import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import DomainPanel from '@views/image-studio/components/DomainPanel'
import { type FC, Fragment } from 'react'

import { GLOBAL_SECTIONS, TAB_SECTIONS } from './sections'
import useLayoutStore from './store/layout/store'
import Tabs from '@views/image-studio/Popups/common/components/tabs'

/**
 * Panel de composición y disposición de las imágenes.
 *
 * @returns El panel de layout para la sidebar.
 */
const Layout: FC = () => {
  const reset = useLayoutStore(s => s.reset)

  return (
    <DomainPanel
      onReset={() => {
        reset()
        getTabsStore(TABS_SCOPES.layout).getState().reset()
      }}
    >
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
    </DomainPanel>
  )
}

export default Layout
