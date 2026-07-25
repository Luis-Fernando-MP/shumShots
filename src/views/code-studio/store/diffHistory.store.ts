import { StateCreator, create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DiffHistoryEntry = {
  original: string
  revision: number
}

interface DiffHistoryState {
  byFileId: Record<string, DiffHistoryEntry>
}

interface DiffHistoryActions {
  ensureOriginal: (fileId: string, content: string) => string
  setOriginal: (fileId: string, content: string) => void
  removeFile: (fileId: string) => void
  resetDiffHistory: () => void
}

export type DiffHistoryStore = DiffHistoryState & DiffHistoryActions

const DIFF_HISTORY_STORAGE_KEY = 'code-studio-diff-history'
const DIFF_HISTORY_VERSION = 2

const initial = (): DiffHistoryState => ({ byFileId: {} })

const nextRevision = (prev?: number) => (prev && prev > 0 ? prev + 1 : 1)

const mergeDiffHistory = (persisted?: Partial<DiffHistoryState>): DiffHistoryState => {
  if (!persisted?.byFileId || typeof persisted.byFileId !== 'object') return initial()

  const byFileId: Record<string, DiffHistoryEntry> = {}
  for (const [fileId, entry] of Object.entries(persisted.byFileId)) {
    if (!entry || typeof entry.original !== 'string') continue
    byFileId[fileId] = {
      original: entry.original,
      revision: typeof entry.revision === 'number' && entry.revision > 0 ? entry.revision : 1
    }
  }
  return { byFileId }
}

const state: StateCreator<DiffHistoryStore> = (set, get) => ({
  ...initial(),

  ensureOriginal: (fileId, content) => {
    const existing = get().byFileId[fileId]
    if (existing) return existing.original
    set(s => ({
      byFileId: { ...s.byFileId, [fileId]: { original: content, revision: 1 } }
    }))
    return content
  },

  setOriginal: (fileId, content) =>
    set(s => ({
      byFileId: {
        ...s.byFileId,
        [fileId]: {
          original: content,
          revision: nextRevision(s.byFileId[fileId]?.revision)
        }
      }
    })),

  removeFile: fileId =>
    set(s => {
      if (!(fileId in s.byFileId)) return s
      const byFileId = { ...s.byFileId }
      delete byFileId[fileId]
      return { byFileId }
    }),

  resetDiffHistory: () => set(initial())
})

const useDiffHistoryStore = create(
  persist(state, {
    name: DIFF_HISTORY_STORAGE_KEY,
    version: DIFF_HISTORY_VERSION,
    partialize: (s): DiffHistoryState => ({ byFileId: s.byFileId }),
    merge: (persisted, current) => ({
      ...current,
      ...mergeDiffHistory(persisted as Partial<DiffHistoryState> | undefined)
    })
  })
)

export default useDiffHistoryStore
