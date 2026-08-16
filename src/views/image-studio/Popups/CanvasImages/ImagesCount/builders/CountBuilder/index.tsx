'use client'

import Text from '@common/components/Text'
import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import { SLOT_QUANTITIES } from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import useSizeStore from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { ALL_TAB_SCOPES, TABS_SCOPES } from '@views/image-studio/constants'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { type FC } from 'react'

const LayoutPreview: FC<{ count: number; aspect: number }> = ({ count, aspect }) => {
  const layout = getPictureLayout(count)
  return (
    <div className='bg-muted relative w-full overflow-hidden rounded-[6px]' style={{ aspectRatio: aspect }}>
      {layout.map((point, index) => (
        <div
          key={index}
          className='bg-primary/50 border-primary/40 absolute rounded-[2px] border'
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: '28%',
            height: '32%'
          }}
        />
      ))}
    </div>
  )
}

const purgeRemovedSlots = (removed: string[]) => {
  if (removed.length === 0) return
  for (const scope of ALL_TAB_SCOPES) {
    getTabsStore(scope).getState().purgeSlotTargets(removed)
  }
  getTabsStore(TABS_SCOPES.layout).getState().dropEmptyLayers()
  useSizeStore.getState().purgeSlotTargets(removed)
  useLayoutStore.getState().purgeSlotOffsets(removed)
}

const CountBuilder: FC = () => {
  const count = usePicturesStore(s => s.count)
  const setCount = usePicturesStore(s => s.setCount)
  const syncPositionForCount = useLayoutStore(s => s.syncPositionForCount)
  const canvasW = useBackgroundStore(s => s.backgroundWidth)
  const canvasH = useBackgroundStore(s => s.backgroundHeight)
  const aspect = canvasW / Math.max(1, canvasH)

  return (
    <SectionBlock title='Slots en el canvas' description='Solo añade o quita imágenes; no cambia el tamaño.'>
      <div className='grid grid-cols-5 gap-1'>
        {SLOT_QUANTITIES.map(value => {
          const active = count === value
          return (
            <button
              key={value}
              type='button'
              onClick={() => {
                const removed = setCount(value)
                purgeRemovedSlots(removed)
                syncPositionForCount(value)
              }}
              className={cn(
                'flex flex-col gap-1 rounded-[12px] border p-1 transition-colors',
                active ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted/40'
              )}
            >
              <LayoutPreview count={value} aspect={aspect} />
              <Text.caption className={cn('text-center', active && 'text-foreground')}>{value}</Text.caption>
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export { purgeRemovedSlots }
export default CountBuilder
