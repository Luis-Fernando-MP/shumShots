'use client'

import { cn } from '@common/utils/cn'
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
      <div className='grid grid-cols-4 gap-1.5'>
        {entries.map(item => {
          const active = positionId === item.id
          const Preview = item.preview
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => setPositionId(item.id as SlotPositionId)}
              className={cn(
                'relative flex flex-col gap-1 rounded-sm border p-1.5 transition-colors',
                active
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60 hover:border-border hover:bg-muted/40'
              )}
            >
              {item.is3d && (
                <span className='text-primary absolute top-1 right-1 z-[1] text-[9px] font-semibold tracking-wide'>
                  3D
                </span>
              )}
              <Preview active={active} count={count} />
              <span className='text-muted-foreground text-center text-[10px] leading-tight font-medium'>
                {item.title}
              </span>
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

export default PositionsBuilder
