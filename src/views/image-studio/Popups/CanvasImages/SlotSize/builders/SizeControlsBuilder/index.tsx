'use client'

import { Button } from '@common/components/Button'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import SizePresetsSection from '@views/image-studio/Popups/common/components/SizePresetsSection'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { TABS_SCOPES } from '@views/image-studio/constants'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { type FC, useCallback, useEffect, useMemo } from 'react'

import { SLOT_SIZE_PRESETS } from '../../data'
import { clampSize } from '../../store/slot-size/initialState'
import useSizeStore, { selectActiveSizeLayer } from '../../store/slot-size/store'

type Props = { tabId: string; targetIds: string[] }

const SCALE_STEP = 1.1

const SizeControlsBuilder: FC<Props> = ({ tabId, targetIds }) => {
  const syncFromTabs = useSizeStore(s => s.syncFromTabs)
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

  const aspect = activeLayer ? activeLayer.width / Math.max(1, activeLayer.height) : 1

  const setWidthKeepRatio = useCallback(
    (width: number) => {
      setLayerSize(width, width / aspect)
    },
    [aspect, setLayerSize]
  )

  const setHeightKeepRatio = useCallback(
    (height: number) => {
      setLayerSize(height * aspect, height)
    },
    [aspect, setLayerSize]
  )

  const scaleBy = useCallback(
    (factor: number) => {
      if (!activeLayer) return
      setLayerSize(clampSize(activeLayer.width * factor), clampSize(activeLayer.height * factor))
    },
    [activeLayer, setLayerSize]
  )

  if (!activeLayer) return null

  return (
    <SectionBlock
      title='Ancho · Alto'
      description='La proporción del preset se mantiene. Escala o cambia un lado y el otro sigue.'
    >
      <div className='flex flex-col gap-3'>
        <SizePresetsSection
          embedded
          width={activeLayer.width}
          height={activeLayer.height}
          setWidth={setWidthKeepRatio}
          setHeight={setHeightKeepRatio}
          setSize={setLayerSize}
          presets={SLOT_SIZE_PRESETS}
          disabled={sizeLockedByFrame}
          disabledHint='Frame activo: el tamaño lo define el dispositivo.'
          forceLockAspect
        />

        {!sizeLockedByFrame && (
          <div className='flex items-center justify-between gap-2'>
            <span className='text-muted-foreground text-xs'>Escala uniforme</span>
            <div className='flex items-center gap-1.5'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-8 w-8 p-0'
                aria-label='Reducir tamaño'
                onClick={() => scaleBy(1 / SCALE_STEP)}
              >
                <MinusIcon className='size-3.5' />
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='h-8 w-8 p-0'
                aria-label='Aumentar tamaño'
                onClick={() => scaleBy(SCALE_STEP)}
              >
                <PlusIcon className='size-3.5' />
              </Button>
            </div>
          </div>
        )}
      </div>
    </SectionBlock>
  )
}

export default SizeControlsBuilder
