'use client'

import Popup from '@/shared/components/Popup'
import Button from '@/shared/ui/Button'
import { Button as UiButton } from '@common/ui/Button'
import Switch from '@common/ui/Switch'
import Separator from '@common/ui/Separator'
import Typography from '@common/ui/Typography'
import { cn } from '@common/utils/cn'
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { ALL_TAB_SCOPES } from '@views/image-studio/constants'
import SectionBlock from '@views/image-studio/Popups/BackgroundConfiguration/wrappers/SectionBlock'
import { getTabsStore } from '@views/image-studio/shared/components/tabs/store'
import useGridStore from '@views/image-studio/store/grid'
import usePicturesStore from '@views/image-studio/store/images/pictures.store'
import useSizeStore from '@views/image-studio/store/size'
import { getPictureLayout } from '@views/image-studio/utils/pictureLayouts'
import { LayoutGridIcon } from 'lucide-react'
import { type FC } from 'react'

import LibrarySection from './components/LibrarySection'
import PositionsSection from './components/PositionsSection'
import SlotsSection from './components/SlotsSection'

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

const ImagesCountConfiguration: FC = () => {
  const count = usePicturesStore(s => s.count)
  const setCount = usePicturesStore(s => s.setCount)
  const constrainToParent = useGridStore(s => s.constrainToParent)
  const setConstrainToParent = useGridStore(s => s.setConstrainToParent)
  const ensurePositionForCount = useGridStore(s => s.ensurePositionForCount)
  const resetGrid = useGridStore(s => s.reset)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleReset = () => {
    const removed = setCount(1)
    purgeRemovedSlots(removed)
    resetGrid()
    ensurePositionForCount(1)
  }

  return (
    <Popup className='h-[min(820px,90vh)] w-[360px]'>
      <Popup.Trigger>
        <Button size='icon' tooltip='Cuadrícula de imágenes'>
          <LayoutGridIcon />
        </Button>
      </Popup.Trigger>

      <Popup.Header>
        <h5 className='font-display text-sm leading-tight font-medium tracking-wide'>
          Imágenes · Cuadrícula
        </h5>
      </Popup.Header>

      <Popup.Content className='gap-grid-lg flex flex-col text-xs'>
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
                    ensurePositionForCount(value)
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

        <Separator orientation='horizontal' />

        <SectionBlock
          title='Relación padre–hijo'
          description='Si está activo, los slots respetan el aspect y caben en el 90% del fondo.'
        >
          <div className='flex items-center justify-between gap-3'>
            <Typography.Small className='text-xs'>Mantener relación con el canvas</Typography.Small>
            <Switch
              on={constrainToParent}
              onChange={() => setConstrainToParent(!constrainToParent)}
              size='sm'
              aria-label='Mantener relación padre-hijo'
            />
          </div>
        </SectionBlock>

        <Separator orientation='horizontal' />

        <PositionsSection />

        <Separator orientation='horizontal' />

        <SlotsSection sensors={sensors} />

        <Separator orientation='horizontal' />

        <LibrarySection sensors={sensors} />
      </Popup.Content>

      <Popup.Footer>
        <UiButton
          type='button'
          variant='outline'
          size='sm'
          className='w-full text-xs'
          onClick={handleReset}
        >
          Resetear cambios
        </UiButton>
      </Popup.Footer>
    </Popup>
  )
}

export default ImagesCountConfiguration
