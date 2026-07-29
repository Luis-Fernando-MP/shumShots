'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import useShadowStore from '@views/image-studio/Popups/ShadowConfiguration/store'
import Tabs from '@views/image-studio/shared/components/tabs'
import { getTabsStore } from '@views/image-studio/shared/components/tabs/store'
import { CloudSunIcon } from 'lucide-react'
import { type FC, useEffect } from 'react'

import LayerPanel from './wrappers/LayerPanel'
import LinkFocusSection from './wrappers/LinkFocusSection'

const ShadowConfiguration: FC = () => {
  const syncTabs = useShadowStore(s => s.syncTabs)
  const reset = useShadowStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.shadow)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Sombras y luz'>
          <CloudSunIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imagen · Sombras y luz
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
        <Tabs scope={TABS_SCOPES.shadow} onTabsChange={layers => syncTabs(layers)}>
          <Tabs.Title>Destinos y efectos</Tabs.Title>
          <Tabs.Content>
            {({ selectedTab }) => (
              <div className='gap-grid-lg flex flex-col'>
                <LinkFocusSection tabId={selectedTab.id} />
                <Separator orientation='horizontal' />
                <LayerPanel kind='shadow' tabId={selectedTab.id} />
                <Separator orientation='horizontal' />
                <LayerPanel kind='light' tabId={selectedTab.id} />
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
            getTabsStore(TABS_SCOPES.shadow).getState().reset()
          }}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default ShadowConfiguration
