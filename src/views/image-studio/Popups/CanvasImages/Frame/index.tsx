'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/components/Button'
import Separator from '@common/components/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import useFrameStore from '@views/image-studio/Popups/CanvasImages/Frame/store/frame/store'
import Tabs from '@views/image-studio/Popups/common/components/tabs'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { SmartphoneIcon } from 'lucide-react'
import { type FC, Fragment, useEffect } from 'react'

import SECTIONS from './sections'

const Frame: FC = () => {
  const syncTabs = useFrameStore(s => s.syncTabs)
  const reset = useFrameStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.frame)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Frames de dispositivo'>
          <SmartphoneIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imagen · Frames
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
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
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => {
            reset()
            getTabsStore(TABS_SCOPES.frame).getState().reset()
          }}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default Frame
