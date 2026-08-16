'use client'

import useBoardStore, { MAX_SCALE, MIN_SCALE, SCALE_EPSILON } from '@common/components/Board/board.store'
import Button from '@common/components/Button'
import { MinusIcon, PlusIcon } from 'lucide-react'
import type { FC } from 'react'

const ZoomController: FC = () => {
  const { scale, zoomCentered, resetZoom } = useBoardStore()
  const percent = Math.round(scale * 100)
  const atMin = scale <= MIN_SCALE + SCALE_EPSILON
  const atMax = scale >= MAX_SCALE - SCALE_EPSILON

  return (
    <div className='flex items-center overflow-hidden' role='group' aria-label='Zoom'>
      <Button size='icon' variant='ghost' disabled={atMin} onClick={() => zoomCentered('out')}>
        <MinusIcon className='size-4' />
      </Button>

      <Button size='sm' variant='ghost' onClick={resetZoom}>
        {percent}%
      </Button>

      <Button size='icon' variant='ghost' disabled={atMax} onClick={() => zoomCentered('in')}>
        <PlusIcon className='size-4' />
      </Button>
    </div>
  )
}

export default ZoomController
