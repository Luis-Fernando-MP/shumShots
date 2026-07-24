import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_ACTIVITY_ORDER,
  DEFAULT_FILE_ID,
  ROOT_ID,
  createDefaultFilesystem,
  getChildren,
  getPathSegments,
  newId,
  type ActivityIconId,
  type FsEntry
} from '../utils/workspace.types'

interface WorkspaceState {
  entries: Record<string, FsEntry>
  openTabIds: string[]
  activeFileId: string
  dirtyFileIds: string[]
  activityOrder: ActivityIconId[]
  activityActive: ActivityIconId
}

interface WorkspaceActions {
  setFileContent: (id: string, content: string) => void
  renameEntry: (id: string, name: string) => void
  toggleFolder: (id: string) => void
  addFile: (parentId?: string, name?: string) => string
  addFolder: (parentId?: string, name?: string) => string
  deleteEntry: (id: string) => void
  moveEntry: (id: string, targetParentId: string) => void
  openFile: (id: string) => void
  closeTab: (id: string) => void
  setActiveFile: (id: string) => void
  setActivityActive: (id: ActivityIconId) => void
  moveActivityIcon: (id: ActivityIconId, direction: 'up' | 'down') => void
  setActivityOrder: (order: ActivityIconId[]) => void
  resetWorkspace: () => void
}

export type WorkspaceStore = WorkspaceState & WorkspaceActions

const WORKSPACE_STORAGE_KEY = 'code-studio-workspace'
const WORKSPACE_VERSION = 1

const initial = (): WorkspaceState => ({
  entries: createDefaultFilesystem(),
  openTabIds: [DEFAULT_FILE_ID],
  activeFileId: DEFAULT_FILE_ID,
  dirtyFileIds: [],
  activityOrder: [...DEFAULT_ACTIVITY_ORDER],
  activityActive: 'files'
})

const collectDescendants = (entries: Record<string, FsEntry>, id: string): string[] => {
  const kids = getChildren(entries, id)
  return kids.flatMap(kid => [kid.id, ...collectDescendants(entries, kid.id)])
}

const isInsideSubtree = (
  entries: Record<string, FsEntry>,
  ancestorId: string,
  nodeId: string
) => {
  let current: FsEntry | undefined = entries[nodeId]
  while (current) {
    if (current.id === ancestorId) return true
    current = current.parentId ? entries[current.parentId] : undefined
  }
  return false
}

const remainingFilesAfterRemove = (
  entries: Record<string, FsEntry>,
  toRemove: Set<string>
) => Object.values(entries).filter(entry => entry.kind === 'file' && !toRemove.has(entry.id))

const mergeWorkspace = (persisted?: Partial<WorkspaceState>): WorkspaceState => {
  const defaults = initial()
  if (!persisted?.entries || Object.keys(persisted.entries).length === 0) return defaults

  const entries = { ...persisted.entries }
  if (!entries[ROOT_ID]) {
    entries[ROOT_ID] = defaults.entries[ROOT_ID]
  }

  const openTabIds = (persisted.openTabIds ?? []).filter(
    id => entries[id]?.kind === 'file'
  )
  let activeFileId = persisted.activeFileId ?? DEFAULT_FILE_ID
  if (entries[activeFileId]?.kind !== 'file') {
    activeFileId = openTabIds[0] ?? DEFAULT_FILE_ID
  }
  if (entries[activeFileId]?.kind !== 'file') {
    return defaults
  }
  if (!openTabIds.includes(activeFileId)) openTabIds.push(activeFileId)

  const activityOrder =
    persisted.activityOrder?.length === DEFAULT_ACTIVITY_ORDER.length
      ? persisted.activityOrder
      : defaults.activityOrder

  return {
    entries,
    openTabIds,
    activeFileId,
    dirtyFileIds: (persisted.dirtyFileIds ?? []).filter(id => entries[id]?.kind === 'file'),
    activityOrder,
    activityActive: persisted.activityActive ?? defaults.activityActive
  }
}

