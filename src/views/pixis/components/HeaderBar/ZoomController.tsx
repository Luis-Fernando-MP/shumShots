'use client'

import useBoardStore, { MAX_SCALE, MIN_SCALE } from '@/shared/components/Board/board.store'
import Button from '@/shared/ui/Button'
import { MinusIcon, PlusIcon } from 'lucide-react'
import type { FC } from 'react'

const ZoomController: FC = () => {
  const { scale, setScaleCentered, resetZoom } = useBoardStore()
  const percent = Math.round(scale * 100)
  const atMin = scale <= MIN_SCALE + 0.001
  const atMax = scale >= MAX_SCALE - 0.001

  return (
    <div className='flex items-center overflow-hidden' role='group' aria-label='Zoom'>
      <Button size='icon' variant='ghost' disabled={atMin} onClick={() => setScaleCentered('out')}>
        <MinusIcon className='size-4' />
      </Button>

      <Button size='sm' variant='ghost' onClick={resetZoom}>
        {percent}%
      </Button>

      <Button size='icon' variant='ghost' disabled={atMax} onClick={() => setScaleCentered('in')}>
        <PlusIcon className='size-4' />
      </Button>
    </div>
  )
}

export default ZoomController
