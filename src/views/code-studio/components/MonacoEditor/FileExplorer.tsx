'use client'

import { cn } from '@common/utils/cn'
import usePixisPreferencesStore from '@views/code-studio/store/pixisPreferences.store'
import useWorkspaceStore from '@views/code-studio/store/workspace.store'
import {
  EXPLORER_WIDTH_DEFAULT,
  EXPLORER_WIDTH_MAX,
  EXPLORER_WIDTH_MIN,
  chromeDefaults
} from '@views/code-studio/utils/preferences.config'
import { ROOT_ID, getChildren, type FsEntry } from '@views/code-studio/utils/workspace.types'
import { FileTypeIcon, FolderTypeIcon } from '@views/code-studio/utils/workspaceIcons'
import { ChevronDown, ChevronRight, FilePlus, FolderPlus, Trash2 } from 'lucide-react'
import {
  type DragEvent,
  type FC,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

interface FileExplorerProps {
  foreground?: string
  className?: string
}

const DND_TYPE = 'application/x-pixis-fs-id'
const ROW_H = 22
const INDENT = 8

const isInside = (entries: Record<string, FsEntry>, ancestorId: string, nodeId: string) => {
  let current: FsEntry | undefined = entries[nodeId]
  while (current) {
    if (current.id === ancestorId) return true
    current = current.parentId ? entries[current.parentId] : undefined
  }
  return false
}

const TreeNode: FC<{
  entry: FsEntry
  depth: number
  foreground?: string
  dropTargetId: string | null
  onDropTarget: (id: string | null) => void
}> = ({ entry, depth, foreground, dropTargetId, onDropTarget }) => {
  const entries = useWorkspaceStore(s => s.entries)
  const activeFileId = useWorkspaceStore(s => s.activeFileId)
  const openFile = useWorkspaceStore(s => s.openFile)
  const toggleFolder = useWorkspaceStore(s => s.toggleFolder)
  const renameEntry = useWorkspaceStore(s => s.renameEntry)
  const deleteEntry = useWorkspaceStore(s => s.deleteEntry)
  const moveEntry = useWorkspaceStore(s => s.moveEntry)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(entry.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const isFolder = entry.kind === 'folder'
  const children = isFolder && entry.expanded ? getChildren(entries, entry.id) : []
  const isActive = entry.kind === 'file' && entry.id === activeFileId
  const isDropTarget = dropTargetId === entry.id
  const canDelete = Object.values(entries).some(
    item => item.kind === 'file' && !isInside(entries, entry.id, item.id)
  )

  useEffect(() => {
    if (!editing) setDraft(entry.name)
  }, [entry.name, editing])

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  const commit = () => {
    const next = draft.trim() || entry.name
    if (next !== entry.name) renameEntry(entry.id, next)
    setEditing(false)
  }

  const onOpen = () => {
    if (editing) return
    if (isFolder) {
      toggleFolder(entry.id)
      return
    }
    openFile(entry.id)
  }

  const resolveDropParent = (target: FsEntry) => {
    if (target.kind === 'folder') return target.id
    return target.parentId ?? ROOT_ID
  }

  const onDragStart = (e: DragEvent) => {
    e.dataTransfer.setData(DND_TYPE, entry.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: DragEvent) => {
    if (![...e.dataTransfer.types].includes(DND_TYPE)) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    onDropTarget(resolveDropParent(entry))
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const sourceId = e.dataTransfer.getData(DND_TYPE)
    onDropTarget(null)
    if (!sourceId || sourceId === entry.id) return
    moveEntry(sourceId, resolveDropParent(entry))
  }

  return (
    <div>
      <div
        draggable={!editing}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cn(
          'group relative flex items-center gap-1 pr-1 text-[13px] leading-none select-none',
          isActive && 'bg-current/10',
          !isActive && 'hover:bg-current/5',
          isDropTarget && 'bg-current/14'
        )}
        style={{ height: ROW_H, paddingLeft: 8 + depth * INDENT }}
      >
        {isFolder && (
          <button
            type='button'
            className='inline-flex size-4 shrink-0 items-center justify-center opacity-70'
            onClick={e => {
              e.stopPropagation()
              toggleFolder(entry.id)
            }}
            aria-label={entry.expanded ? 'Colapsar' : 'Expandir'}
          >
            {entry.expanded && <ChevronDown className='size-3.5' strokeWidth={1.5} />}
            {!entry.expanded && <ChevronRight className='size-3.5' strokeWidth={1.5} />}
          </button>
        )}
        {!isFolder && <span className='inline-flex size-4 shrink-0' />}

        <button
          type='button'
          className='flex min-w-0 flex-1 items-center gap-1.5 text-left'
          onClick={onOpen}
          onDoubleClick={e => {
            e.preventDefault()
            e.stopPropagation()
            setEditing(true)
          }}
        >
          {isFolder && (
            <FolderTypeIcon folderName={entry.name} expanded={Boolean(entry.expanded)} />
          )}
          {!isFolder && <FileTypeIcon fileName={entry.name} />}

          {editing && (
            <input
              ref={inputRef}
              value={draft}
              className='min-w-0 flex-1 border border-current/25 bg-transparent px-0.5 text-[13px] outline-none'
              style={foreground ? { color: foreground } : undefined}
              onBlur={commit}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') commit()
                if (e.key === 'Escape') {
                  setDraft(entry.name)
                  setEditing(false)
                }
              }}
              onClick={e => e.stopPropagation()}
            />
          )}
          {!editing && <span className='truncate opacity-90'>{entry.name}</span>}
        </button>

        {canDelete && (
          <button
            type='button'
            aria-label='Eliminar'
            title='Eliminar'
            className='inline-flex size-4 shrink-0 items-center justify-center opacity-0 group-hover:opacity-70 hover:!opacity-100'
            onClick={e => {
              e.stopPropagation()
              deleteEntry(entry.id)
            }}
          >
            <Trash2 className='size-3' strokeWidth={1.5} />
          </button>
        )}
      </div>

      {children.map(child => (
        <TreeNode
          key={child.id}
          entry={child}
          depth={depth + 1}
          foreground={foreground}
          dropTargetId={dropTargetId}
          onDropTarget={onDropTarget}
        />
      ))}
    </div>
  )
}

