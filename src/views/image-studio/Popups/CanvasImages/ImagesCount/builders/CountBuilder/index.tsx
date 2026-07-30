'use client'

import { cn } from '@common/utils/cn'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import useSizeStore from '@views/image-studio/Popups/CanvasImages/SlotSize/store/slot-size/store'
import { ALL_TAB_SCOPES } from '@views/image-studio/constants'
import { getTabsStore } from '@views/image-studio/Popups/common/components/tabs/store'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { type FC } from 'react'

const COUNTS = [1, 2, 3, 4, 5] as const
const PREVIEW_SLOT = { w: 28, h: 32 }

const LayoutPreview: FC<{ count: number }> = ({ count }) => {
  const layout = getPictureLayout(count)
  return (
    <div className='bg-muted relative h-11 w-full overflow-hidden rounded-md'>
      {layout.map((point, index) => (
        <div
          key={index}
          className='bg-primary/40 border-primary/50 absolute rounded-[3px] border'
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
  useSizeStore.getState().purgeSlotTargets(removed)
}

const CountBuilder: FC = () => {
  const count = usePicturesStore(s => s.count)
  const setCount = usePicturesStore(s => s.setCount)

  return (
    <SectionBlock
      title='Slots en el canvas'
      description='Solo añade o quita imágenes; no cambia el tamaño.'
    >
      <div className='grid grid-cols-5 gap-2'>
        {COUNTS.map(value => {
          const active = count === value
          return (
            <button
              key={value}
              type='button'
              onClick={() => {
                const removed = setCount(value)
                purgeRemovedSlots(removed)
              }}
              className={cn(
                'flex flex-col gap-1.5 rounded-lg p-1.5 transition-colors',
                active ? 'bg-secondary ring-primary/35 ring-1' : 'hover:bg-muted/60'
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
