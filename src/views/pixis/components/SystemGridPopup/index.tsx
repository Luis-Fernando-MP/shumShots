'use client'

import useBoardStore, { GRID_SIZES } from '@common/components/Board/board.store'
import Button from '@common/components/Button'
import Popup from '@common/components/Popup'
import Switch from '@common/components/Switch'
import Typography from '@common/components/Typography'
import { Grid3x3Icon } from 'lucide-react'
import { type FC } from 'react'

/**
 * Popup de sistema: cuadrícula del viewport y snap al paneo.
 *
 * @returns El trigger y el diálogo de sistema.
 */
const SystemGridPopup: FC = () => {
  const showGrid = useBoardStore(s => s.showGrid)
  const snapToGrid = useBoardStore(s => s.snapToGrid)
  const gridSize = useBoardStore(s => s.gridSize)
  const setShowGrid = useBoardStore(s => s.setShowGrid)
  const setSnapToGrid = useBoardStore(s => s.setSnapToGrid)
  const setGridSize = useBoardStore(s => s.setGridSize)

  return (
    <Popup className='h-auto min-h-0 w-[320px]'>
      <Popup.Trigger>
        <Button size='icon' variant='ghost' tooltip='Sistema'>
          <Grid3x3Icon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Sistema</Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex min-w-0 flex-col gap-0.5'>
            <Typography.Label>Mostrar cuadrícula</Typography.Label>
            <Typography.Small tone='secondary'>Papel milimetrado del viewport, no del shot.</Typography.Small>
          </div>
          <Switch on={showGrid} onChange={() => setShowGrid(!showGrid)} aria-label='Mostrar cuadrícula' />
        </div>

        <div className='flex items-center justify-between gap-3'>
          <div className='flex min-w-0 flex-col gap-0.5'>
            <Typography.Label>Ajustar a la cuadrícula</Typography.Label>
            <Typography.Small tone='secondary'>Snap del paneo mientras arrastras.</Typography.Small>
          </div>
          <Switch on={snapToGrid} onChange={() => setSnapToGrid(!snapToGrid)} aria-label='Ajustar a la cuadrícula' />
        </div>

        <div className='flex flex-col gap-2'>
          <Typography.Label>Tamaño</Typography.Label>
          <div className='flex flex-wrap gap-1'>
            {GRID_SIZES.map(size => (
              <Button
                key={size}
                size='sm'
                variant={gridSize === size ? 'solid' : 'outline'}
                isSelected={gridSize === size}
                className='min-w-10 rounded-[12px]'
                onClick={() => setGridSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </Popup.Content>
    </Popup>
  )
}

export default SystemGridPopup
