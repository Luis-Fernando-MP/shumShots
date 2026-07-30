import { LIGHT_PRESETS, type LightType, normalizeLightType } from '@views/image-studio/Popups/common/presets/light'
import { type StateCreator, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { STORAGE_KEY, createInitialLightState, defaultLightLayer } from './initialState'
import type LightState from './type.light'
import type { CanvasLightLayer, LightStackMode } from './type.light'

const sanitizeLayer = (layer: CanvasLightLayer): CanvasLightLayer => {
  const type = normalizeLightType(layer.type)
  return type === layer.type ? layer : { ...layer, type }
}

const state: StateCreator<LightState> = (set, get) => ({
  ...createInitialLightState(),

  getActive: () => {
    const { layers, activeId } = get()
    return layers.find(layer => layer.id === activeId) ?? layers[0] ?? defaultLightLayer(1)
  },

  setActive: id => {
    if (!get().layers.some(layer => layer.id === id)) return
    set({ activeId: id })
  },

  addLayer: () => {
    const layer = defaultLightLayer(get().layers.length + 1)
    set(s => ({
      layers: [...s.layers, layer],
      activeId: layer.id
    }))
  },

  removeLayer: id => {
    set(s => {
      if (s.layers.length <= 1) return s
      const layers = s.layers.filter(layer => layer.id !== id)
      const activeId = s.activeId === id ? layers[0].id : s.activeId
      return { layers, activeId }
    })
  },

  updateLight: patch => {
    set(s => ({
      layers: s.layers.map(layer => (layer.id === s.activeId ? { ...layer, ...patch } : layer))
    }))
  },

  applyLightPreset: (type: LightType) => {
    const preset = LIGHT_PRESETS.find(item => item.type === type)
    if (!preset) return
    set(s => ({
      layers: s.layers.map(layer =>
        layer.id === s.activeId
          ? {
              ...layer,
              type: preset.type,
              opacity: preset.opacity,
              size: preset.size,
              color: preset.color,
              focus: { x: preset.x, y: preset.y }
            }
          : layer
      )
    }))
  },

  setFocus: focus => {
    get().updateLight({ focus })
  },

  setStackMode: mode => set({ stackMode: mode }),

  reset: () => set(createInitialLightState())
})

const useCanvasLightStore = create(
  persist(state, {
    name: STORAGE_KEY,
    storage: createJSONStorage(() => localStorage),
    skipHydration: true,
    partialize: (s): Pick<LightState, 'layers' | 'activeId' | 'stackMode'> => ({
      layers: s.layers,
      activeId: s.activeId,
      stackMode: s.stackMode
    }),
    migrate: persisted => persisted,
    merge: (persisted, current) => {
      const raw = persisted as Partial<Pick<LightState, 'layers' | 'activeId' | 'stackMode'>> | undefined
      if (!raw?.layers?.length) return current
      const layers = raw.layers.map(sanitizeLayer)
      const activeId = layers.some(layer => layer.id === raw.activeId) ? (raw.activeId as string) : layers[0].id
      const stackMode: LightStackMode = raw.stackMode === 'below' ? 'below' : 'above'
      return { ...current, layers, activeId, stackMode }
    }
  })
)

export default useCanvasLightStore
