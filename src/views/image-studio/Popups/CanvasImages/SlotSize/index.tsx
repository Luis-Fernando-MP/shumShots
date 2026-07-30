'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import Tabs from '@views/image-studio/Popups/common/components/tabs'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { ScalingIcon } from 'lucide-react'
import { type FC, Fragment, useEffect } from 'react'

import SECTIONS from './sections'
import useSizeStore from './store/slot-size/store'

const SlotSize: FC = () => {
  const resetSize = useSizeStore(s => s.reset)
  const syncFromTabs = useSizeStore(s => s.syncFromTabs)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.size)
    syncFromTabs(tabs.getState().layers, tabs.getState().activeLayerId)
    return tabs.subscribe(state => syncFromTabs(state.layers, state.activeLayerId))
  }, [syncFromTabs])

  return (
    <Popup className='h-[min(640px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Tamaño de slots'>
          <ScalingIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imágenes · Tamaño
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
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
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => {
            resetSize()
            getTabsStore(TABS_SCOPES.size).getState().reset()
          }}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default SlotSize
