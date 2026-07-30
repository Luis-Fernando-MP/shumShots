'use client'

import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import SizePresetsSection from '@views/image-studio/Popups/common/components/SizePresetsSection'
import { TABS_SCOPES } from '@views/image-studio/constants'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { type FC, useEffect, useMemo } from 'react'

import { SLOT_SIZE_PRESETS } from '../../data'
import useSizeStore, { selectActiveSizeLayer } from '../../store/slot-size/store'

type Props = { tabId: string; targetIds: string[] }

const SizeControlsBuilder: FC<Props> = ({ tabId, targetIds }) => {
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
    <SectionBlock
      title='Ancho · Alto'
      description='Presets y valores manuales. Se ignora si el slot tiene frame.'
    >
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
    </SectionBlock>
  )
}

export default SizeControlsBuilder
