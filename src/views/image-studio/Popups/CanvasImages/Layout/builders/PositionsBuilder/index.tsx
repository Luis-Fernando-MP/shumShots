'use client'

import Text from '@common/components/Text'
import { chromeTile } from '@common/utils/chrome'
import { cn } from '@common/utils/cn'
import useBackgroundStore from '@views/image-studio/Popups/Canvas/Background/store/background/store'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import {
  getPositionsForCount,
  type SlotPositionId
} from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'
import useLayoutStore from '@views/image-studio/Popups/CanvasImages/Layout/store/layout/store'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import { type FC, useEffect, useMemo } from 'react'

const PositionsBuilder: FC = () => {
  const count = usePicturesStore(s => s.count)
  const canvasW = useBackgroundStore(s => s.backgroundWidth)
  const canvasH = useBackgroundStore(s => s.backgroundHeight)
  const positionId = useLayoutStore(s => s.positionId)
  const setPositionId = useLayoutStore(s => s.setPositionId)
  const syncPositionForCount = useLayoutStore(s => s.syncPositionForCount)
  const entries = useMemo(() => getPositionsForCount(count), [count])

  useEffect(() => {
    syncPositionForCount(count)
  }, [count, syncPositionForCount])

  return (
    <SectionBlock
      title='Posiciones'
      description='Estilos de composición para el número de slots actual.'
    >
      <div className='grid grid-cols-2 gap-2'>
        {entries.map(item => {
          const active = positionId === item.id
          const Preview = item.preview
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => setPositionId(item.id as SlotPositionId)}
              className={cn('relative flex flex-col gap-1 p-1.5', chromeTile(active))}
            >
              {item.is3d && (
                <Text.caption className='text-primary absolute top-1 right-1 z-[1]'>3D</Text.caption>
              )}
              <div
                className='bg-muted w-full overflow-hidden rounded-[6px]'
                style={{ aspectRatio: `${canvasW} / ${canvasH}` }}
              >
                <Preview active={active} count={count} />
              </div>
              <Text.caption className={cn('text-center', active && 'text-foreground')}>{item.title}</Text.caption>
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default PositionsBuilder