const state: StateCreator<WorkspaceStore> = (set, get) => ({
  ...initial(),

  setFileContent: (id, content) =>
    set(s => {
      const entry = s.entries[id]
      if (!entry || entry.kind !== 'file') return s
      if (entry.content === content) return s
      return {
        entries: { ...s.entries, [id]: { ...entry, content } },
        dirtyFileIds: s.dirtyFileIds.includes(id) ? s.dirtyFileIds : [...s.dirtyFileIds, id]
      }
    }),

  renameEntry: (id, name) =>
    set(s => {
      const entry = s.entries[id]
      if (!entry || id === ROOT_ID) return s
      const next = name.trim() || entry.name
      return {
        entries: { ...s.entries, [id]: { ...entry, name: next } }
      }
    }),

  toggleFolder: id =>
    set(s => {
      const entry = s.entries[id]
      if (!entry || entry.kind !== 'folder') return s
      return {
        entries: { ...s.entries, [id]: { ...entry, expanded: !entry.expanded } }
      }
    }),

  addFile: (parentId, name) => {
    const id = newId('file')
    const parent = parentId ?? get().activeFileId
    const parentEntry = get().entries[parent]
    const folderId =
      parentEntry?.kind === 'folder' ? parentEntry.id : (parentEntry?.parentId ?? ROOT_ID)
    const fileName = name?.trim() || 'untitled.ts'

    set(s => ({
      entries: {
        ...s.entries,
        [id]: {
          id,
          parentId: folderId,
          kind: 'file',
          name: fileName,
          content: `// ${fileName}\n\n`
        }
      },
      openTabIds: s.openTabIds.includes(id) ? s.openTabIds : [...s.openTabIds, id],
      activeFileId: id,
      activityActive: 'files'
    }))

    return id
  },

  addFolder: (parentId, name) => {
    const id = newId('folder')
    const parent = parentId ?? ROOT_ID
    const parentEntry = get().entries[parent]
    const folderId =
      parentEntry?.kind === 'folder' ? parentEntry.id : (parentEntry?.parentId ?? ROOT_ID)

    set(s => ({
      entries: {
        ...s.entries,
        [folderId]:
          s.entries[folderId]?.kind === 'folder'
            ? { ...s.entries[folderId], expanded: true }
            : s.entries[folderId],
        [id]: {
          id,
          parentId: folderId,
          kind: 'folder',
          name: name?.trim() || 'nueva-carpeta',
          expanded: true
        }
      },
      activityActive: 'files'
    }))

    return id
  },

  deleteEntry: id =>
    set(s => {
      if (id === ROOT_ID) return s
      const entry = s.entries[id]
      if (!entry) return s

      const toRemove = new Set([id, ...collectDescendants(s.entries, id)])
      const remainingFiles = remainingFilesAfterRemove(s.entries, toRemove)
      if (remainingFiles.length === 0) return s

      const entries = { ...s.entries }
      toRemove.forEach(key => {
        delete entries[key]
      })

      const openTabIds = s.openTabIds.filter(tabId => !toRemove.has(tabId))
      let activeFileId = s.activeFileId
      if (toRemove.has(activeFileId)) {
        activeFileId = openTabIds[openTabIds.length - 1] ?? remainingFiles[0].id
        if (!openTabIds.includes(activeFileId)) openTabIds.push(activeFileId)
      }

      return {
        entries,
        openTabIds,
        activeFileId,
        dirtyFileIds: s.dirtyFileIds.filter(fileId => !toRemove.has(fileId))
      }
    }),

  moveEntry: (id, targetParentId) =>
    set(s => {
      if (id === ROOT_ID) return s
      const entry = s.entries[id]
      const target = s.entries[targetParentId]
      if (!entry || !target || target.kind !== 'folder') return s
      if (entry.parentId === targetParentId) return s
      if (isInsideSubtree(s.entries, id, targetParentId)) return s

      return {
        entries: {
          ...s.entries,
          [targetParentId]:
            target.id === ROOT_ID ? target : { ...target, expanded: true },
          [id]: { ...entry, parentId: targetParentId }
        },
        activityActive: 'files'
      }
    }),

  openFile: id =>
    set(s => {
      const entry = s.entries[id]
      if (!entry || entry.kind !== 'file') return s
      return {
        openTabIds: s.openTabIds.includes(id) ? s.openTabIds : [...s.openTabIds, id],
        activeFileId: id
      }
    }),

  closeTab: id =>
    set(s => {
      if (s.openTabIds.length <= 1) return s
      const openTabIds = s.openTabIds.filter(tabId => tabId !== id)
      const activeFileId =
        s.activeFileId === id
          ? (openTabIds[openTabIds.length - 1] ?? DEFAULT_FILE_ID)
          : s.activeFileId
      return { openTabIds, activeFileId }
    }),

  setActiveFile: id =>
    set(s => {
      if (!s.entries[id] || s.entries[id].kind !== 'file') return s
      return {
        activeFileId: id,
        openTabIds: s.openTabIds.includes(id) ? s.openTabIds : [...s.openTabIds, id]
      }
    }),

  setActivityActive: id => set({ activityActive: id }),

  moveActivityIcon: (id, direction) =>
    set(s => {
      const order = [...s.activityOrder]
      const index = order.indexOf(id)
      if (index < 0) return s
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= order.length) return s
      ;[order[index], order[target]] = [order[target], order[index]]
      return { activityOrder: order }
    }),

  setActivityOrder: order => set({ activityOrder: order }),

  resetWorkspace: () => set(initial())
})

const useWorkspaceStore = create(
  persist(state, {
    name: WORKSPACE_STORAGE_KEY,
    version: WORKSPACE_VERSION,
    partialize: (s): WorkspaceState => ({
      entries: s.entries,
      openTabIds: s.openTabIds,
      activeFileId: s.activeFileId,
      dirtyFileIds: s.dirtyFileIds,
      activityOrder: s.activityOrder,
      activityActive: s.activityActive
    }),
    merge: (persisted, current) => ({
      ...current,
      ...mergeWorkspace(persisted as Partial<WorkspaceState> | undefined)
    })
  })
)

export default useWorkspaceStore

export const selectActiveFile = (s: WorkspaceStore) => s.entries[s.activeFileId]

export const selectActivePath = (s: WorkspaceStore) =>
  getPathSegments(s.entries, s.activeFileId).join(' / ')
