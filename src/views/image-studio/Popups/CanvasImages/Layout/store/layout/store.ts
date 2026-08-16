import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  getPositionEntry,
  type SlotPositionId
} from '@views/image-studio/Popups/CanvasImages/Layout/presets/positions/data'

import { initialLayoutState } from './initialState'
import {
  DEFAULT_SLOT_OFFSET,
  type LayoutStateShape,
  type SlotOffset
} from './type.layout'

type LayoutState = LayoutStateShape & {
  setConstrainToParent: (value: boolean) => void
  setPositionId: (id: SlotPositionId) => void
  syncPositionForCount: (count: number) => void
  setOffsetForSlots: (targetIds: string[], allSlotIds: string[], offset: SlotOffset) => void
  getOffsetForSlot: (slotId: string) => SlotOffset
  purgeSlotOffsets: (slotIds: string[]) => void
  reset: () => void
}

const STORAGE_KEY = 'pixis:image-studio:layout'

const normalizeOffset = (value: unknown): SlotOffset => {
  if (!value || typeof value !== 'object') return DEFAULT_SLOT_OFFSET
  const raw = value as Partial<SlotOffset>
  const x = typeof raw.x === 'number' ? Math.min(1, Math.max(0, raw.x)) : DEFAULT_SLOT_OFFSET.x
  const y = typeof raw.y === 'number' ? Math.min(1, Math.max(0, raw.y)) : DEFAULT_SLOT_OFFSET.y
  return { x, y }
}

const state: StateCreator<LayoutState> = (set, get) => ({
  ...initialLayoutState,
  setConstrainToParent: value => set({ constrainToParent: value }),
  setPositionId: id => set({ positionId: id }),
  syncPositionForCount: count => {
    const current = get().positionId
    const family = current.replace(/-\d+$/, '')
    const next = getPositionEntry(count, family).id
    if (next !== current) set({ positionId: next })
  },
  setOffsetForSlots: (targetIds, allSlotIds, offset) => {
    const next = normalizeOffset(offset)
    const targets = targetIds.length > 0 ? targetIds : allSlotIds
    if (targets.length === 0) return
    set(s => {
      const slotOffset = { ...s.slotOffset }
      for (const id of targets) slotOffset[id] = next
      return { slotOffset }
    })
  },
  getOffsetForSlot: slotId => get().slotOffset[slotId] ?? DEFAULT_SLOT_OFFSET,
  purgeSlotOffsets: slotIds => {
    if (slotIds.length === 0) return
    set(s => {
      const slotOffset = { ...s.slotOffset }
      for (const id of slotIds) delete slotOffset[id]
      return { slotOffset }
    })
  },
  reset: () => set({ ...initialLayoutState })
})

const useLayoutStore = create(
  persist(state, {
    name: STORAGE_KEY,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      constrainToParent: s.constrainToParent,
      positionId: s.positionId,
      slotOffset: s.slotOffset
    }),
    migrate: persisted => persisted,
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as Partial<LayoutStateShape>
      const slotOffset: Record<string, SlotOffset> = {}
      if (data.slotOffset && typeof data.slotOffset === 'object') {
        for (const [id, value] of Object.entries(data.slotOffset)) {
          slotOffset[id] = normalizeOffset(value)
        }
      }
      return {
        ...current,
        constrainToParent:
          typeof data.constrainToParent === 'boolean'
            ? data.constrainToParent
            : current.constrainToParent,
        positionId: typeof data.positionId === 'string' ? data.positionId : current.positionId,
        slotOffset
      }
    }
  })
)

/** Copy old grid persist key into layout key before rehydrate (once). */
export const migrateLegacyGridPersist = () => {
  try {
    const legacy = localStorage.getItem('pixis:image-studio:grid')
    if (!legacy) return
    if (localStorage.getItem(STORAGE_KEY)) return
    localStorage.setItem(STORAGE_KEY, legacy)
  } catch {
    /* ignore */
  }
}

export type { SlotPositionId as LayoutPositionId }
export { DEFAULT_SLOT_OFFSET }
export default useLayoutStore
