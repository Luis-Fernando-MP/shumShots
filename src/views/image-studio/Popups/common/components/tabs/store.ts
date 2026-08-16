import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ALL_TAB_SCOPES, type TabScope } from '@views/image-studio/constants'
import { createId } from '@views/image-studio/utils/createId'

export type TabLayer = {
  id: string
  targetIds: string[]
}

type TabsState = {
  layers: TabLayer[]
  activeLayerId: string
  setActiveLayer: (id: string) => void
  addLayer: (targetIds?: string[]) => void
  removeLayer: (id: string) => void
  setLayerTargets: (ids: string[]) => void
  purgeSlotTargets: (slotIds: string[]) => void
  dropEmptyLayers: () => void
  reset: () => void
}

export const claimedSlotIds = (
  layers: TabLayer[],
  activeId: string,
  allSlotIds: string[]
): string[] => {
  const claimed = new Set<string>()
  for (const layer of layers) {
    if (layer.id === activeId) continue
    if (layer.targetIds.length === 0) {
      for (const id of allSlotIds) claimed.add(id)
    } else {
      for (const id of layer.targetIds) claimed.add(id)
    }
  }
  return [...claimed]
}

const stores = new Map<TabScope, ReturnType<typeof createTabsStore>>()

const createLayer = (): TabLayer => ({
  id: createId('tab'),
  targetIds: []
})

function createTabsStore(scope: TabScope) {
  const initial = createLayer()

  return create<TabsState>()(
    persist(
      (set, get) => ({
        layers: [initial],
        activeLayerId: initial.id,

        setActiveLayer: id => {
          if (!get().layers.some(layer => layer.id === id)) return
          set({ activeLayerId: id })
        },

        addLayer: (targetIds = []) => {
          const layer: TabLayer = { id: createId('tab'), targetIds }
          set(s => ({
            layers: [...s.layers, layer],
            activeLayerId: layer.id
          }))
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
          const { activeLayerId } = get()
          set(s => ({
            layers: s.layers.map(layer =>
              layer.id === activeLayerId ? { ...layer, targetIds: ids } : layer
            )
          }))
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

        dropEmptyLayers: () => {
          set(s => {
            if (s.layers.length <= 1) return s
            const next = s.layers.filter(layer => layer.targetIds.length > 0)
            if (next.length === s.layers.length) return s
            if (next.length === 0) {
              const layer = createLayer()
              return { layers: [layer], activeLayerId: layer.id }
            }
            return {
              layers: next,
              activeLayerId: next.some(layer => layer.id === s.activeLayerId)
                ? s.activeLayerId
                : next[0].id
            }
          })
        },

        reset: () => {
          const layer = createLayer()
          set({ layers: [layer], activeLayerId: layer.id })
        }
      }),
      {
        name: `pixis:image-studio:tabs:${scope}`,
        skipHydration: true,
        storage: createJSONStorage(() => localStorage),
        migrate: persisted => persisted,
        partialize: s => ({
          layers: s.layers,
          activeLayerId: s.activeLayerId
        }),
        merge: (persisted, current) => {
          const data = (persisted ?? {}) as Partial<TabsState>
          const raw =
            Array.isArray(data.layers) && data.layers.length > 0 ? data.layers : current.layers
          const layers = raw.map(layer => ({
            id: typeof layer.id === 'string' ? layer.id : createId('tab'),
            targetIds: Array.isArray(layer.targetIds)
              ? layer.targetIds.filter((id): id is string => typeof id === 'string')
              : []
          }))
          const activeLayerId =
            typeof data.activeLayerId === 'string' &&
            layers.some(layer => layer.id === data.activeLayerId)
              ? data.activeLayerId
              : layers[0].id
          return { ...current, layers, activeLayerId }
        }
      }
    )
  )
}

export type TabsStore = ReturnType<typeof createTabsStore>

export const getTabsStore = (scope: TabScope): TabsStore => {
  let store = stores.get(scope)
  if (!store) {
    store = createTabsStore(scope)
    stores.set(scope, store)
  }
  return store
}

export const ensureTabsStores = (scopes: readonly TabScope[] = ALL_TAB_SCOPES) => {
  for (const scope of scopes) getTabsStore(scope)
}

export const rehydrateAllTabsStores = async () => {
  ensureTabsStores()
  await Promise.all([...stores.values()].map(store => store.persist.rehydrate()))
}
