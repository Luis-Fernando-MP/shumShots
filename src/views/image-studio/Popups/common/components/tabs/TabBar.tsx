'use client'

import { Button } from '@common/ui/Button'
import { cn } from '@common/utils/cn'
import { PlusIcon, XIcon } from 'lucide-react'
import type { FC, MouseEvent } from 'react'

type TabItem = { id: string }

type Props = {
  items: TabItem[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
  addLabel?: string
}

const TabBar: FC<Props> = ({
  items,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  addLabel = 'Nueva capa'
}) => {
  const remove = (event: MouseEvent, id: string) => {
    event.stopPropagation()
    onRemove(id)
  }

  return (
    <div className='scrollbar-hidden flex items-center gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/20 p-1'>
      {items.map((item, index) => {
        const active = item.id === activeId
        return (
          <Button
            key={item.id}
            type='button'
            variant={active ? 'secondary' : 'ghost'}
            size='sm'
            className={cn(
              'h-7 shrink-0 gap-1 rounded-md px-2.5 text-xs',
              active && 'bg-card shadow-sm ring-1 ring-primary/30'
            )}
            onClick={() => onSelect(item.id)}
          >
            <span className='tabular-nums'>{index + 1}</span>
            {items.length > 1 && (
              <span
                role='button'
                tabIndex={-1}
                aria-label='Quitar capa'
                className='text-muted-foreground hover:text-foreground -mr-0.5 rounded-sm'
                onClick={event => remove(event, item.id)}
              >
                <XIcon className='size-3' />
              </span>
            )}
          </Button>
        )
      })}
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='text-muted-foreground h-7 shrink-0 px-2'
        aria-label={addLabel}
        onClick={onAdd}
      >
        <PlusIcon className='size-3.5' />
      </Button>
    </div>
  )
}

export default TabBar
