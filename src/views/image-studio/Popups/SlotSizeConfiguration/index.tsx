'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import { TABS_SCOPES } from '@views/image-studio/constants'
import SectionBlock from '@views/image-studio/Popups/BackgroundConfiguration/wrappers/SectionBlock'
import SizePresetsSection from '@views/image-studio/shared/components/SizePresetsSection'
import Tabs from '@views/image-studio/shared/components/tabs'
import { getTabsStore } from '@views/image-studio/shared/components/tabs/store'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import useSizeStore, { selectActiveSizeLayer } from '@views/image-studio/store/size'
import { ScalingIcon } from 'lucide-react'
import { type FC, useEffect, useMemo } from 'react'

import { SLOT_SIZE_PRESETS } from './data'

type SizeControlsProps = {
  tabId: string
  targetIds: string[]
}

const SizeControls: FC<SizeControlsProps> = ({ tabId, targetIds }) => {
  const syncFromTabs = useSizeStore(s => s.syncFromTabs)
  const setLayerWidth = useSizeStore(s => s.setLayerWidth)
  const setLayerHeight = useSizeStore(s => s.setLayerHeight)
  const setLayerSize = useSizeStore(s => s.setLayerSize)
  const setActiveLayer = useSizeStore(s => s.setActiveLayer)
  const activeLayer = useSizeStore(selectActiveSizeLayer)
  const pictures = usePicturesStore(s => s.pictures)

  useEffect(() => {
    const tabs = getTabsStore(TABS_SCOPES.size)
    syncFromTabs(tabs.getState().layers, tabs.getState().activeLayerId)
    setActiveLayer(tabId)
  }, [setActiveLayer, syncFromTabs, tabId, targetIds])

  const sizeLockedByFrame = useMemo(() => {
    if (!activeLayer) return false
    const targets =
      targetIds.length === 0
        ? pictures
        : pictures.filter(picture => targetIds.includes(picture.id))
    if (targets.length === 0) return false
    return targets.every(picture => Boolean(picture.frameId))
  }, [activeLayer, pictures, targetIds])

  if (!activeLayer) return null

  return (
    <SizePresetsSection
      embedded
      width={activeLayer.width}
      height={activeLayer.height}
      setWidth={setLayerWidth}
      setHeight={setLayerHeight}
      setSize={setLayerSize}
      presets={SLOT_SIZE_PRESETS}
      disabled={sizeLockedByFrame}
      disabledHint='Frame activo: el tamaño lo define el dispositivo.'
    />
  )
}

const SlotSizeConfiguration: FC = () => {
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
              <SectionBlock
                title='Ancho · Alto'
                description='Presets y valores manuales. Se ignora si el slot tiene frame.'
              >
                <SizeControls tabId={selectedTab.id} targetIds={selectedSlots} />
              </SectionBlock>
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

export default SlotSizeConfiguration