export const FileExplorer: FC<FileExplorerProps> = ({ foreground, className }) => {
  const entries = useWorkspaceStore(s => s.entries)
  const addFile = useWorkspaceStore(s => s.addFile)
  const addFolder = useWorkspaceStore(s => s.addFolder)
  const moveEntry = useWorkspaceStore(s => s.moveEntry)
  const explorerWidthPx =
    usePixisPreferencesStore(s => s.pixis.chrome.explorerWidthPx) ??
    chromeDefaults.explorerWidthPx ??
    EXPLORER_WIDTH_DEFAULT
  const patchChrome = usePixisPreferencesStore(s => s.patchChrome)
  const roots = getChildren(entries, ROOT_ID)
  const dragging = useRef(false)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  const onPointerDown = useCallback(
    (e: { preventDefault: () => void; clientX: number }) => {
      e.preventDefault()
      dragging.current = true
      const startX = e.clientX
      const startWidth = explorerWidthPx

      const onMove = (ev: globalThis.PointerEvent) => {
        if (!dragging.current) return
        const next = Math.min(
          EXPLORER_WIDTH_MAX,
          Math.max(EXPLORER_WIDTH_MIN, startWidth + (ev.clientX - startX))
        )
        patchChrome({ explorerWidthPx: Math.round(next) })
      }

      const onUp = () => {
        dragging.current = false
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [explorerWidthPx, patchChrome]
  )

  const onRootDragOver = (e: DragEvent) => {
    if (![...e.dataTransfer.types].includes(DND_TYPE)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTargetId(ROOT_ID)
  }

  const onRootDrop = (e: DragEvent) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData(DND_TYPE)
    setDropTargetId(null)
    if (!sourceId) return
    moveEntry(sourceId, ROOT_ID)
  }

  return (
    <aside
      className={cn('relative flex shrink-0 flex-col border-r border-current/10', className)}
      style={{ color: foreground, width: explorerWidthPx }}
    >
      <div className='flex h-9 shrink-0 items-center justify-between gap-1 px-3'>
        <span className='text-[11px] font-semibold tracking-[0.04em] uppercase opacity-60'>
          Explorer
        </span>
        <div className='flex items-center'>
          <button
            type='button'
            aria-label='Nuevo archivo'
            title='Nuevo archivo'
            onClick={() => addFile(ROOT_ID)}
            className='inline-flex size-[22px] items-center justify-center opacity-70 hover:opacity-100'
          >
            <FilePlus className='size-3.5' strokeWidth={1.5} />
          </button>
          <button
            type='button'
            aria-label='Nueva carpeta'
            title='Nueva carpeta'
            onClick={() => addFolder(ROOT_ID)}
            className='inline-flex size-[22px] items-center justify-center opacity-70 hover:opacity-100'
          >
            <FolderPlus className='size-3.5' strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'scrollbar-hidden min-h-0 flex-1 overflow-y-auto py-0.5',
          dropTargetId === ROOT_ID && 'bg-current/5'
        )}
        onDragOver={onRootDragOver}
        onDragLeave={() => setDropTargetId(null)}
        onDrop={onRootDrop}
      >
        {roots.map(entry => (
          <TreeNode
            key={entry.id}
            entry={entry}
            depth={0}
            foreground={foreground}
            dropTargetId={dropTargetId}
            onDropTarget={setDropTargetId}
          />
        ))}
      </div>

      <div
        role='separator'
        aria-orientation='vertical'
        aria-label='Redimensionar explorador'
        onPointerDown={onPointerDown}
        className='absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize hover:bg-current/20'
      />
    </aside>
  )
}
