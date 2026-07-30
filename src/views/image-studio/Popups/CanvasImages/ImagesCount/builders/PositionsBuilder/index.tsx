'use client'

import Chip from '@common/ui/Chip'
import { cn } from '@common/utils/cn'
import SectionBlock from '@views/image-studio/Popups/common/components/SectionBlock'
import {
  positionsForCount,
  type SlotPositionId
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/presets/positions/data'
import useGridStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/grid'
import usePicturesStore from '@views/image-studio/Popups/CanvasImages/ImagesCount/store/images-count/pictures'
import { type FC, useEffect } from 'react'

const PositionsBuilder: FC = () => {
  const count = usePicturesStore(s => s.count)
  const positionId = useGridStore(s => s.positionId)
  const setPositionId = useGridStore(s => s.setPositionId)
  const ensurePositionForCount = useGridStore(s => s.ensurePositionForCount)
  const entries = positionsForCount(count)

  useEffect(() => {
    ensurePositionForCount(count)
  }, [count, ensurePositionForCount])

  return (
    <SectionBlock
      title='Posiciones'
      description='Estilos de composición para el número de slots actual.'
    >
      <div className='grid grid-cols-4 gap-2'>
        {entries.map(item => {
          const active = positionId === item.id
          const Preview = item.preview
          return (
            <button
              key={item.id}
              type='button'
              onClick={() => setPositionId(item.id as SlotPositionId)}
              className={cn(
                'relative flex flex-col gap-1 rounded-lg border p-1.5 transition-colors',
                active
                  ? 'border-primary bg-secondary ring-primary/30 ring-1'
                  : 'border-border/60 hover:bg-muted/50'
              )}
            >
              {item.is3d && (
                <Chip
                  size='sm'
                  variant='primary'
                  className='absolute top-1 right-1 z-[1] h-5 px-1 text-[9px]'
                >
                  3D
                </Chip>
              )}
              {Preview ? <Preview active={active} /> : <div className='h-10' />}
              <span className='text-muted-foreground text-center text-[10px] font-medium leading-tight'>
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
