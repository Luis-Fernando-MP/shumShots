'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import Tabs from '@views/image-studio/Popups/common/components/tabs'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC, Fragment, useEffect } from 'react'

import useCornerStore from './store/corner/store'
import SECTIONS from './sections'

const Corner: FC = () => {
  const syncTabs = useCornerStore(s => s.syncTabs)
  const resetCorner = useCornerStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.corner)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  return (
    <Popup className='h-[760px] w-[350px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Bordes de la imagen'>
          <SquareRoundCornerIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>Imagen · Bordes</h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-xl flex flex-col text-xs [&_h5]:text-xs [&_h5]:leading-snug [&_.text-sm]:text-xs'>
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
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={() => {
            resetCorner()
            getTabsStore(TABS_SCOPES.corner).getState().reset()
          }}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default Corner
