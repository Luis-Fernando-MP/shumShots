import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_POSITION_ID,
  defaultPositionIdForCount,
  SLOT_POSITIONS,
  type SlotPositionId
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/presets/positions/data'

type GridState = {
  constrainToParent: boolean
  positionId: SlotPositionId
  setConstrainToParent: (value: boolean) => void
  setPositionId: (id: SlotPositionId) => void
  ensurePositionForCount: (count: number) => void
  reset: () => void
}

const STORAGE_KEY = 'pixis:image-studio:grid'
const STORAGE_VERSION = 2

const defaults: Pick<GridState, 'constrainToParent' | 'positionId'> = {
  constrainToParent: true,
  positionId: DEFAULT_POSITION_ID
}

const normalizePositionId = (id: string, fallback = DEFAULT_POSITION_ID): SlotPositionId => {
  if (SLOT_POSITIONS[id]) return id
  const legacy = SLOT_POSITIONS[`${id}-1`]
  if (legacy) return legacy.id
  return fallback
}

const state: StateCreator<GridState> = (set, get) => ({
  ...defaults,
  setConstrainToParent: value => set({ constrainToParent: value }),
  setPositionId: id => set({ positionId: normalizePositionId(id) }),
  ensurePositionForCount: count => {
    const current = get().positionId
    const entry = SLOT_POSITIONS[current]
    if (entry && entry.count === count) return
    set({ positionId: defaultPositionIdForCount(count) })
  },
  reset: () => set({ ...defaults })
})

const useGridStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      constrainToParent: s.constrainToParent,
      positionId: s.positionId
    }),
    migrate: (persisted, version) => {
      const data = (persisted ?? {}) as Partial<GridState>
      if (version < 2 && typeof data.positionId === 'string') {
        return {
          ...data,
          positionId: normalizePositionId(data.positionId)
        }
      }
      return data
    },
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as Partial<GridState>
      return {
        ...current,
        constrainToParent:
          typeof data.constrainToParent === 'boolean'
            ? data.constrainToParent
            : current.constrainToParent,
        positionId:
          typeof data.positionId === 'string'
            ? normalizePositionId(data.positionId, current.positionId)
            : current.positionId
      }
    }
  })
)

export type { SlotPositionId as GridPositionId }
export default useGridStore
