import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  DEFAULT_POSITION_ID,
  SLOT_POSITIONS,
  type SlotPositionId
} from '@views/image-studio/Popups/CanvasImages/ImagesCount/presets/positions/data'

type GridState = {
  constrainToParent: boolean
  positionId: SlotPositionId
  setConstrainToParent: (value: boolean) => void
  setPositionId: (id: SlotPositionId) => void
  reset: () => void
}

const STORAGE_KEY = 'pixis:image-studio:grid'

const defaults: Pick<GridState, 'constrainToParent' | 'positionId'> = {
  constrainToParent: true,
  positionId: DEFAULT_POSITION_ID
}

const normalizePositionId = (id: string, fallback = DEFAULT_POSITION_ID): SlotPositionId => {
  if (SLOT_POSITIONS[id]) return id
  const family = id.replace(/-\d+$/, '')
  if (family && SLOT_POSITIONS[family]) return family
  return fallback
}

const state: StateCreator<GridState> = set => ({
  ...defaults,
  setConstrainToParent: value => set({ constrainToParent: value }),
  setPositionId: id => set({ positionId: normalizePositionId(id) }),
  reset: () => set({ ...defaults })
})

const useGridStore = create(
  persist(state, {
    name: STORAGE_KEY,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      constrainToParent: s.constrainToParent,
      positionId: s.positionId
    }),
    migrate: persisted => persisted,
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
