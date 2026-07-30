import { create, type StateCreator } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { layerAppliesTo } from '@views/image-studio/Popups/common/lib/fx-shared/targeting'
import { createId } from '@views/image-studio/utils/createId'

import {
  clampSize,
  createLayer,
  DEFAULT_SLOT_SIZE,
  STORAGE_KEY,
  STORAGE_VERSION
} from './initialState'
import type SizeState from './type.slot-size'
import type { SizeLayer } from './type.slot-size'

const initialLayer = createLayer()

const getActiveLayer = (state: Pick<SizeState, 'layers' | 'activeLayerId'>) =>
  state.layers.find(layer => layer.id === state.activeLayerId) ?? state.layers[0] ?? null

export const selectActiveSizeLayer = (state: SizeState) => getActiveLayer(state)

export const resolveFromSizeLayers = (
  layers: SizeLayer[],
  slotId: string
): { width: number; height: number } => {
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i]
    if (layerAppliesTo(layer.targetIds, slotId)) {
      return { width: layer.width, height: layer.height }
    }
  }
  return { width: DEFAULT_SLOT_SIZE.width, height: DEFAULT_SLOT_SIZE.height }
}

const state: StateCreator<SizeState> = (set, get) => ({
  layers: [initialLayer],
  activeLayerId: initialLayer.id,

  setActiveLayer: id => {
    if (!get().layers.some(layer => layer.id === id)) return
    set({ activeLayerId: id })
  },

  addLayer: () => {
    const layer = createLayer()
    set(s => ({ layers: [...s.layers, layer], activeLayerId: layer.id }))
  },

  removeLayer: id => {
    const { layers, activeLayerId } = get()
    if (layers.length <= 1) return
    const next = layers.filter(layer => layer.id !== id)
    if (next.length === layers.length) return
    set({
      layers: next,
      activeLayerId: activeLayerId === id ? next[0].id : activeLayerId
    })
  },

  setLayerTargets: ids => {
    const active = getActiveLayer(get())
    if (!active) return
    set(s => ({
      layers: s.layers.map(layer =>
        layer.id === active.id ? { ...layer, targetIds: ids } : layer
      )
    }))
  },

  setLayerWidth: width => {
    const active = getActiveLayer(get())
    if (!active) return
    const next = clampSize(width)
    set(s => ({
      layers: s.layers.map(layer => (layer.id === active.id ? { ...layer, width: next } : layer))
    }))
  },

  setLayerHeight: height => {
    const active = getActiveLayer(get())
    if (!active) return
    const next = clampSize(height)
    set(s => ({
      layers: s.layers.map(layer => (layer.id === active.id ? { ...layer, height: next } : layer))
    }))
  },

  setLayerSize: (width, height) => {
    const active = getActiveLayer(get())
    if (!active) return
    const nextW = clampSize(width)
    const nextH = clampSize(height)
    set(s => ({
      layers: s.layers.map(layer =>
        layer.id === active.id ? { ...layer, width: nextW, height: nextH } : layer
      )
    }))
  },

  syncFromTabs: (tabLayers, activeLayerId) => {
    set(s => {
      const byId = new Map(s.layers.map(layer => [layer.id, layer]))
      const layers = tabLayers.map(tab => {
        const existing = byId.get(tab.id)
        if (existing) return { ...existing, targetIds: tab.targetIds }
        return { ...createLayer(tab.id), targetIds: tab.targetIds }
      })
      const nextActive = layers.some(layer => layer.id === activeLayerId)
        ? activeLayerId
        : layers[0]?.id ?? s.activeLayerId
      return { layers, activeLayerId: nextActive }
    })
  },

  purgeSlotTargets: slotIds => {
    if (slotIds.length === 0) return
    const removed = new Set(slotIds)
    set(s => ({
      layers: s.layers.map(layer => ({
        ...layer,
        targetIds: layer.targetIds.filter(id => !removed.has(id))
      }))
    }))
  },

  reset: () => {
    const layer = createLayer()
    set({ layers: [layer], activeLayerId: layer.id })
  },

  resolveSlotSize: slotId => resolveFromSizeLayers(get().layers, slotId)
})

const useSizeStore = create(
  persist(state, {
    name: STORAGE_KEY,
    version: STORAGE_VERSION,
    skipHydration: true,
    storage: createJSONStorage(() => localStorage),
    partialize: s => ({
      layers: s.layers,
      activeLayerId: s.activeLayerId
    }),
    merge: (persisted, current) => {
      const data = (persisted ?? {}) as Partial<SizeState>
      const raw = Array.isArray(data.layers) && data.layers.length > 0 ? data.layers : current.layers
      const layers = raw.map(layer => ({
        id: typeof layer.id === 'string' ? layer.id : createId('size'),
        targetIds: Array.isArray(layer.targetIds)
          ? layer.targetIds.filter((id): id is string => typeof id === 'string')
          : [],
        width: clampSize(typeof layer.width === 'number' ? layer.width : DEFAULT_SLOT_SIZE.width),
        height: clampSize(typeof layer.height === 'number' ? layer.height : DEFAULT_SLOT_SIZE.height)
      }))
      const activeLayerId =
        typeof data.activeLayerId === 'string' && layers.some(layer => layer.id === data.activeLayerId)
          ? data.activeLayerId
          : layers[0].id
      return { ...current, layers, activeLayerId }
    }
  })
)

export const resolveSlotSizeFromState = resolveFromSizeLayers
export { DEFAULT_SLOT_SIZE }
export type { SizeLayer }
export default useSizeStore
