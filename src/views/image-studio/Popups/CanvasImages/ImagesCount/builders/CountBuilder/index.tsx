'use client'

import { cn } from '@common/utils/cn'
import { SLOT_QUANTITIES } from '@views/image-studio/Popups/CanvasImages/ImagesCount/slotQuantity'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import useSizeStore from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { ALL_TAB_SCOPES, TABS_SCOPES } from '@views/image-studio/constants'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { type FC } from 'react'

const PREVIEW_SLOT = { w: 28, h: 32 }

const LayoutPreview: FC<{ count: number }> = ({ count }) => {
  const layout = getPictureLayout(count)
  return (
    <div className='bg-muted/40 relative h-11 w-full overflow-hidden rounded-sm'>
      {layout.map((point, index) => (
        <div
          key={index}
          className='bg-primary/40 border-primary/50 absolute rounded-[2px] border'
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: `${PREVIEW_SLOT.w}%`,
            height: `${PREVIEW_SLOT.h}%`
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

  return (
    <SectionBlock
      title='Slots en el canvas'
      description='Solo añade o quita imágenes; no cambia el tamaño.'
    >
      <div className='grid grid-cols-5 gap-1.5'>
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
                'flex flex-col gap-1.5 rounded-sm border p-1.5 transition-colors',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent hover:border-border hover:bg-muted/40'
              )}
            >
              <LayoutPreview count={value} />
              <span className='text-muted-foreground text-center text-[11px] font-medium'>
                {value}
              </span>
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export { purgeRemovedSlots }
export default CountBuilder
