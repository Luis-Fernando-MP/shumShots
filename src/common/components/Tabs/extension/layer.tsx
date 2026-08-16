'use client'

import Button from '@common/components/Button'
import { cn } from '@common/utils/cn'
import { PlusIcon, XIcon } from 'lucide-react'
import type { FC, MouseEvent } from 'react'

type LayerItem = {
  id: string
  label?: string
}

interface TabLayerProps {
  items: LayerItem[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  addLabel?: string
  labelPrefix?: string
  addDisabled?: boolean
  addDisabledReason?: string
}

/**
 * Variante de tabs para capas y destinos del image-studio.
 *
 * @param props.items - Capas actuales.
 * @param props.addLabel - Texto del control para añadir. Visible a 260px.
 */
const TabLayer: FC<TabLayerProps> = ({
  items,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  addLabel = 'Nueva capa',
  labelPrefix = 'Capa',
  addDisabled = false,
  addDisabledReason
}) => {
  const remove = (event: MouseEvent, id: string) => {
    event.stopPropagation()
    onRemove(id)
  }

  return (
    <div className='flex flex-wrap items-center gap-1.5'>
      {items.map((item, index) => {
        const active = item.id === activeId
        const title = item.label?.trim() || `${labelPrefix} ${index + 1}`

        return (
          <div
            key={item.id}
            className={cn(
              'group inline-flex h-8 items-center overflow-hidden rounded-[12px] text-xs transition-colors',
              active
                ? 'bg-primary/25 text-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            )}
          >
            <button type='button' className='max-w-[7.5rem] truncate px-2.5 py-1.5 font-medium' onClick={() => onSelect(item.id)}>
              {title}
            </button>
            {items.length > 1 && (
              <button
                type='button'
                aria-label={`Quitar ${title}`}
                className={cn(
                  'px-1.5 py-1.5 transition-colors',
                  active
                    ? 'text-muted-foreground hover:bg-primary/15 hover:text-foreground'
                    : 'text-muted-foreground/80 hover:bg-muted hover:text-foreground'
                )}
                onClick={event => remove(event, item.id)}
              >
                <XIcon className='size-3' />
              </button>
            )}
          </div>
        )
      })}

      <Button
        type='button'
        variant='dashed'
        size='sm'
        className='text-muted-foreground hover:text-foreground h-8 gap-1 rounded-[12px] px-2.5 text-xs'
        aria-label={addLabel}
        title={addDisabled ? addDisabledReason : undefined}
        disabled={addDisabled}
        onClick={onAdd}
      >
        <PlusIcon className='size-3.5' />
        <span>{addLabel}</span>
      </Button>
    </div>
  )
}

TabLayer.displayName = 'Tab.Layer'

export { TabLayer }
