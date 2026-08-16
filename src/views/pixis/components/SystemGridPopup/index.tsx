'use client'

import useBoardStore, { GRID_SIZES } from '@common/components/Board/board.store'
import Button from '@common/components/Button'
import Popup from '@common/components/Popup'
import Switch from '@common/components/Switch'
import Text from '@common/components/Text'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import { resetImageStudio } from '@views/image-studio/utils/resetImageStudio'
import { Grid3x3Icon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { type FC } from 'react'

/**
 * Popup de sistema: cuadrícula del viewport y reset global del estudio.
 */
const SystemGridPopup: FC = () => {
  const pathname = usePathname()
  const showGrid = useBoardStore(s => s.showGrid)
  const snapToGrid = useBoardStore(s => s.snapToGrid)
  const gridSize = useBoardStore(s => s.gridSize)
  const setShowGrid = useBoardStore(s => s.setShowGrid)
  const setSnapToGrid = useBoardStore(s => s.setSnapToGrid)
  const setGridSize = useBoardStore(s => s.setGridSize)
  const resetPreferences = usePixisPreferencesStore(s => s.resetPreferences)
  const resetWorkspace = useWorkspaceStore(s => s.resetWorkspace)

  const handleResetAll = () => {
    if (pathname?.includes('/editor')) {
      resetImageStudio()
      return
    }
    resetPreferences()
    resetWorkspace()
  }

  return (
    <Popup className='h-auto min-h-0 w-[320px]'>
      <Popup.Trigger>
        <Button size='icon' variant='ghost' tooltip='Sistema'>
          <Grid3x3Icon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>Sistema</Popup.Header>

      <Popup.Content className='flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-3'>
          <Text.heading>Cuadrícula</Text.heading>
          <Switch on={showGrid} onChange={() => setShowGrid(!showGrid)} aria-label='Mostrar cuadrícula' />
        </div>

        <div className='flex items-center justify-between gap-3'>
          <Text.heading>Ajustar</Text.heading>
          <Switch on={snapToGrid} onChange={() => setSnapToGrid(!snapToGrid)} aria-label='Ajustar a la cuadrícula' />
        </div>

        <div className='flex flex-col gap-2'>
          <Text.caption>Tamaño</Text.caption>
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

        <Button variant='dashed' status='error' className='w-full rounded-[12px]' onClick={handleResetAll}>
          Resetear todo
        </Button>
      </Popup.Content>
    </Popup>
  )
}

export default SystemGridPopup
