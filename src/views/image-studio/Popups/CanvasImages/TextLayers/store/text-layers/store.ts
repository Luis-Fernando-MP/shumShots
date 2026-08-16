import { createId } from '@views/image-studio/utils/createId'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextAlign = 'left' | 'center' | 'right'
export type TextTransform = 'none' | 'uppercase' | 'lowercase'
export type TextLayer = {
  id: string
  content: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  weight: number
  transform: TextTransform
  color: string
  opacity: number
  tracking: number
  rotation: number
  stroke: string
  strokeWidth: number
  shadowBlur: number
  shadowY: number
  shadowColor: string
  align: TextAlign
}

type TextLayersState = {
  layers: TextLayer[]
  selectedId: string | null
  addLayer: () => void
  removeLayer: (id: string) => void
  duplicateLayer: (id: string) => void
  selectLayer: (id: string | null) => void
  updateLayer: (id: string, patch: Partial<TextLayer>) => void
  reset: () => void
}

const createLayer = (index: number): TextLayer => ({
  id: createId('text'),
  content: 'Nuevo texto',
  x: 50,
  y: 20 + (index % 5) * 8,
  fontSize: 42,
  fontFamily: 'Impact, sans-serif',
  weight: 700,
  transform: 'uppercase',
  color: '#ffffff',
  opacity: 100,
  tracking: 0,
  rotation: 0,
  stroke: 'transparent',
  strokeWidth: 0,
  shadowBlur: 8,
  shadowY: 4,
  shadowColor: 'rgba(0,0,0,0.45)',
  align: 'center'
})

const useTextLayersStore = create<TextLayersState>()(
  persist(
    (set, get) => ({
      layers: [],
      selectedId: null,
      addLayer: () => {
        const layer = createLayer(get().layers.length)
        set(s => ({ layers: [...s.layers, layer], selectedId: layer.id }))
      },
      removeLayer: id =>
        set(s => ({
          layers: s.layers.filter(layer => layer.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId
        })),
      duplicateLayer: id => {
        const source = get().layers.find(layer => layer.id === id)
        if (!source) return
        const copy = { ...source, id: createId('text'), x: Math.min(90, source.x + 4), y: Math.min(90, source.y + 4) }
        set(s => ({ layers: [...s.layers, copy], selectedId: copy.id }))
      },
      selectLayer: selectedId => set({ selectedId }),
      updateLayer: (id, patch) =>
        set(s => ({
          layers: s.layers.map(layer => (layer.id === id ? { ...layer, ...patch } : layer))
        })),
      reset: () => set({ layers: [], selectedId: null })
    }),
    { name: 'image-studio-text-layers' }
  )
)

export default useTextLayersStore
