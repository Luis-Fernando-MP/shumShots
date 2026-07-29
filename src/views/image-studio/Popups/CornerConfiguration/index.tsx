'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Separator from '@common/ui/Separator'
import { TABS_SCOPES } from '@views/image-studio/constants'
import Tabs from '@views/image-studio/shared/components/tabs'
import { getTabsStore } from '@views/image-studio/shared/components/tabs/store'
import useCornerStore from '@views/image-studio/store/corner'
import { SquareRoundCornerIcon } from 'lucide-react'
import { type FC, useEffect } from 'react'

import BorderColorsController from './wrappers/BorderColorsController'
import BorderMatController from './wrappers/BorderMatController'
import BorderSizeController from './wrappers/BorderSizeController'
import BorderStyleController from './wrappers/BorderStyleController'
import ImagesRadiusController from './wrappers/ImagesRadiusController'

const CornerConfiguration: FC = () => {
  const syncTabs = useCornerStore(s => s.syncTabs)
  const resetCorner = useCornerStore(s => s.reset)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.corner)
    syncTabs(tabs.getState().layers)
    return tabs.subscribe(state => syncTabs(state.layers))
  }, [syncTabs])

  const handleReset = () => {
    resetCorner()
    getTabsStore(TABS_SCOPES.corner).getState().reset()
  }

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
        <Tabs
          scope={TABS_SCOPES.corner}
          onTabsChange={layers => syncTabs(layers)}
        >
          <Tabs.Title>Destinos y estilo</Tabs.Title>
          <Tabs.Content>
            {() => (
              <div className='gap-grid-lg flex flex-col'>
                <ImagesRadiusController />
                <Separator orientation='horizontal' />
                <BorderStyleController />
                <Separator orientation='horizontal' />
                <BorderColorsController />
                <Separator orientation='horizontal' />
                <BorderMatController />
                <Separator orientation='horizontal' />
                <BorderSizeController />
              </div>
            )}
          </Tabs.Content>
        </Tabs>
      </Popup.Content>

      <Popup.Footer>
        <UiButton type='button' variant='outline' size='sm' className='w-full text-xs' onClick={handleReset}>
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default CornerConfiguration
