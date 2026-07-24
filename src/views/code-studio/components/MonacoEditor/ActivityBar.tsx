'use client'

import { cn } from '@common/utils/cn'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import type { ActivityIconId } from '@views/code-studio/utils/workspace.types'
import { Blocks, Files, GitBranch, Search, Settings } from 'lucide-react'
import { type FC } from 'react'

const ICON_MAP = {
  files: Files,
  search: Search,
  git: GitBranch,
  blocks: Blocks,
  settings: Settings
} as const satisfies Record<ActivityIconId, typeof Files>

interface ActivityBarProps {
  foreground?: string
  className?: string
}

export const ActivityBar: FC<ActivityBarProps> = ({ foreground, className }) => {
  const order = useWorkspaceStore(s => s.activityOrder)
  const active = useWorkspaceStore(s => s.activityActive)
  const setActivityActive = useWorkspaceStore(s => s.setActivityActive)

  return (
    <aside
      className={cn(
        'flex w-10 shrink-0 flex-col items-center gap-1 border-r border-current/10 py-2',
        className
      )}
      style={foreground ? { color: foreground } : undefined}
    >
      {order.map(id => {
        const Icon = ICON_MAP[id]
        const isActive = active === id
        return (
          <button
            key={id}
            type='button'
            aria-label={id}
            aria-pressed={isActive}
            onClick={() => setActivityActive(id)}
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-md transition-opacity',
              isActive && 'bg-current/12 opacity-100',
              !isActive && 'opacity-45 hover:opacity-75'
            )}
          >
            <Icon className='size-3.5' strokeWidth={1.75} />
          </button>
        )
      })}
    </aside>
  )
}
