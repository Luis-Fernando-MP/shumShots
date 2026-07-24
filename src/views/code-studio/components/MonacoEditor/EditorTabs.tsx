'use client'

import { cn } from '@common/utils/cn'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import type { TabStyle } from '@views/code-studio/utils/preferences.types'
import { FileTypeIcon } from '@views/code-studio/components/workspaceIcons'
import { Plus, X } from 'lucide-react'
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react'

interface EditorTabsProps {
  foreground?: string
  tabStyle: TabStyle
  tabBadges: boolean
  showTabAdd: boolean
}

const TabItem: FC<{
  id: string
  name: string
  active: boolean
  dirty: boolean
  canClose: boolean
  tabStyle: TabStyle
  tabBadges: boolean
  foreground?: string
  onSelect: () => void
  onClose: () => void
  onRename: (name: string) => void
}> = ({
  id,
  name,
  active,
  dirty,
  canClose,
  tabStyle,
  tabBadges,
  foreground,
  onSelect,
  onClose,
  onRename
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(name)
  }, [name, editing])

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  const commit = () => {
    const next = draft.trim() || name
    if (next !== name) onRename(next)
    setEditing(false)
  }

  const colorStyle = foreground ? { color: foreground } : undefined

  return (
    <div
      role='tab'
      aria-selected={active}
      data-tab-id={id}
      onClick={() => {
        if (!editing) onSelect()
      }}
      onDoubleClick={e => {
        e.preventDefault()
        e.stopPropagation()
        setEditing(true)
      }}
      className={cn(
        'group relative flex h-7 max-w-[10.5rem] min-w-0 shrink-0 cursor-pointer items-center gap-1.5 px-2 text-xs leading-none transition-colors',
        tabStyle === 'soft' && 'rounded-md',
        tabStyle === 'browser' && 'rounded-t-md',
        tabStyle === 'underline' && 'rounded-none',
        active && tabStyle === 'soft' && 'bg-current/12 font-medium',
        active && tabStyle === 'browser' && 'bg-current/10 font-medium',
        active && tabStyle === 'underline' && 'font-medium',
        !active && 'opacity-55 hover:bg-current/6 hover:opacity-90'
      )}
    >
      {active && tabStyle === 'underline' && (
        <span className='bg-current absolute inset-x-1 bottom-0 h-0.5 rounded-full opacity-70' />
      )}

      <FileTypeIcon fileName={name} />

      {editing && (
        <input
          ref={inputRef}
          value={draft}
          aria-label={`Renombrar ${name}`}
          className='min-w-[3ch] max-w-[7rem] flex-1 truncate border-0 bg-transparent p-0 text-xs outline-none'
          style={colorStyle}
          onClick={e => e.stopPropagation()}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') {
              setDraft(name)
              setEditing(false)
            }
          }}
        />
      )}
      {!editing && <span className='min-w-0 flex-1 truncate'>{name}</span>}

      {tabBadges && dirty && (
        <span className='bg-current size-1.5 shrink-0 rounded-full opacity-70' aria-label='Sin guardar' />
      )}

      {canClose && (
        <button
          type='button'
          aria-label={`Cerrar ${name}`}
          className={cn(
            'inline-flex size-4 shrink-0 items-center justify-center rounded-sm',
            'opacity-0 transition-opacity group-hover:opacity-70 hover:!opacity-100',
            active && 'opacity-50'
          )}
          onClick={e => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X className='size-3' />
        </button>
      )}
    </div>
  )
}

export const EditorTabs: FC<EditorTabsProps> = ({
  foreground,
  tabStyle,
  tabBadges,
  showTabAdd
}) => {
  const entries = useWorkspaceStore(s => s.entries)
  const openTabIds = useWorkspaceStore(s => s.openTabIds)
  const activeFileId = useWorkspaceStore(s => s.activeFileId)
  const dirtyFileIds = useWorkspaceStore(s => s.dirtyFileIds)
  const setActiveFile = useWorkspaceStore(s => s.setActiveFile)
  const closeTab = useWorkspaceStore(s => s.closeTab)
  const addFile = useWorkspaceStore(s => s.addFile)
  const renameEntry = useWorkspaceStore(s => s.renameEntry)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const colorStyle = foreground ? { color: foreground } : undefined

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const active = el.querySelector<HTMLElement>(`[data-tab-id="${activeFileId}"]`)
    active?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' })
  }, [activeFileId, openTabIds.length])

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 items-center gap-1',
        tabStyle === 'browser' && 'items-end'
      )}
      style={colorStyle}
      role='tablist'
    >
      <div
        ref={scrollerRef}
        className={cn(
          'scrollbar-hidden flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scroll-smooth',
          tabStyle === 'browser' && 'items-end gap-px'
        )}
      >
        {openTabIds.map(id => {
          const file = entries[id]
          if (!file) return null
          if (file.kind !== 'file') return null

          return (
            <TabItem
              key={id}
              id={id}
              name={file.name}
              active={id === activeFileId}
              dirty={dirtyFileIds.includes(id)}
              canClose={openTabIds.length > 1}
              tabStyle={tabStyle}
              tabBadges={tabBadges}
              foreground={foreground}
              onSelect={() => setActiveFile(id)}
              onClose={() => closeTab(id)}
              onRename={next => renameEntry(id, next)}
            />
          )
        })}
      </div>

      {showTabAdd && (
        <button
          type='button'
          aria-label='Nueva pestaña'
          className='inline-flex size-6 shrink-0 items-center justify-center rounded-md opacity-55 transition-opacity hover:bg-current/10 hover:opacity-100'
          onClick={() => addFile()}
        >
          <Plus className='size-3.5' />
        </button>
      )}
    </div>
  )
}
