'use client'

import { cn } from '@common/utils/cn'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore, { selectActivePath } from '@views/code-studio/store/workspace.store'
import { chromeDefaults } from '@views/code-studio/utils/preferences.config'
import { type FC, useMemo } from 'react'

interface EditorBreadcrumbProps {
  foreground?: string
  className?: string
}

export const EditorBreadcrumb: FC<EditorBreadcrumbProps> = ({ foreground, className }) => {
  const separator =
    usePixisPreferencesStore(s => s.pixis.chrome.breadcrumbSeparator) ??
    chromeDefaults.breadcrumbSeparator
  const path = useWorkspaceStore(selectActivePath)
  const parts = useMemo(() => path.split(' / ').filter(Boolean), [path])

  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-1.5 overflow-hidden border-b border-current/8 px-3 py-1.5 text-[11px] leading-none select-none',
        className
      )}
      style={foreground ? { color: foreground } : undefined}
      aria-label='Breadcrumb del archivo'
    >
      {parts.length === 0 && <span className='opacity-55'>workspace</span>}
      {parts.length > 0 &&
        parts.map((part, index) => (
          <span key={`${part}-${index}`} className='flex min-w-0 items-center gap-1.5'>
            {index > 0 && <span className='shrink-0 opacity-45'>{separator}</span>}
            <span
              className={cn(
                'truncate opacity-70',
                index === parts.length - 1 && 'font-medium opacity-90'
              )}
            >
              {part}
            </span>
          </span>
        ))}
    </div>
  )
}
